import { getCommentsByUserrequest } from './userRequestComments';

describe('userRequest reducer', () => {
  it('should have initial value equal to {}', () => {
    const state = {
      userRequestComments: {
        comments: {
          15: {},
          20: { 6: 'a', 7: 'b', 8: 'c' },
        },
      },
    };

    expect(getCommentsByUserrequest(state, 20)).toEqual(['a', 'b', 'c']);
  });
});
