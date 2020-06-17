import { combineReducers } from 'redux';
import counter from './counter';
import user from './user';
import drawerShow from './home'

export default combineReducers({
  counter,
  user,
  drawerShow,
});
