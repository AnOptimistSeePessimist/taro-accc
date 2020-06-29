import Taro, {Component} from '@tarojs/taro';
import {View, Text, Image, ScrollView} from '@tarojs/components';

import Menu from './menu/index';
import './index.scss';

class Sell extends Component {
  componentDidMount() {
    Taro.navigateTo({url: '/pages/sell-manpower/index'});
  }

  config = {
    navigationBarTitleText: '卖家'
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