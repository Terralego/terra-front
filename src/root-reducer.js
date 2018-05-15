import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import userRequest from 'modules/userRequest';
import userRequestList from 'modules/userRequestList';

export default combineReducers({
  routing: routerReducer,
  userRequest,
  userRequestList,
  // ...otherReducers
});
