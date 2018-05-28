import authService from '../services/authService';

export const LOGIN_REQUEST = 'authentication/LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'authentication/LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'authentication/LOGIN_FAILURE';

export const LOGOUT_REQUEST = 'authentication/LOGOUT_REQUEST';
export const LOGOUT_SUCCESS = 'authentication/LOGOUT_SUCCESS';

const initialState = {
  isFetching: false,
  isAuthenticated: localStorage.getItem('token') || false,
};

/**
 * REDUCER
 * --------------------------------------------------------- *
 */
const authentication = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
      return {
        ...state,
        isFetching: true,
        isAuthenticated: false,
        user: action.creds,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: true,
        errorMessage: '',
      };
    case LOGIN_FAILURE:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: false,
        errorMessage: action.message,
      };
    case LOGOUT_SUCCESS:
      return {
        ...state,
        isFetching: true,
        isAuthenticated: false,
      };
    default:
      return state;
  }
};

export default authentication;

/**
 * LOGIN ACTIONS
 * --------------------------------------------------------- *
 */
export const requestLogin = creds => ({
  type: LOGIN_REQUEST,
  isFetching: true,
  isAuthenticated: false,
  creds,
});

export const receiveLogin = user => ({
  type: LOGIN_SUCCESS,
  isFetching: false,
  isAuthenticated: true,
  token: user.token,
});

export const loginError = message => ({
  type: LOGIN_FAILURE,
  isFetching: false,
  isAuthenticated: false,
  message,
});

/**
 * LOGOUT ACTIONS
 * --------------------------------------------------------- *
 */
export const requestLogout = ({
  type: LOGOUT_REQUEST,
  isFetching: true,
  isAuthenticated: true,
});

export const receiveLogout = ({
  type: LOGOUT_SUCCESS,
  isFetching: false,
  isAuthenticated: false,
});

// Logs the user out
export const logoutUser = dispatch => {
  dispatch(requestLogout());
  localStorage.removeItem('token');
  localStorage.removeItem('access_token');
  dispatch(receiveLogout());
};

// Calls the API to get a token and
// dispatches actions along the way
export const loginUser = creds => dispatch => {
  // We dispatch requestLogin to kickoff the call to the API
  dispatch(requestLogin(creds));
  return authService.getToken(creds)
    .then(response => {
      // If login was successful, set the token in local storage
      localStorage.setItem('token', response.token);
      // Dispatch the success action
      return dispatch(receiveLogin({ ...creds, token: response.token }));
    }).catch(err => dispatch(loginError(err.message)));
};
