import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import request from 'modules/request';

export default combineReducers({
  routing: routerReducer,
  request,
  // ...otherReducers
});
