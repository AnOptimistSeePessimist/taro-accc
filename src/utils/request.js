import Taro from '@tarojs/taro';

const CODE_SUCCESS = '200'


/**
 *
 * 简易封装网络请求
 *
 */
export default function fetch(options) {
  const {url, payload, method = 'GET'} = options;
  const header = {};
  if (method === 'POST') {
    header['content-type'] = 'application/json';
  }
  console.log('payload: ', payload);

  return Taro.request({url, method, data: payload, header})
    .then(res => {
      console.log('res: ', res);
      return Promise.resolve(res);
    })
    .catch(err => {
      return Promise.reject(err);
    })
}
