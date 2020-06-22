import Taro, {Component} from '@tarojs/taro';
import {View, Text, Image} from '@tarojs/components';
import { connect } from '@tarojs/redux';

import bg from './assets/bg.png';
import defaultAvatar from './assets/default-avatar.png';
import './index.scss';


@connect(state => state.user, {})
class Profile extends Component {

  handleLogin = () => {
    if (this.props.userInfo.login) {
      return;
    }
    Taro.navigateTo({url: '/pages/login/index'});
  };

  render() {
    const {userInfo} = this.props;
    return (
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
              onClick={this.handleLogin}
            />
          </View>
          <View className='info' onClick={this.handleLogin}>
            <Text className='name'>{userInfo.login ? userInfo.userDetails.username: '未登录'}</Text>
            <Text className='tip'>{userInfo.login ? userInfo.userDetails.mobilePhone : '点击登录账号'}</Text>
          </View>
        </View>
      </View>
    );
  }
}

export default Profile;
