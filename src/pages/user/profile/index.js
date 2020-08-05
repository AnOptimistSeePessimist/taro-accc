import Taro, {Component} from '@tarojs/taro';
import {View, Text, Image, Button} from '@tarojs/components';
import { connect } from '@tarojs/redux';

import bg from './assets/bg.png';
import defaultAvatar from './assets/default-avatar.png';
import './index.scss';


@connect(state => state.user, {})
class Profile extends Component {
  constructor(props) {
    super(props);
  }

  getUserInformation = (res) => {
    // Taro.getUserInfo({
    //   success: function(res) {
    //     console.log('userInfo: ', res.userInfo);
    //   }
    // });
    console.log('userInfo: ', res);
    if (this.props.userInfo.login) {
      Taro.navigateTo({url: '/user/pages/user-setting/index'});
    } else {
      Taro.navigateTo({url: '/user/pages/user-login/index'});
    }
  };


  // handleLogin = () => {
  //   Taro.getSetting({
  //     success: (res) => {
  //       console.log('authSetting: ', res);
  //       if (res.authSetting['scope.userInfo'] === true) {
  //         // this.getUserInformation();
  //       } else {
  //         Taro.authorize({
  //           scope: 'scope.userInfo',
  //           success: () => {
  //             console.log('authorize: ', 'authorize');
  //             // 用户已经同意小程序使用录音功能，后续调用 Taro.startRecord 接口不会弹窗询问
  //             // Taro.startRecord()
  //             // this.getUserInformation();
  //           }
  //         })
  //       }
  //     }
  //   });
  // };

  render() {
    const {userInfo} = this.props;
    return (
      <Button
        className='userInfo'
        openType="getUserInfo"
        hoverClass="none"
        onGetUserInfo={(e) => {
          this.getUserInformation(e);
        }}
      >
        <View className='profile'>
          <Image
            className='bg'
            src={bg}
            mode='widthFix'
          />
          <View className='wrapper'>
            <View className='avatar'>
              <Image
                src={userInfo.avatar || defaultAvatar}
                className='img'
                // onClick={this.handleLogin}
              />
            </View>
            <View className='info'>
              <Text className='name'>{userInfo.login ? (userInfo.userInfoDto && userInfo.userInfoDto.userDetailDto && userInfo.userInfoDto.userDetailDto.nickName) || '' : '未登录'}</Text>
              <Text className='tip'>{userInfo.login ? userInfo.auth.mobilePhone : '点击登录账号'}</Text>
            </View>
          </View>
        </View>
      </Button>
    );
  }
}

export default Profile;
