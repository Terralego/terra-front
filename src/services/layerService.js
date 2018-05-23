import 'whatwg-fetch';
import settings from 'front-settings';
import { checkStatus, parseJSON } from 'helpers/fetchHelpers';

const layerService = {
  getAll: () => fetch(`${settings.api_url}/layer/`, {
    method: 'GET',
    headers: {},
  })
    .then(checkStatus)
    .then(parseJSON),

  get: id => fetch(`${settings.api_url}/layer/${id}`, {
    method: 'GET',
    headers: {},
  }).then(checkStatus)
    .then(parseJSON),
};

export default layerService;
