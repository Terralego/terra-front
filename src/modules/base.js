export const ADD_REQUEST = 'base/ADD_REQUEST';

const initialState = {
  request: { name: '', activity: '' },
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_REQUEST:
      return {
        ...state,
        request: action.value,
      };
    default:
      return state;
  }
};

export const addRequest = (name, activity) => dispatch => {
  dispatch({
    type: ADD_REQUEST,
    value: { name, activity },
  });
};
