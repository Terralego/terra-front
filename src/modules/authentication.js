import tokenService from 'services/tokenService';
import { TOKEN_API } from 'middlewares/token';

export const OBTAIN_TOKEN = 'authentication/OBTAIN_TOKEN';
export const REFRESH_TOKEN = 'authentication/REFRESH_TOKEN';
export const RECEIVE_TOKEN = 'authentication/RECEIVE_TOKEN';
export const RESET_TOKEN = 'authentication/RESET_TOKEN';
export const SET_AUTHENTICATION = 'authentication/SET_AUTHENTICATION';
export const REQUEST_LOG_OUT = 'authentication/REQUEST_LOG_OUT';
export const SET_ERROR_MESSAGE = 'authentication/SET_ERROR_MESSAGE';

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
    case OBTAIN_TOKEN:
    case REFRESH_TOKEN:
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
        isAuthenticated: action.isAuthenticated,
        receivedAt: action.receivedAt,
        user: action.user,
      };
    case RESET_TOKEN:
    case SET_AUTHENTICATION:
      return {
        ...state,
        isAuthenticated: action.isAuthenticated,
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
  };
}

/**
 * Handle when user log out : delete token and restore authorization status
 */
export const logoutUser = () => dispatch => {
  tokenService.removeToken();
  dispatch({ type: REQUEST_LOG_OUT });
};

/**
 * Make a refresh request to the API.
 *
 * Allow the user to not relog if the current token
 * is still in the period of 'refresh token allowed'.
 *
 */
export const refreshToken = () => ({
  [TOKEN_API]: {
    type: REFRESH_TOKEN,
    endpoint: '/auth/refresh-token/',
    body: { token: tokenService.getToken() },
  },
});

/**
 * Handle when user log in
 * @param {object} creds : credentials object
 * @param {string} creds.email
 * @param {string} creds.password
 */
export const loginUser = creds => ({
  [TOKEN_API]: {
    type: OBTAIN_TOKEN,
    endpoint: '/auth/obtain-token/',
    body: creds,
  },
});
