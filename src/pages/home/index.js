import Taro, {Component} from '@tarojs/taro';
import {View, Text, Image, ScrollView} from '@tarojs/components';

import './index.scss';

class Home extends Component {
  config = {
    navigationBarTitleText: '货运帮'
  }

  render() {
    return (
      <View className='home'>
        <Text className='title'>Home</Text>
      </View>
    );
  }
}

export default Home;