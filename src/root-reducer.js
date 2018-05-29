import { combineReducers } from 'redux';
import userRequest from 'modules/userRequest';
import userRequestList from 'modules/userRequestList';
import userRequestComments from 'modules/userRequestComments';
import authentication from 'modules/authentication';

export default combineReducers({
  userRequest,
  userRequestList,
  userRequestComments,
  authentication,
});
