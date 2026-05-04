from flask import Blueprint, current_app, jsonify, make_response, request, abort
from antibodyapi.utils import (
    base_antibody_query, base_antibody_query_result_to_json, get_cursor
)
from antibodyapi.utils.elasticsearch import index_antibody
import elasticsearch
import requests
import logging
import concurrent.futures
import threading

from antibodyapi.utils.decorators import require_data_admin, require_avr_group

restore_elasticsearch_blueprint = Blueprint('restore_elasticsearch', __name__)
logger = logging.getLogger(__name__)

@restore_elasticsearch_blueprint.route('/restore_elasticsearch', methods=['PUT'])
@require_data_admin()
def restore_elasticsearch():
    asynchronous = request.args.get('async')
    app_obj = current_app._get_current_object()
    if asynchronous:
        try:
            with concurrent.futures.ThreadPoolExecutor() as executor:
                future = executor.submit(_restore_elasticsearch, app_obj)
                result = future.result()
        except Exception as e:
            logger.exception(e)
            abort(500, description=f"restore_elasticsearch {e}")

    else:
        try:
            threading.Thread(target=_restore_elasticsearch, args=app_obj).start()
            logger.info("Started to restore ES index")
        except Exception as e:
            logger.exception(e)
            abort(500, description=f"restore_elasticsearch {e}")


    return make_response(jsonify({'message': f"Request of reindexing in async={asynchronous} mode accepted"}), 202)


def _restore_elasticsearch(current_app):
    """
    This endpoint will restore the ElasticSearch index from the data that has been stored
    in the database. However, since the 'target_aliases' field in ElasticSearch is not saved
    in the database but derived from a UBKG API endpoint, it must be reconstituted from there.
    """
    # Delete the index...
    server: str = current_app.config['ELASTICSEARCH_SERVER']
    ubkg_api_url: str = current_app.config['UBKG_API_URL']
    es_conn = elasticsearch.Elasticsearch([server])

    antibody_elasticsearch_index: str = current_app.config['ANTIBODY_ELASTICSEARCH_INDEX']
    print(f'Zeroing Elastic Search index {antibody_elasticsearch_index} on server {server}')
    es_conn.indices.delete(index=antibody_elasticsearch_index, ignore=[400, 404])
    es_conn.indices.create(index=antibody_elasticsearch_index)

    print(f'Restoring Elastic Search index {antibody_elasticsearch_index} on server {server}')
    cur = get_cursor(current_app)
    cur.execute(base_antibody_query() + ' ORDER BY a.id ASC')
    print(f'Rows retrieved: {cur.rowcount}')
    results = []
    for antibody_array in cur:
        antibody: dict = base_antibody_query_result_to_json(antibody_array)
        target_symbol: str = antibody['target_symbol']
        ubkg_rest_url: str = f"{ubkg_api_url}/relationships/gene/{target_symbol}"
        response = requests.get(ubkg_rest_url, headers={"Accept": "application/json"}, verify=False)
        target_aliases: list = [target_symbol]
        if response.status_code == 200:
            response_json: dict = response.json()
            target_aliases += response_json["symbol-alias"] + response_json["symbol-previous"]
        antibody['target_aliases'] = target_aliases
        index_antibody(antibody)
    return make_response(jsonify(antibodies=results), 200)