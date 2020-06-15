import Taro, {Component} from '@tarojs/taro';
import {View, ScrollView} from '@tarojs/components';
import {connect} from '@tarojs/redux';
import { AtButton } from 'taro-ui';

import {getWindowHeight} from '@utils/style';
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
    return (
      <View className='user' style={{height: getWindowHeight()}}>
        <Profile userInfo={userInfo} />
        <Menu userInfo={userInfo} />
        <AtButton className='logout'>退出登录</AtButton>
      </View>
    );
  }
}

export default User;
