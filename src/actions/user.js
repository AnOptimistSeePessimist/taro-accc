import Taro from '@tarojs/taro';
import {USER_INFO, USER_LOGIN, USER_LOGOUT} from '@constants/user';
import {API_USER_LOGIN} from '@constants/api';
import fetch from '@utils/request';

/**
 * 
 * 用户登录
 * 
 */
export const dispatchLogin = payload => {
  Taro.showLoading({
    title: '正在登陆中',
    mask: true,
  });
  console.log('payload: ', payload);
  return dispatch => {
    return fetch({url: API_USER_LOGIN + `?mobilePhone=${payload.mobilePhone}&securityCode=${payload.securityCode}`, method: 'POST', payload}).then((res) => {
      Taro.hideLoading();
      console.log('login: ', res);
      const {data: {code, data, message, status}} = res;
      // 500	BadCredentialsException	用户名或密码错误
      // 500	AccountLockedException	用户已经被锁定
      // 400	MobilePhoneIsNull	手机号不能为空
      // 500	SecurityCodeError	验证码错误
      // 500	MobilePhoneNotFoundException	手机号未注册
      if (status === 200) {
        dispatch({type: USER_LOGIN, payload: res.data.data});
        Taro.navigateBack();
      } else {
        if (code === 'SecurityCodeError') {
          Taro.showToast({
            title: '验证码输入错误',
            icon: 'none',
          });
        } else if (code === 'MobilePhoneNotFoundException') {
          Taro.showToast({
            title: '手机号未注册',
            icon: 'none',
          });
          Taro.navigateTo({url: '/pages/register/index?id=1'});
        }
      }
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
