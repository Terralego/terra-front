import 'whatwg-fetch';
import settings from 'front-settings';
import { checkStatus, parseJSON } from 'helpers/fetchHelpers';

const authService = {
  getToken: creds => fetch(`${settings.api_url}/auth/obtain-token/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(creds),
  })
    .then(checkStatus)
    .then(parseJSON),
};

export default authService;
