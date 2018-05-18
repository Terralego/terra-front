import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import userRequest from 'modules/userRequest';
import userRequestList from 'modules/userRequestList';
import userRequestComments from 'modules/userRequestComments';

export default combineReducers({
  routing: routerReducer,
  userRequest,
  userRequestList,
  userRequestComments,
  // ...otherReducers
});
