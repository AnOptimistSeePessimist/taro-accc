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
    const {safeArea = {}, statusBarHeight} = Taro.getSystemInfoSync();

    return (
      <View className="sell-manpower-success">
        <AtNavBar
          className="nav-bar"
          leftIconType="chevron-left"
          customStyle={{
            'padding-top': statusBarHeight + 'px' 
          }}
          fixed
          color='#fe871f'
        >
          <Text className='nav-bar-title'>发布状态</Text>
        </AtNavBar>
        <View 
          className="sell-manpower-success-content" 
        >
          <Text 
            className="iconfont iconchenggong success" 
            style={{'padding-top': statusBarHeight + 50 + 'px' }}
          />
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
                  this.$preload({
                    flag: 2,
                    data: this.$router.preload.data
                  });
                  Taro.navigateTo({
                    url: '/user/pages/user-release-details/index'
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
