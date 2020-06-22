/* eslint-disable import/first */
import Taro, {Component} from '@tarojs/taro';
import {View, Text, Image} from '@tarojs/components';
import {connect} from '@tarojs/redux';
import Menu from './menu/index';

import './index.scss';

@connect(state => state.user, {})
class Buy extends Component {
  config = {
    navigationBarTitleText: '买家'
  }

  render() {
    const {userInfo} = this.props
    console.log(userInfo)
    return (
      <View className='buy'>
        <Menu userInfo= {userInfo} />
      </View>
    );
  }
}

export default Buy;
