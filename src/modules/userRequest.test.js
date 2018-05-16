import userRequest, { UPDATE_VALUE, UPDATE_PROPERTIES } from './userRequest';

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

  describe('UPDATE_PROPERTIES', () => {
    it('should add a properties object in userRequest', () => {
      const updateRequestAction = {
        type: UPDATE_PROPERTIES,
        properties: {
          name: 'Alex',
          company: 'Makina',
        },
      };
      expect(userRequest({}, updateRequestAction)).toEqual({
        properties: { name: 'Alex', company: 'Makina' },
      });
    });
  });
});
