import initialState from 'modules/userRequest-initial';

export const UPDATE_VALUE = 'userRequest/UPDATE_VALUE';
export const UPDATE_PROPERTIES = 'userRequest/UPDATE_PROPERTIES';

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
    case UPDATE_PROPERTIES:
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

export default userRequest;

/**
 * userRequest action : create or update a value of userRequest key
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
 * userRequest action : add or update an object of properties
 * @param  {object} properties : object of properties to add / update in userRequest object
 */
export const updateRequestProperties = properties => dispatch => {
  dispatch({
    type: UPDATE_PROPERTIES,
    properties,
  });
};
