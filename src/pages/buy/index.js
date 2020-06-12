import Taro, {Component} from '@tarojs/taro';
import {View, Text, Image, ScrollView} from '@tarojs/components';

import './index.scss';

class Buy extends Component {
  config = {
    navigationBarTitleText: '买'
  }

  render() {
    return (
      <View className='buy-page'>
        <Text className='title'>Buy</Text>
      </View>
    );
  }
}

export default Buy;