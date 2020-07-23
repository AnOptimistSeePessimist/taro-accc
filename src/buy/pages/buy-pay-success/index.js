import Taro, {Component} from '@tarojs/taro';
import {View, Text} from '@tarojs/components';
import { AtButton, AtNavBar } from 'taro-ui';

import './index.scss';

class BuyPaySuccess extends Component {
  constructor() {
    super(...arguments);
  }

  config = {
    navigationBarTitleText: '支付状态',
    navigationStyle: 'custom',
  };

  render() {
    const {safeArea = {}, statusBarHeight} = Taro.getSystemInfoSync();
    const navStyle = {
      'background-color': '#fe871f',
      'height':  statusBarHeight + 'px',
    };

    return (
      <View className="sell-manpower-success">
        <View style={navStyle} />
        <AtNavBar
          className="nav-bar"
          leftIconType="chevron-left"
          // onClickRgIconSt={() => {}}
          // onClickRgIconNd={() => {}}
          // onClickLeftIcon={() => {}}
          color='#fe871f'
          // title='NavBar 导航栏示例'
          // leftText='返回'
          // rightFirstIconType='bullet-list'
          // rightSecondIconType='user'
        >
          <Text className='nav-bar-title'>支付状态</Text>
        </AtNavBar>
        <View className="sell-manpower-success-content">
          <Text className="iconfont iconchenggong success" />
          <Text className="title">支付成功</Text>
          <View className="buttons">
            <View className="back-container">
              <AtButton 
                type='primary' 
                size='normal' 
                className='back'
                onClick={() => {
                  Taro.navigateBack({
                    delta: 2,
                  });
                }}
              >
                返回
              </AtButton>
            </View>
            <View className='release-container'>
              <AtButton 
                type='primary' 
                size='normal' 
                className='release'
                onClick={() => {
                  Taro.switchTab({
                    url: '/pages/user/index'
                  });
                }}
              >
                查看我的订单
              </AtButton>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

export default BuyPaySuccess;
