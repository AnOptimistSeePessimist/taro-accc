import Taro from '@tarojs/taro';

const CODE_SUCCESS = '200'


/**
 *
 * 简易封装网络请求
 *
 */
export default async function fetch(options) {
  const {url, payload, method = 'GET', showToast = true, autoLogin = true} = options;
  const header = {access_token: '这是token'};
  if (method === 'POST') {
    header['content-type'] = 'application/json';
  }

  try {
    const res = await Taro.request({url, method, data: payload, header});
    const {code, data} = res.data;
    if (code !== CODE_SUCCESS) {
      return Promise.reject(res.data);
    }
    return data;
  } catch (err) {
    if (showToast) {
      Taro.showToast({
        title: err && err.errorMsg,
        icon: 'none',
      });
    }



  }
}
