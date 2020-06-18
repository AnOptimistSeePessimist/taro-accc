import {USER_INFO, USER_LOGIN, USER_LOGOUT} from '@constants/user';
import {API_USER_LOGIN} from '@constants/api';
import fetch from '@utils/request';

/**
 * 
 * 用户登录
 * 
 */
export const dispatchLogin = payload => {
  return dispatch => {
    fetch({url: API_USER_LOGIN, method: 'POST', payload}).then((res) => {
      console.log('payload: ', payload);
      console.log('res: ', res.data);
      dispatch({type: USER_LOGIN, payload: res.data});
    }).catch((error) => {

    });
  }
};

/**
 * 
 * 
 * 用户退出登录
 * 
 */
export const dispatchLogout = () => ({type: USER_LOGOUT});
