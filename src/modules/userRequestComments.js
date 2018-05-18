import { createSelector } from 'reselect';
import moment from 'moment';
import userRequestService from 'services/userRequestService';

export const FETCH = 'userRequestComments/FETCH';
export const FETCHED = 'userRequestComments/FETCHED';
export const POST_DATA = 'userRequestComments/POST_DATA';
export const SUBMIT_DATA_SUCCESS = 'userRequestComments/SUBMIT_DATA_SUCCESS';
export const SUBMIT_DATA_FAILED = 'userRequestComments/SUBMIT_DATA_FAILED';

const initialState = {
  comments: {}, // comments by userrequestId
  loading: false,
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
          [action.userrequestId]: action.comments,
        },
      };
    case SUBMIT_DATA_SUCCESS:
      return {
        ...state,
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
export const fetchUserRequestComments = userrequestId => (dispatch, getState) => {
  const state = getState();
  const loadedComments = getCommentsByUserrequest(state, userrequestId);

  if (!loadedComments.length > 0) {
    dispatch({ type: FETCH });

    return userRequestService.getComments(userrequestId).then(response => {
      const comments = {};
      response.forEach(userrequest => {
        comments[userrequest.id] = {
          content: userrequest.properties.comment,
          date: userrequest.created_at,
        };
      });

      return dispatch(updateItems(userrequestId, comments));
    });
  }

  return dispatch(updateItems(userrequestId, loadedComments));
};

/**
 * submitComment async action : post userrequest comment
 * @param {number} userRequestId
 * @param {string} new comment text
 */
export const submitComment = (userRequestId, comment) => dispatch => {
  dispatch({
    type: POST_DATA,
    payload: {
      properties: { comment },
    },
  });

  return userRequestService.postComment(userRequestId, {
    properties: { comment },
  })
    .then(response =>
      dispatch({ type: SUBMIT_DATA_SUCCESS, response }))
    .catch(error =>
      dispatch({ type: SUBMIT_DATA_FAILED, error: error.toString() }));
};

