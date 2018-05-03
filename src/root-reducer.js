import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import base from 'modules/base';

export default combineReducers({
  routing: routerReducer,
  base,
  // ...otherReducers
});
