import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import userRequest from 'modules/userRequest';

export default combineReducers({
  routing: routerReducer,
  userRequest,
  // ...otherReducers
});
