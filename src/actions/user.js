import Taro from '@tarojs/taro';
import actionTypes from '@constants/actionTypes';
import {API_USER_LOGIN, API_USER_LOGOUT} from '@constants/api';
import fetch from '@utils/request';

/**
 *
 * 用户登录
 *
 */
export const dispatchLogin = (payload) => ({type: actionTypes.USER_LOGIN, payload: payload});

/**
 *
 *
 * 用户退出登录
 *
 */
export const dispatchLogout = () => ({type: actionTypes.USER_LOGOUT});

/**
 *
 * 用户登录
 *
 * action creator
 *
 */
export const login = payload => {
  return dispatch => {
    Taro.showLoading({
      title: '正在登录中',
      mask: true,
    });
    fetch({url: API_USER_LOGIN + `?mobilePhone=${payload.mobilePhone}&securityCode=${payload.securityCode}`, method: 'POST', payload}).then((res) => {
      Taro.hideLoading();
      console.log('login: ', res);
      const {data: {code, data, message, status}} = res;
      // 500	BadCredentialsException	用户名或密码错误
      // 500	AccountLockedException	用户已经被锁定
      // 400	MobilePhoneIsNull	手机号不能为空
      // 500	SecurityCodeError	验证码错误
      // 500	MobilePhoneNotFoundException	手机号未注册
      if (status === 200) {
        dispatch(dispatchLogin(res.data.data));
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
          Taro.navigateTo({url: `/user/pages/user-register/index?mobilePhone=${payload.mobilePhone}`});
        }
      }
    }).catch((error) => {

    });
  }
};

/**
 *
 * 用户退出登录
 *
 * action creator
 *
 */
export const logout = () => {
  return (dispatch, getState, extraArgument) => {
    Taro.showLoading({
      title: '退出登录中',
      mask: true,
    });
    const {user: {userInfo: {userToken: {accessToken}}}} = getState();
    fetch({url: API_USER_LOGOUT, accessToken})
      .then((res)=> {
        const {data: {status}} = res;
        if (status === 200) {
          dispatch(dispatchLogout());
          Taro.navigateBack();
          Taro.hideLoading();
        } else {
          dispatch(dispatchLogout());
          Taro.navigateBack();
        }
      })
      .catch(() => {
          Taro.hideLoading();
          Taro.showToast({
            title: '退出登录失败',
            icon: 'none',
            duration: 2000,
          });
      });
  };
};
