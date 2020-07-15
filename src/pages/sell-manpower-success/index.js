import Taro, {Component} from '@tarojs/taro';
import {View, Text} from '@tarojs/components';
import { AtButton, AtNavBar } from 'taro-ui';

import './index.scss';

class SellManpowerSuccess extends Component {
  constructor() {
    super(...arguments);
  }

  config = {
    navigationBarTitleText: '发布状态',
    navigationStyle: 'custom',
  };

  render() {
    const navStyle = {
      'background-color': '#fe871f',
      'padding-top': Taro.pxTransform(Taro.getSystemInfoSync().safeArea.top)
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
          <Text className='nav-bar-title'>发布状态</Text>
        </AtNavBar>
        <View className="sell-manpower-success-content">
          <Text className="iconfont iconchenggong success" />
          <Text className="title">人力发布成功</Text>
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
                  Taro.navigateTo({
                    url: '/pages/user-release-details/index?id=1'
                  });
                }}
              >
                查看我的发布
              </AtButton>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

export default SellManpowerSuccess;
