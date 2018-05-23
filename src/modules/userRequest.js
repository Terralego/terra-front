import userRequestService from 'services/userRequestService';
import initialState from 'modules/userRequest-initial';

export const UPDATE_VALUE = 'userRequest/UPDATE_VALUE';
export const UPDATE_DATA_PROPERTIES = 'userRequest/UPDATE_DATA_PROPERTIES';
export const ADD_GEOSJON_FEATURE = 'userRequest/ADD_GEOSJON_FEATURE';
export const REMOVE_GEOSJON_FEATURE = 'userRequest/REMOVE_GEOSJON_FEATURE';
export const POST_DATA = 'userRequest/POST_DATA';
export const SUBMIT_DATA_SUCCESS = 'userRequest/SUBMIT_DATA_SUCCESS';
export const SUBMIT_DATA_FAILED = 'userRequest/SUBMIT_DATA_FAILED';

/**
 * REDUCER
 * --------------------------------------------------------- *
 */
const userRequest = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_VALUE:
      return {
        ...state,
        [action.key]: action.value,
      };
    case UPDATE_DATA_PROPERTIES:
      return {
        ...state,
        data: {
          ...state.data,
          properties: {
            ...state.data.properties,
            ...action.properties,
          },
        },
      };
    case ADD_GEOSJON_FEATURE:
      return {
        ...state,
        data: {
          ...state.data,
          geojson: {
            ...state.data.geojson,
            features: [
              ...state.data.geojson.features,
              action.feature,
            ],
          },
        },
      };
    case REMOVE_GEOSJON_FEATURE:
      return {
        ...state,
        data: {
          ...state.data,
          geojson: {
            ...state.data.geojson,
            features: state.data.geojson.features
              .filter(feature => feature.properties.id !== action.featureId),
          },
        },
      };
    case POST_DATA:
      return {
        ...state,
        submitted: true,
      };
    case SUBMIT_DATA_SUCCESS:
      return {
        ...state,
        sent: true,
        error: null,
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

export default userRequest;


/**
 * ACTIONS
 * --------------------------------------------------------- *
 */

/**
 * userRequest action
 * updateRequestValue create or update a value of userRequest key
 * @param  {string} key : the key of the new userRequest value
 * @param  {any} value : the new value
 */
export const updateRequestValue = (key, value) => ({
  type: UPDATE_VALUE,
  key,
  value,
});

/**
 * userRequest action
 * updateRequestProperties add or update an object of properties
 * @param  {object} properties : object of properties to add / update in userRequest object
 */
export const updateRequestProperties = properties => ({
  type: UPDATE_DATA_PROPERTIES,
  properties,
});

/**
 * userRequest action
 * addRequestFeature add or update an object of properties
 * @param  {object} properties : object of properties to add / update in userRequest object
 */
export const addRequestFeature = feature => ({
  type: ADD_GEOSJON_FEATURE,
  feature,
});

/**
 * userRequest action
 * removeRequestFeature remove or update an object of properties
 * @param  {object} properties : object of properties to remove / update in userRequest object
 */
export const removeRequestFeature = featureId => ({
  type: REMOVE_GEOSJON_FEATURE,
  featureId,
});

/**
 * userRequest action : submit data object
 * @param  {object} data : data that will be send to the server
 */
export const submitData = data => dispatch => {
  dispatch({
    type: POST_DATA,
  });

  return userRequestService.post(data)
    .then(response =>
      dispatch({ type: SUBMIT_DATA_SUCCESS, response }))
    .catch(error =>
      dispatch({ type: SUBMIT_DATA_FAILED, error: error.toString() }));
};
