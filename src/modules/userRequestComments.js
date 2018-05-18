import { createSelector } from 'reselect';
import userRequestService from 'services/userRequestService';

export const FETCH = 'userRequestComments/FETCH';
export const FETCHED = 'userRequestComments/FETCHED';

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
    default:
      return state;
  }
};

export default userRequestComments;

/**
 * SELECTORS
 * --------------------------------------------------------- *
 */

/**
 * getCommentsByUserrequest selector
 * @param {object} state
 * @param {string} userrequestId : id of userrequest
 * @returns {array} array of comments
 */
export const getCommentsByUserrequest = createSelector(
  (state, userrequestId) => state.userRequestComments.comments[userrequestId] || {},
  items => Object.keys(items).map(key => items[key]),
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
 */
export const fetchUserRequestComments = userrequestId => (dispatch, getState) => {
  const state = getState();
  const comments = getCommentsByUserrequest(state, userrequestId);

  if (!comments.length > 0) {
    dispatch({ type: FETCH });

    return userRequestService.getComments(userrequestId).then(response => {
      const newComments = {};
      response.forEach(userrequest => {
        newComments[userrequest.id] = {
          content: userrequest.properties.comment,
          date: userrequest.created_at,
        };
      });

      return dispatch(updateItems(userrequestId, newComments));
    });
  }

  return dispatch(updateItems(userrequestId, comments));
};
