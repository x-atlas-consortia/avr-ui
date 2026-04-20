import React from 'react';
import DataTable from 'react-data-table-component'

class AntibodyHitsTable extends React.Component {

  render(){
    const { hits } = this.props;
    const linkOutIcon = <i className="bi bi-box-arrow-up-right"></i>

    function a_hrefs(url_prefix, url_suffix, data_s) {
      let cs = '';
      const data_l = data_s.split(',');
      for (let i = 0; i < data_l.length; i++ ) {
        let data = data_l[i].trim();
        if (i > 0) {
          cs += ', ';
        }
        cs += `<div class="text-truncate"><a href="${url_prefix}${data}${url_suffix}" target="_blank">${data} <i class="bi bi-box-arrow-up-right"></i></a></div>`;
      }
      return cs;
    }

    function a_href_omap_id(omap_id) {
      if (omap_id in omap_id_linkage) {
        return <div className="text-truncate"><a href={omap_id_linkage[omap_id]} target="_blank">{omap_id} {linkOutIcon}</a></div>
      } else {
        return <div className="text-truncate">{omap_id}</div>;
      }
    }

    function titleCase(str) {
      return str.replace(
            /\w\S*/g,
            text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
        )
    }

    function fieldFormat(hit, f) {

      if (f === 'target_symbol') {
        return a_hrefs('https://www.uniprot.org/uniprotkb?query=(protein_name:%22', '%22)', hit._source[f])
      }

      if (f === 'uniprot_accession_number') {
        return a_hrefs('https://www.uniprot.org/uniprot/', '#section_general', hit._source.uniprot_accession_number)
      }

      if (f === 'protocol_doi') {
        return a_hrefs('https://doi.org/', '', hit._source.protocol_doi)
      }

      if (f === 'author_orcids') {
        return a_hrefs('https://orcid.org/', '', hit._source.author_orcids);
      }

      if (f === 'hgnc_id') {
        return a_hrefs('https://www.genenames.org/tools/search/#!/?query=', '', hit._source.hgnc_id);
      }

      if (f === 'avr_pdf_filename') {
        if (hit._source.avr_pdf_filename === undefined) {
          return <></>
        }
        return <div className="text-truncate"><a title={hit._source.avr_pdf_filename} href={`${assets_url}/${hit._source.avr_pdf_uuid}/${hit._source.avr_pdf_filename}`} target="_blank">{hit._source.avr_pdf_filename} {linkOutIcon}</a></div>
      }

      if (f === 'omap_id') {
        return a_href_omap_id(hit._source.omap_id)
      }

      if (f === 'rrid') {
        return <a href={`https://scicrunch.org/resolver/RRID:${hit._source.rrid}`} target="_blank">{hit._source.rrid} {linkOutIcon}</a>
      }

      if (f === 'manuscript_doi') {
        if (hit._source.manuscript_doi !== '') {
          return <a href={`https://doi.org/${hit._source.manuscript_doi}`} target="_blank">{hit._source.manuscript_doi}{linkOutIcon}</a>
        }
        return <></>
      }

      if (f === 'organ_uberon_id') {
        let organ_uberon_id_url_encode = hit._source.organ_uberon_id.replace(':', '%3A');
        return <a href={`https://www.ebi.ac.uk/ols/search?q=${organ_uberon_id_url_encode}`} target="_blank">{hit._source.organ_uberon_id} {linkOutIcon}</a>
      }

      if (f === 'created_by_user_email') {
        return <a href={`mailto:${hit._source.created_by_user_email}`} target="_blank">{hit._source.created_by_user_email} {linkOutIcon}</a>
      }

      if (f === 'previous_version_id') {
        if (hit._source.previous_version_pdf_filename !== undefined) {
          const uuidNoHyphens = hit._source.previous_version_pdf_uuid?.replaceAll("-", "");
          return <a href={`${assets_url}/${uuidNoHyphens}/${hit._source.previous_version_pdf_filename}`} target="_blank">{hit._source.previous_version_id}</a>
        }
        return <></>
      }

      if (f === 'cell_marker') {
        if (hit._source.cell_marker !== undefined && hit._source.cell_marker.length) {
          return (
            <a
              target="_blank"
              href={`http://purl.obolibrary.org/obo/${hit._source.cell_marker.replace(":", "_")}`}
            >
              {hit._source.cell_marker} {linkOutIcon}
            </a>
          );
        }
        return <></>
      }

      return <span>{hit._source[f]}</span>
    }

    function tableColumns() {
      const fieldNames = {
        uniprot_accession_number: 'UniProt#',
        avr_pdf_filename: 'Validation Report',
        clone_id: 'Clone ID',
        omap_id: 'OMAP ID',
        rrid: 'RRID',
        catalog_number: 'Catalog#',
        lot_number: 'Lot#',
        author_orcids: 'Author ORCiDs',
        hgnc_id: 'HGNC ID',
        cycle_number: 'Cycle#',
        manuscript_doi: 'Manuscript DOI',
        protocol_doi: 'Protocol DOI',
        organ_uberon_id: 'Organ UBERON ID',
        created_by_user_email: 'Submitter Email',
        previous_version_id: 'Previous Revision ID',
        segmentation_cell_membrane: 'Segmentation/Cell Membrane'
      }

      const fields = ['target_symbol', 'uniprot_accession_number', 'clonality', 'clone_id', 'method', 'tissue_preservation', 'avr_pdf_filename', 'omap_id', 'antibody_hubmap_id', 
        'host', 'rrid', 'catalog_number', 'lot_number', 'vendor_name', 'recombinant', 'organ', 'author_orcids', 'hgnc_id', 'isotype', 'concentration_value', 'dilution_factor', 
        'conjugate', 'cycle_number', 'fluorescent_reporter', 'manuscript_doi', 'protocol_doi', 'vendor_affiliation', 'organ_uberon_id', 'antigen_retrieval', 'created_by_user_email', 
        'previous_version_id', 'senescence_specific', 'cell_marker', 'segmentation_cell_membrane', 'taxon', 'recommended']

      const columns = []
      let col = {}
      for (const f of fields) {
        col = {
          name: fieldNames[f] || titleCase(f?.replaceAll('_', ' ')),
          id: f,
          selector: row => row._source[f] || '',
          omit: display[f] ? display[f] !== 'table-cell' : undefined,
          sortable: true,
          reorder: true,
          format: (hit) => {
            return <>{fieldFormat(hit, f)}</>
          }
        }
        if (['target_symbol', 'uniprot_accession_number', 'author_orcids', 'hgnc_id', 'protocol_doi'].indexOf(f) !== -1) {
          col.format = (hit) => {
            return <span dangerouslySetInnerHTML={{__html: fieldFormat(hit, f)}} ></span>
          }
        }
        columns.push(col)
      }
      return columns
    }

    return (
      <div className='sk-table__wrap'>
        <DataTable columns={tableColumns()} data={hits} />
      </div>
    )
  }
}

export default AntibodyHitsTable;
