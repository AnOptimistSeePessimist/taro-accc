/* eslint-disable import/first */
import Taro, {Component} from '@tarojs/taro';
import {View, Text, Image} from '@tarojs/components';

import Menu from './menu/index';

import './index.scss';


class Buy extends Component {
  config = {
    navigationBarTitleText: '买家'
  }

  render() {
    return (
      <View className='buy'>
        <Menu />
      </View>
    );
  }
}

export default Buy;
