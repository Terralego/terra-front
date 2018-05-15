import userRequestService from 'services/userRequestService';

export const FETCH = 'userRequestList/FETCH';
export const FETCHED = 'userRequestList/FETCHED';

const initialState = {
  items: [],
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
 * userRequestList action : fetch userrequest list if not loaded
 */
export const getUserRequestList = () => (dispatch, getState) => {
  const state = getState();

  if (state.userRequestList.items.length < 1) {
    dispatch({ type: FETCH });

    return userRequestService.getAll().then(items => dispatch({
      type: FETCHED,
      items,
    }));
  }

  return dispatch({
    type: FETCHED,
    items: state.userRequestList.items,
  });
};
