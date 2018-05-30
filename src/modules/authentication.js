import tokenService from 'services/tokenService';
import apiService from 'services/apiService';
import { enableTimerRefreshToken, disableTimerRefreshToken } from 'modules/authenticationTimer';

export const REQUEST_TOKEN = 'authentication/REQUEST_TOKEN';
export const REFRESH_TOKEN = 'authentication/REFRESH_TOKEN';
export const RECEIVE_TOKEN = 'authentication/RECEIVE_TOKEN';
export const RESET_TOKEN = 'authentication/RESET_TOKEN';
export const SET_AUTHENTICATION = 'authentication/SET_AUTHENTICATION';
export const REQUEST_LOG_OUT = 'authentication/REQUEST_LOG_OUT';
export const SET_ERROR_MESSAGE = 'authentication/SET_ERROR_MESSAGE';

const handleTokenErrors = error => {
  let errorMessage = '';

  if (error.response && error.response.data) {
    if (error.response.data.password) {
      errorMessage += `Password : ${error.response.data.password[0]}`;
    }
    if (error.response.data.username) {
      errorMessage += `Login : ${error.response.data.username[0]}`;
    }
    if (error.response.data.non_field_errors
      && error.response.data.non_field_errors.length > 0) {
      errorMessage += error.response.data.non_field_errors[0];
    }
  } else {
    errorMessage = error;
  }

  return errorMessage;
};

function parseJwt (token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace('-', '+').replace('_', '/');
  return JSON.parse(window.atob(base64));
}

const initialState = {
  isFetching: false,
  isAuthenticated: !!localStorage.getItem('token'),
  receivedAt: null,
  errorMessage: null,
  user: null,
};

/**
 * REDUCER
 * --------------------------------------------------------- *
 */
const authentication = (state = initialState, action) => {
  switch (action.type) {
    case REQUEST_TOKEN:
    case REQUEST_LOG_OUT:
      return {
        ...state,
        isFetching: true,
        isAuthenticated: false,
      };
    case RECEIVE_TOKEN:
      return {
        ...state,
        isFetching: false,
        receivedAt: action.receivedAt,
      };
    case RESET_TOKEN:
    case SET_AUTHENTICATION:
      return {
        ...state,
        isAuthenticated: action.isAuthenticated,
        user: action.user,
      };
    case SET_ERROR_MESSAGE:
      return {
        ...state,
        errorMessage: action.message,
      };
    default:
      return state;
  }
};

export default authentication;

/**
 * ACTIONS
 * --------------------------------------------------------- *
 */

export function requestToken () {
  return {
    type: REQUEST_TOKEN,
  };
}

export function requestLogOut () {
  return {
    type: REQUEST_LOG_OUT,
  };
}

/**
 * Action handle when fetch token failed
 * @param  {string} errorMessage
 */
export function setErrorMessage (errorMessage) {
  return {
    type: SET_ERROR_MESSAGE,
    errorMessage,
  };
}

/**
 * Set authorization status
 */
export function setAuthentication () {
  return {
    type: SET_AUTHENTICATION,
    isAuthenticated: tokenService.isAuthenticated(),
    user: tokenService.isAuthenticated() && parseJwt(tokenService.getToken()),
  };
}

export function resetToken () {
  tokenService.removeToken();
  return {
    type: RESET_TOKEN,
    isAuthenticated: tokenService.isAuthenticated(),
  };
}

/**
 * Recieve token
 * @param {object} user
 */
export const receiveToken = user => ({
  type: RECEIVE_TOKEN,
  user,
  isAuthenticated: true,
  receivedAt: Date.now(),
});

/**
 * Make a refresh request to the API.
 *
 * Allow the user to not relog if the current token
 * is still in the period of 'refresh token allowed'.
 *
 */
export const refreshToken = () => dispatch => {
  const token = tokenService.getToken();

  dispatch(requestToken());
  dispatch(setAuthentication());

  return apiService.refreshToken(token)
    .then(response => {
      dispatch(receiveToken());

      if (response.data && response.data.token) {
        tokenService.setToken(response.data.token);
        dispatch(setAuthentication());
      }
    })
    .catch(error => {
      const errorMessage = handleTokenErrors(error);
      dispatch(setErrorMessage(errorMessage));
      dispatch(receiveToken(null));
    });
};

/**
 * Handle when user log in
 * @param {string} email
 * @param {string} password
 */
export const loginUser = ({ email, password }) => dispatch => {
  dispatch(requestToken());
  // dispatch(setAuthentication());

  return apiService
    .login(email, password)
    .then(response => {
      dispatch(receiveToken());
      if (response && response.data.token) {
        tokenService.setToken(response.data.token);
        dispatch(setAuthentication());
        dispatch(enableTimerRefreshToken());
      }
    })
    .catch(error => {
      dispatch(receiveToken());
      const errorMessage = handleTokenErrors(error);
      dispatch(setErrorMessage(errorMessage));
    });
};

export const logout = () => dispatch => {
  dispatch(requestLogOut());
  dispatch(disableTimerRefreshToken());
  dispatch(resetToken());
};
