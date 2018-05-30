import { CALL_API } from 'middlewares/api';

export const REQUEST_ALL = 'userrequestList/REQUEST_ALL';
export const SUCCESS_ALL = 'userrequestList/SUCCESS_ALL';
export const FAILURE_ALL = 'userrequestList/FAILURE_ALL';
export const REQUEST_DETAIL = 'userrequestList/REQUEST_DETAIL';
export const SUCCESS_DETAIL = 'userrequestList/SUCCESS_DETAIL';
export const FAILURE_DETAIL = 'userrequestList/FAILURE_DETAIL';

const initialState = {
  items: {},
  loading: false,
};

const getItemsFromResponse = data => {
  const items = {};
  data.forEach(userrequest => {
    items[userrequest.id] = userrequest;
  });
  return items;
};

/**
 * userrequestList reducer
 */
const userrequestList = (state = initialState, action) => {
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
        items: getItemsFromResponse(action.data),
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

export default userrequestList;


/**
 * userrequestList action : fetch userrequest list
 */
export const getUserrequestList = () => ({
  [CALL_API]: {
    endpoint: '/userrequest/',
    types: [REQUEST_ALL, SUCCESS_ALL, FAILURE_ALL],
    config: { method: 'GET' },
  },
});

/**
 * userrequest action : fetch userrequest
 * @param {string} id
 */
export const getUserrequest = id => ({
  [CALL_API]: {
    endpoint: `/userrequest/${id}`,
    authenticated: true,
    types: [REQUEST_DETAIL, SUCCESS_DETAIL, FAILURE_DETAIL],
    config: { method: 'GET' },
  },
});
