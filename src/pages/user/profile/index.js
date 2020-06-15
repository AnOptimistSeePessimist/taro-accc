import Taro, {Component} from '@tarojs/taro';
import {View, Text, Image} from '@tarojs/components';

import bg from './assets/bg.png';
import defaultAvatar from './assets/default-avatar.png';
import './index.scss';

export default class Profile extends Component {

  handleLogin = () => {
    Taro.navigateTo({url: '/pages/login/index'});
  };


  render() {
    console.log('Profile: ', this.props);
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
            <Text className='name'>{userInfo.login ? userInfo.nickname: '未登录'}</Text>
            {
              userInfo.login ? 
                <View></View>
                :
                <Text className='tip'>点击登录账号</Text>
            }
          </View>
        </View>
      </View>
    );
  }
}
