import userRequestService from 'services/userRequestService';
import initialState from 'modules/userRequest-initial';

export const UPDATE_VALUE = 'userRequest/UPDATE_VALUE';
export const UPDATE_DATA_PROPERTIES = 'userRequest/UPDATE_DATA_PROPERTIES';
export const POST_DATA = 'userRequest/POST_DATA';
export const SUBMIT_DATA_SUCCESS = 'userRequest/SUBMIT_DATA_SUCCESS';
export const SUBMIT_DATA_FAILED = 'userRequest/SUBMIT_DATA_FAILED';

/**
 * userRequest reducer
 */
const userRequest = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_VALUE:
      return {
        ...state,
        [action.key]: action.value,
      };
    case UPDATE_DATA_PROPERTIES:
      return {
        ...state,
        data: {
          ...state.data,
          properties: {
            ...state.data.properties,
            ...action.properties,
          },
        },
      };
    case POST_DATA:
      return {
        ...state,
        submitted: true,
      };
    case SUBMIT_DATA_FAILED:
      return {
        ...state,
        error: action.error,
      };
    default:
      return state;
  }
};

export default userRequest;

/**
 * userRequest action
 * updateRequestValue create or update a value of userRequest key
 * @param  {string} key : the key of the new userRequest value
 * @param  {any} value : the new value
 */
export const updateRequestValue = (key, value) => dispatch => {
  dispatch({
    type: UPDATE_VALUE,
    key,
    value,
  });
};

/**
 * userRequest action
 * updateRequestProperties add or update an object of properties
 * @param  {object} properties : object of properties to add / update in userRequest object
 */
export const updateRequestProperties = properties => dispatch => {
  dispatch({
    type: UPDATE_DATA_PROPERTIES,
    properties,
  });
};

/**
 * userRequest action
 * handleError handle error api while submit
 * @param  {object} error
 */
export const handleError = error => dispatch => {
  dispatch({
    type: SUBMIT_DATA_FAILED,
    error,
  });
};


/**
 * userRequest action : submit data object
 * @param  {object} data : data that will be send to the server
 */
export const submitData = data => dispatch => {
  dispatch({
    type: POST_DATA,
  });

  return userRequestService.post(data).then(response => {
    dispatch({
      type: SUBMIT_DATA_SUCCESS,
      response,
    });
  }).catch(err => dispatch(handleError(err.toString())));
};
