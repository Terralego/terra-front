import initialState from 'modules/request-initial';

export const UPDATE_REQUEST_VALUE = 'request/UPDATE_REQUEST_VALUE';
export const UPDATE_REQUEST_PROPERTIES = 'request/UPDATE_REQUEST_PROPERTIES';

/**
 * request reducer
 */
const request = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_REQUEST_VALUE:
      return {
        ...state,
        [action.key]: action.value,
      };
    case UPDATE_REQUEST_PROPERTIES:
      return {
        ...state,
        properties: {
          ...state.properties,
          ...action.properties,
        },
      };
    default:
      return state;
  }
};

export default request;

/**
 * request action : create or update a value of request key
 * @param  {string} key : the key of the new request value
 * @param  {any} value : the new value
 */
export const updateRequestValue = (key, value) => dispatch => {
  dispatch({
    type: UPDATE_REQUEST_VALUE,
    key,
    value,
  });
};

/**
 * request action : add or update an object of properties
 * @param  {object} properties : object of properties to add / update in request object
 */
export const updateRequestProperties = properties => dispatch => {
  dispatch({
    type: UPDATE_REQUEST_PROPERTIES,
    properties,
  });
};
