import Taro, {Component} from '@tarojs/taro';
import {View, Text, Image, ScrollView} from '@tarojs/components';

import Menu from './menu/index';
import './index.scss';


class Sell extends Component {
  componentDidMount() {
    const res = Taro.getSystemInfoSync();
    console.log('getSystemInfoSync: ', res);
  }

  config = {
    navigationBarTitleText: '卖家',
  }

  render() {
    return (
      <View className='sell'>
        <Menu />
      </View>
    );
  }
}

export default Sell;