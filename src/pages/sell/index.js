import Taro, {Component} from '@tarojs/taro';
import {View, Text, Image, ScrollView} from '@tarojs/components';

import './index.scss';

class Sell extends Component {
  config = {
    navigationBarTitleText: '卖'
  }

  render() {
    return (
      <View className='sell'>
        <Text className='title'>Sell</Text>
      </View>
    );
  }
}

export default Sell;