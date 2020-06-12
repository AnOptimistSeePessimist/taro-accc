import Taro, {Component} from '@tarojs/taro';
import {View, Text, Image, ScrollView} from '@tarojs/components';

import './index.scss';

class User extends Component {
  config = {
    navigationBarTitleText: '我的'
  }

  render() {
    return (
      <View className='user-page'>
        <Text className='title'>User</Text>
      </View>
    );
  }
}

export default User;
