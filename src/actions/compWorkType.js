import Taro from '@tarojs/taro';
import actionTypes from '@constants/actionTypes';
import {API_COMP_WORK_TYPE} from '@constants/api';
import fetch from '@utils/request';

export const dispatchCompWorkType = (payload) => ({type: actionTypes.COMP_WORK_TYPE, payload});

export const compWorkType = (payload) => {
  Taro.showLoading({
    title: '正在获取工种数据',
    mask: true,
  });

  return function (dispatch, getState, extraArgument) {
    fetch({
      url: API_COMP_WORK_TYPE + `/${payload.companyCode}`,
      accessToken: payload.accessToken
    })
      .then((res) => {
        const {data: {data}} = res;
        setTimeout(Taro.hideLoading, 1000);
        console.log('compWorkType: ', res);
        const workTypeList = data.map((item) => {
          item.checked = false;
          return item;
        });
        dispatch(dispatchCompWorkType(workTypeList));
      })
      .catch(() => {})
  }
}
