import { getCommentsByUserrequest } from './userRequestComments';

describe('userRequestComments selector', () => {
  it('should return an array of selected ids objects', () => {
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
