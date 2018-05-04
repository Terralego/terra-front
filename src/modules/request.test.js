import request, { UPDATE_REQUEST_VALUE, UPDATE_REQUEST_PROPERTIES } from './request';

describe('request reducer', () => {
  it('should have initial value equal to {}', () => {
    expect(request({}, {})).toEqual({});
  });

  describe('UPDATE_REQUEST_VALUE', () => {
    it('should add a key / value in request object', () => {
      const updateRequestAction = {
        type: UPDATE_REQUEST_VALUE,
        key: 'error',
        value: false,
      };
      expect(request({}, updateRequestAction)).toEqual({ error: false });
    });
  });

  describe('UPDATE_REQUEST_PROPERTIES', () => {
    it('should add a properties object in request', () => {
      const updateRequestAction = {
        type: UPDATE_REQUEST_PROPERTIES,
        properties: {
          name: 'Alex',
          company: 'Makina',
        },
      };
      expect(request({}, updateRequestAction)).toEqual({
        properties: { name: 'Alex', company: 'Makina' },
      });
    });
  });
});

