
from functools import wraps
from flask import abort, current_app, request
from inspect import signature
from antibodyapi.utils.validation import json_error
import globus_sdk
from werkzeug.exceptions import HTTPException

def require_data_admin(param: str = "token", group_param: str = "group"):
  
  def decorator(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
      try:
        
        result = _require_token(current_app.config['GROUP_ADMIN_IDS'].split(','))
        if param and param in signature(f).parameters:
          kwargs[param] = result[1]

        if group_param in signature(f).parameters:
           kwargs[group_param] = result[0]

      except HTTPException as err:
        abort(json_error(err.description, err.code))
      except globus_sdk.GroupsAPIError as err:
        abort(json_error(f"{err.http_reason}: {err.message}", err.http_status))
      except Exception as err:
        abort(json_error(f"Error occurred {err}.", 500))

      return f(*args, **kwargs)

    return decorated_function

  return decorator

def require_avr_group(param: str = "token", group_param: str = "group"):
  
  def decorator(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
      try:
        
        result = _require_token(current_app.config['CONSORTIUM_AVR_UPLOADERS_GROUP_ID'].split(','))
        if param and param in signature(f).parameters:
          kwargs[param] = result[1]

        if group_param in signature(f).parameters:
           kwargs[group_param] = result[0]

      except HTTPException as err:
        abort(json_error(err.description, err.code))
      except globus_sdk.GroupsAPIError as err:
        abort(json_error(f"{err.http_reason}: {err.message}", err.http_status))
      except Exception as err:
        abort(json_error(f"Error occurred {err}.", 500))

      return f(*args, **kwargs)

    return decorated_function

  return decorator


def _require_token(config_group_ids):
  auth_header = request.headers.get('Authorization')
        
  token = None
  if auth_header:
      token = auth_header.split(" ")[1]

  if auth_header is None or token is None:
      abort(400, description="A token is required")

  globus_groups_client = globus_sdk.GroupsClient( 
      authorizer=globus_sdk.AccessTokenAuthorizer(token) 
  ) 
  my_groups = globus_groups_client.get_my_groups() 

  found = False
  my_group_ids = [g for g in my_groups]
  for g in my_group_ids:
    if g['id'] in config_group_ids:
        found = g
        break

  if found == False:
    abort(401, description="No administrative rights to perform this action.")

  return found, token
   