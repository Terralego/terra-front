import { CALL_API } from 'middlewares/api';

export const REQUEST_ALL = 'userRequestList/REQUEST_ALL';
export const SUCCESS_ALL = 'userRequestList/SUCCESS_ALL';
export const FAILURE_ALL = 'userRequestList/FAILURE_ALL';
export const REQUEST_DETAIL = 'userRequestList/REQUEST_DETAIL';
export const SUCCESS_DETAIL = 'userRequestList/SUCCESS_DETAIL';
export const FAILURE_DETAIL = 'userRequestList/FAILURE_DETAIL';

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
    case REQUEST_ALL:
      return {
        ...state,
        loading: true,
      };
    case SUCCESS_ALL:
      return {
        ...state,
        loading: false,
        items: getItemsFromResponse(action.response),
      };
    case REQUEST_DETAIL:
      return {
        ...state,
        loading: true,
      };
    case SUCCESS_DETAIL:
      return {
        ...state,
        loading: false,
        items: {
          ...state.items,
          [action.response.id]: action.response,
        },
      };
    default:
      return state;
  }
};

export default userRequestList;


/**
 * userRequestList action : fetch userrequest list
 */
export const getUserRequestList = () => ({
  [CALL_API]: {
    endpoint: '/userrequest/',
    authenticated: true,
    types: [REQUEST_ALL, SUCCESS_ALL, FAILURE_ALL],
    config: { method: 'GET' },
  },
});

/**
 * userRequest action : fetch userrequest
 */
export const getUserRequest = id => ({
  [CALL_API]: {
    endpoint: `/userrequest/${id}`,
    authenticated: true,
    types: [REQUEST_DETAIL, SUCCESS_DETAIL, FAILURE_DETAIL],
    config: { method: 'GET' },
  },
});
