import userrequestComments, {
  getCommentsByUserrequest,
  SUBMIT_DATA_SUCCESS,
} from './userrequestComments';

describe('userrequestComments selector', () => {
  it('should return an array of selected ids objects', () => {
    const state = {
      userrequestComments: {
        comments: {
          15: {},
          20: { 6: 'a' },
        },
      },
    };

    expect(getCommentsByUserrequest(state, 20)).toEqual(['a']);
  });

  it('should return an array ordered by date', () => {
    const state = {
      userrequestComments: {
        comments: {
          15: {},
          20: {
            6: { content: 'a', date: '2018-02-18T16:48:09.299906+02:00' },
            7: { content: 'b', date: '2016-05-18T16:48:09.299906+02:00' },
            8: { content: 'c', date: '2018-05-18T16:48:09.299906+02:00' },
          },
        },
      },
    };

    expect(getCommentsByUserrequest(state, 20)).toEqual([
      { content: 'c', date: '2018-05-18T16:48:09.299906+02:00' },
      { content: 'a', date: '2018-02-18T16:48:09.299906+02:00' },
      { content: 'b', date: '2016-05-18T16:48:09.299906+02:00' },
    ]);
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
      sent: true,
      error: null,
      comments: {
        15: { 1: { content: 'ok', date: '01/02/18' } },
        20: { 6: { content: 'a', date: '01/02/18' }, 7: { content: 'b', date: '01/02/18' } },
        21: { 5: { content: 'blabla', date: '2018-05-18T16:48:09.299906+02:00' } },
      },
    };
    expect(userrequestComments(state, action)).toEqual(expectedState);
  });
});
