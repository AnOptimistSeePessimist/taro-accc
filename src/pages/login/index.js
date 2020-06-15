import Taro, {Component} from '@tarojs/taro';
import {View, Text} from '@tarojs/components';

import './index.scss';

export default class Login extends Component {
  config = {
    navigationBarTitleText: '登录',
  };

  render() {
    return (
      <View className='login'>
        <Text className='tip'>Login</Text>
      </View>
    );
  }
}
