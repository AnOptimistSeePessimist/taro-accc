import Taro, {Component} from '@tarojs/taro';
import {View, Text} from '@tarojs/components';
import { AtButton, AtNavBar } from 'taro-ui';

import './index.scss';

class UserReleaseDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      publishDetail: {},
      previousViewFlag: undefined,
    };
  }

  config = {
    navigationBarTitleText: '发布详情',
    navigationStyle: 'custom',
  };

  componentWillMount() {
  }

  componentDidMount() {
    console.log('UserReleaseDetails -preload: ', this.$router.preload);
    const flag = this.$router.preload.flag;
    this.setState({
      publishDetail: flag === 1 ? this.$router.preload.data.rspublishDto: this.$router.preload.data,
      previousViewFlag: this.$router.preload.flag,
    });
  }

  render() {
    const {safeArea = {}, statusBarHeight} = Taro.getSystemInfoSync();
    console.log('Taro.getSystemInfoSync(): ', Taro.getSystemInfoSync().statusBarHeight);
    const navStyle = {
      'width': '100%',
      'background-color': '#fe871f',
      // Taro.pxTransform(
      'height':  statusBarHeight + 'px',
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
            if (this.state.previousViewFlag === 1) {
              Taro.navigateBack();
            } else {
              Taro.switchTab({
                url: '/pages/user/index',
              });
            }
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
          <View>
            {JSON.stringify(this.state.publishDetail)}
          </View>
        </View>
      </View>
    );
  }
}

export default UserReleaseDetails;
