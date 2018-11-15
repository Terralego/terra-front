import qs from 'query-string';

import log from './log';

export const GET = 'GET';
export const POST = 'POST';
export const PUT = 'PUT';
export const PATCH = 'PATCH';
export const DELETE = 'DELETE';

export const EVENT_FAILURE = 'failure';
export const EVENT_SUCCESS = 'success';

export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};

export class Api {
  host = '/';
  token = '';

  listeners = [];

  async request (endpoint, { method = GET, querystring, body, headers = DEFAULT_HEADERS } = {}) {
    const url = this.buildUrl({ endpoint, querystring });

    log('request start: ', url);

    const response = await fetch(url, {
      method,
      headers: this.buildHeaders(headers),
      body: body instanceof FormData ? body : JSON.stringify(body),
    });

    log('request end: ', url);
    if (response.status < 200 || response.status > 299) {
      throw await this.handleError(response);
    }
    return this.handleSuccess(response);
  }

  buildUrl ({ endpoint, querystring }) {
    return `${this.host}/${endpoint.replace(/\/+/g, '/')}${querystring ? `?${qs.stringify(querystring)}` : ''}`;
  }

  buildHeaders (headers) {
    if (this.token) {
      return {
        ...headers,
        Authorization: `JWT ${this.token}`,
      };
    }
    return headers;
  }

  async handleError (response) {
    const error = new Error(response.statusText);
    try {
      error.data = await response.json();
    } catch (e) {
      //
    }
    this.fire(EVENT_FAILURE, response);
    return error;
  }

  async handleSuccess (response) {
    let data;
    try {
      data = await response.json();
    } catch (e) {
      //
    }
    this.fire(EVENT_SUCCESS, response);
    return data;
  }

  on (eventName, callback) {
    const listener = { eventName, callback };
    this.listeners.push(listener);
    return () => {
      const pos = this.listeners.findIndex(l => l === listener);
      if (pos > -1) {
        this.listeners.splice(pos, 1);
      }
    };
  }

  fire (eventName, response) {
    this.listeners.forEach(listener => {
      if (listener.eventName === eventName &&
          listener.callback &&
          typeof listener.callback === 'function') {
        listener.callback(response);
      }
    });
  }
}

export default new Api();
