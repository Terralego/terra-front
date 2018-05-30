import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import apiService from 'services/apiService';
import api from 'middlewares/api';
import userrequest, {
  UPDATE_VALUE,
  UPDATE_DATA_PROPERTIES,
  POST_DATA,
  SUBMIT_DATA_SUCCESS,
  SUBMIT_DATA_FAILED,
  submitData,
  addRequestFeature,
  ADD_GEOSJON_FEATURE,
  removeRequestFeature,
  REMOVE_GEOSJON_FEATURE,
} from './userrequest';
import initialState from './userrequest-initial';

const middlewares = [thunk, api];
const mockStore = configureMockStore(middlewares);

const MockAdapter = require('axios-mock-adapter');

// This sets the mock adapter on the default instance
const { instance } = apiService; // Axios.create()
const mock = new MockAdapter(instance);

describe('userrequest reducer', () => {
  it('should have initial value equal to {}', () => {
    expect(userrequest({}, {})).toEqual({});
  });

  describe('UPDATE_VALUE', () => {
    it('should add a key / value in userrequest object', () => {
      const updateRequestAction = {
        type: UPDATE_VALUE,
        key: 'error',
        value: false,
      };
      expect(userrequest({}, updateRequestAction)).toEqual({ error: false });
    });
  });

  describe('UPDATE_DATA_PROPERTIES', () => {
    it('should add a properties object in userrequest', () => {
      const updateRequestAction = {
        type: UPDATE_DATA_PROPERTIES,
        properties: {
          name: 'Alex',
          company: 'Makina',
        },
      };
      expect(userrequest({ data: {} }, updateRequestAction)).toEqual({
        data: { properties: { name: 'Alex', company: 'Makina' } },
      });
    });
  });
});

describe('userrequest async action', () => {
  it('should POST_DATA, then if success SUBMIT_DATA_SUCCESS', () => {
    const store = mockStore(initialState);

    mock.onPost().reply(200, { id: 'Hello' });

    return store.dispatch(submitData('Hello'))
      .then(() => {
        const actions = store.getActions();
        expect(actions.length).toBe(2);
        expect(actions).toContainEqual({ type: POST_DATA });
        expect(actions).toContainEqual({
          type: SUBMIT_DATA_SUCCESS,
          data: { id: 'Hello' },
        });
      });
  });

  it('should POST_DATA, then if failed SUBMIT_DATA_FAILED', () => {
    const store = mockStore(initialState);

    mock.reset();
    mock.onPost().reply(400);

    return store.dispatch(submitData('Bonjour'))
      .then(() => {
        const actions = store.getActions();
        expect(actions.length).toBe(2);
        expect(actions).toContainEqual({ type: POST_DATA });
        expect(actions).toContainEqual({
          type: SUBMIT_DATA_FAILED,
          error: 'Request failed with status code 400',
        });
      });
  });
});

describe('addRequestFeature action', () => {
  const store = mockStore(initialState);

  const feature = {
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [296901.1534161276, 6177142.792006604],
          [293682.1807408809, 6172947.158817668],
          [298797.40476574795, 6172191.693898978],
          [296901.1534161276, 6177142.792006604],
        ],
      ],
    },
    properties: {
      id: '3bc46e07-cc4f-1d1c-a16d-c32df381faba',
      name: 'Polygon',
    },
  };

  it('should dispatch a ADD_GEOSJON_FEATURE action type', () => {
    store.dispatch(addRequestFeature(feature));
    const actions = store.getActions();
    expect(actions[0].type).toEqual(ADD_GEOSJON_FEATURE);
  });

  it('should add a feature in geojson', () => {
    store.dispatch(addRequestFeature(feature));
    const actions = store.getActions();

    expect(userrequest(initialState, actions[0]).data.geojson).toEqual({
      type: 'FeatureCollection',
      features: [feature],
    });
  });
});

describe('removeRequestFeature action', () => {
  const store = mockStore({
    data: {
      geojson: {
        type: 'FeatureCollection',
        features: [{
          properties: { id: 'a', name: 'Polygon' },
        }, {
          properties: { id: 'b', name: 'Polygon' },
        }, {
          properties: { id: 'c', name: 'Polygon' },
        }],
      },
    },
  });

  it('should dispatch a REMOVE_GEOSJON_FEATURE action type', () => {
    store.dispatch(removeRequestFeature('b'));
    const actions = store.getActions();
    expect(actions[0].type).toEqual(REMOVE_GEOSJON_FEATURE);
  });

  it('should add a feature in geojson', () => {
    store.dispatch(removeRequestFeature('b'));
    const actions = store.getActions();

    expect(userrequest(store.getState(), actions[0]).data.geojson).toEqual({
      type: 'FeatureCollection',
      features: [{
        properties: { id: 'a', name: 'Polygon' },
      }, {
        properties: { id: 'c', name: 'Polygon' },
      }],
    });
  });
});
