import userRequestComments, {
  getCommentsByUserrequest,
  SUBMIT_DATA_SUCCESS,
} from './userRequestComments';

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

describe('SUBMIT_DATA_SUCCESS action', () => {
  it('should add new comment when recieve response', () => {
    const state = {
      comments: {
        15: { 1: { content: 'ok', date: '01/02/18' } },
        20: { 6: { content: 'a', date: '01/02/18' }, 7: { content: 'b', date: '01/02/18' } },
      },
    };

    const action = {
      type: SUBMIT_DATA_SUCCESS,
      response: {
        id: 5,
        created_at: '2018-05-18T16:48:09.299906+02:00',
        updated_at: '2018-05-18T16:48:09.299949+02:00',
        properties: {
          comment: 'blabla',
        },
        owner: 1,
        userrequest: 21,
        feature: null,
      },
    };

    const expectedState = {
      comments: {
        15: { 1: { content: 'ok', date: '01/02/18' } },
        20: { 6: { content: 'a', date: '01/02/18' }, 7: { content: 'b', date: '01/02/18' } },
        21: { 5: { content: 'blabla', date: '2018-05-18T16:48:09.299906+02:00' } },
      },
    };
    expect(userRequestComments(state, action)).toEqual(expectedState);
  });
});
