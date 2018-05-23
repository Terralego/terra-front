import 'whatwg-fetch';
import settings from 'front-settings';
import { checkStatus, parseJSON } from 'helpers/fetchHelpers';

const userRequestService = {
  post: data => fetch(`${settings.api_url}/userrequest/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then(checkStatus)
    .then(parseJSON),

  put: (id, data) => fetch(`${settings.api_url}/userrequest/${id}`, {
    method: 'PUT',
    headers: {},
    body: JSON.stringify(data),
  })
    .then(checkStatus)
    .then(parseJSON),

  getAll: () => fetch(`${settings.api_url}/userrequest/`, {
    method: 'GET',
    headers: {},
  })
    .then(checkStatus)
    .then(parseJSON),

  get: id => fetch(`${settings.api_url}/userrequest/${id}`, {
    method: 'GET',
    headers: {},
  }).then(checkStatus)
    .then(parseJSON),

  getComments: userRequestId => fetch(`${settings.api_url}/userrequest/${userRequestId}/comment`, {
    method: 'GET',
    headers: {},
  }).then(checkStatus)
    .then(parseJSON),

  postComment: (userRequestId, comment) => fetch(`${settings.api_url}/userrequest/${userRequestId}/comment/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(comment),
  }).then(checkStatus)
    .then(parseJSON),
};

export default userRequestService;
