import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import FetchMock from 'fetch-mock';
import userRequest, {
  UPDATE_VALUE,
  UPDATE_DATA_PROPERTIES,
  POST_DATA,
  SUBMIT_DATA_SUCCESS,
  SUBMIT_DATA_FAILED,
  submitData,
} from './userRequest';
import initialState from './userRequest-initial';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('userRequest reducer', () => {
  it('should have initial value equal to {}', () => {
    expect(userRequest({}, {})).toEqual({});
  });

  describe('UPDATE_VALUE', () => {
    it('should add a key / value in userRequest object', () => {
      const updateRequestAction = {
        type: UPDATE_VALUE,
        key: 'error',
        value: false,
      };
      expect(userRequest({}, updateRequestAction)).toEqual({ error: false });
    });
  });

  describe('UPDATE_DATA_PROPERTIES', () => {
    it('should add a properties object in userRequest', () => {
      const updateRequestAction = {
        type: UPDATE_DATA_PROPERTIES,
        properties: {
          name: 'Alex',
          company: 'Makina',
        },
      };
      expect(userRequest({ data: {} }, updateRequestAction)).toEqual({
        data: { properties: { name: 'Alex', company: 'Makina' } },
      });
    });
  });
});

describe('userRequest async action', () => {
  it('should POST_DATA, then if success SUBMIT_DATA_SUCCESS', () => {
    const store = mockStore(initialState);

    // Success response
    FetchMock.post('*', { id: 0 });

    return store.dispatch(submitData(1))
      .then(() => {
        const expectedActions = store.getActions();
        expect(expectedActions.length).toBe(2);
        expect(expectedActions).toContainEqual({ type: POST_DATA });
        expect(expectedActions).toContainEqual({
          type: SUBMIT_DATA_SUCCESS,
          response: { id: 0 },
        });
      });
  });

  it('should POST_DATA, then if failed SUBMIT_DATA_FAILED', () => {
    const store = mockStore(initialState);

    // Success response
    FetchMock.post('*', 400, { overwriteRoutes: true });

    return store.dispatch(submitData(1))
      .then(() => {
        const expectedActions = store.getActions();
        expect(expectedActions.length).toBe(2);
        expect(expectedActions).toContainEqual({ type: POST_DATA });
        expect(expectedActions).toContainEqual({
          type: SUBMIT_DATA_FAILED,
          error: 'Error: Bad Request',
        });
      });
  });
});
