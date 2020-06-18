import { combineReducers } from 'redux';
import counter from './counter';
import user from './user';
import home from './home'

export default combineReducers({
  counter,
  user,
  home,
});
