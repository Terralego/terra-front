import userRequestService from 'services/userRequestService';

export const FETCH = 'userRequestList/FETCH';
export const FETCHED = 'userRequestList/FETCHED';

const initialState = {
  items: {},
  loading: false,
};

/**
 * userRequestList reducer
 */
const userRequestList = (state = initialState, action) => {
  switch (action.type) {
    case FETCH:
      return {
        ...state,
        loading: true,
      };
    case FETCHED:
      return {
        ...state,
        loading: false,
        items: action.items,
      };
    default:
      return state;
  }
};

export default userRequestList;

/**
 * updateItems action : update items object
 * @param  {object} items : object contains all userrequests, ordered by ids
 */
export const updateItems = items => dispatch => {
  dispatch({
    type: FETCHED,
    items,
  });
};


/**
 * userRequestList action : fetch userrequest list if not loaded
 */
export const getUserRequestList = () => (dispatch, getState) => {
  const state = getState();

  if (Object.keys(state.userRequestList.items).length < 1) {
    dispatch({ type: FETCH });

    return userRequestService.getAll().then(response => {
      const items = {};
      response.forEach(userrequest => {
        items[userrequest.id] = userrequest;
      });

      return dispatch(updateItems(items));
    });
  }

  return dispatch(updateItems(state.userRequestList.items));
};
