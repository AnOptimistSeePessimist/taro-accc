import { combineReducers } from 'redux';
import counter from './counter';
import user from './user';
import home from './home';
import compWorkType from './compWorkType';

export default combineReducers({
  counter,
  user,
  home,
  compWorkType,
});
