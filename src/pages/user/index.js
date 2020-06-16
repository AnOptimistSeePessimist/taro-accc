import Taro, {Component} from '@tarojs/taro';
import {View} from '@tarojs/components';
import {connect} from '@tarojs/redux';
import { AtButton } from 'taro-ui';
import { add } from '@actions/counter';
import Profile from './profile';
import Menu from './menu';

import './index.scss';

@connect(state => state.user, {})
class User extends Component {
  componentDidMount() {
    this.props.dispatch(add());
  }

  config = {
    navigationBarTitleText: '我的'
  }

  render() {
    const {userInfo} = this.props;
    console.log('userInfo.login: ', userInfo.login);
    return (
      <View className='user'>
        <Profile userInfo={userInfo} />
        <Menu userInfo={userInfo} />
        {userInfo.login && <AtButton className='logout'>退出登录</AtButton>}
      </View>
    );
  }
}

export default User;
