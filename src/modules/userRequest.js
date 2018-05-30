import { CALL_API } from 'middlewares/api';
import initialState from 'modules/userrequest-initial';

export const UPDATE_VALUE = 'userrequest/UPDATE_VALUE';
export const UPDATE_DATA_PROPERTIES = 'userrequest/UPDATE_DATA_PROPERTIES';
export const ADD_GEOSJON_FEATURE = 'userrequest/ADD_GEOSJON_FEATURE';
export const REMOVE_GEOSJON_FEATURE = 'userrequest/REMOVE_GEOSJON_FEATURE';
export const POST_DATA = 'userrequest/POST_DATA';
export const SUBMIT_DATA_SUCCESS = 'userrequest/SUBMIT_DATA_SUCCESS';
export const SUBMIT_DATA_FAILED = 'userrequest/SUBMIT_DATA_FAILED';

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
export const updateRequestValue = (key, value) => ({
  type: UPDATE_VALUE,
  key,
  value,
});

/**
 * userrequest action
 * updateRequestProperties add or update an object of properties
 * @param  {object} properties : object of properties to add / update in userrequest object
 */
export const updateRequestProperties = properties => ({
  type: UPDATE_DATA_PROPERTIES,
  properties,
});

/**
 * userrequest action
 * addRequestFeature add or update an object of properties
 * @param  {object} properties : object of properties to add / update in userrequest object
 */
export const addRequestFeature = feature => ({
  type: ADD_GEOSJON_FEATURE,
  feature,
});

/**
 * userrequest action
 * removeRequestFeature remove or update an object of properties
 * @param  {object} properties : object of properties to remove / update in userrequest object
 */
export const removeRequestFeature = featureId => ({
  type: REMOVE_GEOSJON_FEATURE,
  featureId,
});

/**
 * Submit data object
 * @param  {object} data : data that will be send to the server
 */
export const submitData = data => ({
  [CALL_API]: {
    endpoint: '/userrequest/',
    types: [POST_DATA, SUBMIT_DATA_SUCCESS, SUBMIT_DATA_FAILED],
    config: {
      method: 'POST',
      data: JSON.stringify(data),
    },
  },
});
