import Taro, {Component} from '@tarojs/taro';
import {View, Text} from '@tarojs/components';

import './index.scss';

export default class Login extends Component {
  render() {
    return (
      <View className='login'>
        <Text className='tip'>Login</Text>
      </View>
    );
  }
}