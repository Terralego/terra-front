import 'whatwg-fetch';
import settings from 'front-settings';

function checkStatus (response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

function parseJSON (response) {
  return response.json();
}

const userRequestService = {
  post: data => fetch(`${settings.api_url}/userrequest/`, {
    method: 'POST',
    header: {},
    body: JSON.stringify(data),
  })
    .then(checkStatus)
    .then(parseJSON),

  put: (id, data) => fetch(`${settings.api_url}/userrequest/${id}`, {
    method: 'PUT',
    header: {},
    body: JSON.stringify(data),
  })
    .then(checkStatus)
    .then(parseJSON),

  getAll: () => fetch(`${settings.api_url}/userrequest/`, {
    method: 'GET',
    header: {},
  })
    .then(checkStatus)
    .then(parseJSON),

  get: id => fetch(`${settings.api_url}/userrequest/${id}`, {
    method: 'GET',
    header: {},
  }).then(checkStatus)
    .then(parseJSON),
};

export default userRequestService;
