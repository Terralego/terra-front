import { CALL_API } from 'middlewares/api';

export const REQUEST = 'userRequestList/REQUEST';
export const SUCCESS = 'userRequestList/SUCCESS';
export const FAILURE = 'userRequestList/FAILURE';

const initialState = {
  items: {},
  loading: false,
};

const getItemsFromResponse = response => {
  const items = {};
  response.forEach(userrequest => {
    items[userrequest.id] = userrequest;
  });
  return items;
};

/**
 * userRequestList reducer
 */
const userRequestList = (state = initialState, action) => {
  switch (action.type) {
    case REQUEST:
      return {
        ...state,
        loading: true,
      };
    case SUCCESS:
      return {
        ...state,
        loading: false,
        items: getItemsFromResponse(action.response),
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

  if (Object.keys(state.userRequestList.items).length < 1) {
    dispatch({
      [CALL_API]: {
        endpoint: '/userrequest/',
        authenticated: true,
        types: [REQUEST, SUCCESS, FAILURE],
        config: { method: 'GET' },
      },
    });
  }
};
