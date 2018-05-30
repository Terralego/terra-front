import settings from 'front-settings';
import axios from 'axios';

import tokenService from 'services/tokenService';

export const SIGNATURE_HAS_EXPIRED = 'Signature has expired.';

function addTokenToHeader (config) {
  const token = tokenService.getToken();
  if (token !== null) {
    return { ...config, headers: { ...config.headers, Authorization: `JWT ${token}` } };
  }
  return config;
}

class ApiService {
  constructor () {
    /**
     * Useful to know if a refresh token is in progress.
     *
     * If it is, we must refresh only one time.
     *
     * If the result is an error,
     * we must return the error to the caller.
     */
    this.refreshingToken = false;

    this.instance = axios.create({
      baseURL: settings.API_URL, // SITE_API_URL is set in index.html
      timeout: 0,
    });

    this.interceptorTokenID = this.instance.interceptors.request.use(addTokenToHeader);
  }

  setErrorHandler (errorHandler) {
    if (errorHandler) {
      this.instance.interceptors.response.use(
        response => response,
        error => {
          errorHandler(error);
          return Promise.reject(error);
        },
      );
    }
  }

  /**
   * Token endpoints
   */
  refreshToken (token) {
    return this.instance.request({
      method: 'POST',
      url: 'auth/refresh-token/',
      data: { token },
    });
  }

  /**
   * User endpoints
   */
  login (email, password) {
    return this.instance.request({
      method: 'POST',
      url: 'auth/obtain-token/',
      data: { email, password },
    });
  }
  // logout () {
  //   return this.instance
  //     .request({
  //       method: 'POST',
  //       url: 'logout/',
  //     })
  //     .then(() => {
  //       this.token = null;
  //     });
  // }

  request (endpoint, config) {
    return this.instance.request({
      method: 'GET',
      url: endpoint,
      ...config,
    });
  }
}

export const apiService = new ApiService();

export default apiService;
