export const CHANGE_MODE = 'drawMode/CHANGE_MODE';

const initialState = {
  mode: 'polygon',
};

/**
 * request reducer
 */
const drawMode = (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_MODE:
      return {
        ...state,
        mode: action.value,
      };
    default:
      return state;
  }
};

export default drawMode;

/**
 * Change draw mode (line, polygon, edit,...)
 * @param  {string} value : new mode
 */
export const changeMode = value => dispatch => {
  dispatch({
    type: CHANGE_MODE,
    value,
  });
};
