import Taro, {Component} from '@tarojs/taro';
import {View, Text} from '@tarojs/components';
import { AtButton, AtNavBar } from 'taro-ui';

import './index.scss';

class UserReleaseDetails extends Component {
  constructor() {
    super(...arguments);
  }

  config = {
    navigationBarTitleText: '发布详情',
    navigationStyle: 'custom',
  };

  render() {
    console.log('');
    const navStyle = {
      'background-color': '#fe871f',
      'padding-top':  Taro.getSystemInfoSync().safeArea == undefined ? 0 :  Taro.getSystemInfoSync().safeArea.top + 'px',
    };
    return (
      <View className='user-release-details'>
        <View style={navStyle} />
        <AtNavBar
          className="nav-bar"
          leftIconType="chevron-left"
          // onClickRgIconSt={() => {}}
          // onClickRgIconNd={() => {}}
          onClickLeftIcon={() => {
            Taro.navigateBack();
          }}
          color='white'
          // title='NavBar 导航栏示例'
          // leftText='返回'
          // rightFirstIconType='bullet-list'
          // rightSecondIconType='user'
        >
          <Text className='nav-bar-title'>发布详情</Text>
        </AtNavBar>
        <View className='user-release-details-content'>
        <Text>UserReleaseDetails</Text>
        </View>
      </View>
    );
  }
}

export default UserReleaseDetails;
