import { createSelector } from 'reselect';
import moment from 'moment';
import { CALL_API } from 'middlewares/api';

export const FETCH = 'userRequestComments/FETCH';
export const FETCHED = 'userRequestComments/FETCHED';
export const POST_DATA = 'userRequestComments/POST_DATA';
export const SUBMIT_DATA_SUCCESS = 'userRequestComments/SUBMIT_DATA_SUCCESS';
export const SUBMIT_DATA_FAILED = 'userRequestComments/SUBMIT_DATA_FAILED';

const initialState = {
  comments: {}, // comments by userrequestId
  submitted: false,
  sent: false,
  error: null,
  loading: false, // loading comments list
};

const parseCommentsByUserrequest = items => {
  const comments = {};
  const userrequestId = items[0].userrequest;
  items.forEach(userrequest => {
    comments[userrequest.id] = {
      content: userrequest.properties.comment,
      date: userrequest.created_at,
    };
  });

  return { [userrequestId]: comments };
};

/**
 * REDUCER
 * --------------------------------------------------------- *
 */
const userRequestComments = (state = initialState, action) => {
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
        comments: {
          ...state.comments,
          ...parseCommentsByUserrequest(action.response),
        },
      };
    case POST_DATA:
      return {
        ...state,
        submitted: true,
        sent: false,
        error: null,
      };
    case SUBMIT_DATA_SUCCESS:
      return {
        ...state,
        sent: true,
        error: null,
        comments: {
          ...state.comments,
          [action.response.userrequest]: {
            ...state.comments[action.response.userrequest],
            [action.response.id]: {
              content: action.response.properties.comment,
              date: action.response.created_at,
            },
          },
        },
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

export default userRequestComments;

/**
 * SELECTORS
 * --------------------------------------------------------- *
 */

const sortByDate = (a, b) => moment(a.date).isBefore(b.date);

/**
 * getCommentsByUserrequest selector
 * @param {object} state
 * @param {string} userrequestId : id of userrequest
 * @returns {array} array of comments
 */
export const getCommentsByUserrequest = createSelector(
  (state, userrequestId) => state.userRequestComments.comments[userrequestId] || {},
  items => Object.keys(items).map(key => items[key]).sort(sortByDate),
);


/**
 * ACTIONS
 * --------------------------------------------------------- *
 */

/**
 * updateItems action : update items object
 * @param  {object} comments : object contains all userrequests, ordered by ids
 */
export const updateItems = (userrequestId, comments) => dispatch => {
  dispatch({
    type: FETCHED,
    comments,
    userrequestId,
  });
};

/**
 * fetchUserRequestComments async action : fetch userrequest list if not loaded
 * @param {number} userrequestId
 */
export const fetchUserRequestComments = userrequestId => ({
  [CALL_API]: {
    endpoint: `/userrequest/${userrequestId}/comment`,
    authenticated: true,
    types: [FETCH, FETCHED, SUBMIT_DATA_FAILED],
    config: {
      method: 'GET',
    },
  },
});

/**
 * submitComment async action : post userrequest comment
 * @param {number} userRequestId
 * @param {string} new comment text
 */
export const submitComment = (userrequestId, comment) => ({
  [CALL_API]: {
    endpoint: `/userrequest/${userrequestId}/comment/`,
    authenticated: true,
    types: [POST_DATA, SUBMIT_DATA_SUCCESS, SUBMIT_DATA_FAILED],
    config: {
      method: 'POST',
      body: JSON.stringify({
        properties: { comment },
      }),
    },
  },
});
