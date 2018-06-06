export const UPDATE_VALUE = 'userrequest/UPDATE_VALUE';

const initialState = {};

/**
 * REDUCER
 * --------------------------------------------------------- *
 */
const userrequest = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_VALUE:
      return {
        ...state,
        [action.key]: action.value,
      };
    default:
      return state;
  }
};

export default userrequest;


/**
 * ACTIONS
 * --------------------------------------------------------- *
 */

/**
 * userrequest action
 * updateRequestValue create or update a value of userrequest key
 * @param  {string} key : the key of the new userrequest value
 * @param  {any} value : the new value
 */
export const updateConfigValue = (key, value) => ({
  type: UPDATE_VALUE,
  key,
  value,
});
