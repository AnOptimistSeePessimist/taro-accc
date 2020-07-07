import Taro, {Component} from '@tarojs/taro';
import {View, Text} from '@tarojs/components';
import {connect} from '@tarojs/redux';
import Menu from './menu/index';
import { dispatchLogout } from '@actions/user';
import { AtButton } from 'taro-ui';

import './index.scss';

@connect(state => ({
  compWorkType: state.compWorkType,
}), (dispatch) => ({
  logout() {
    dispatch(dispatchLogout());
  }
}))
class Setting extends Component {
  constructor(props) {
    super(props);
  }

  config = {
    navigationBarTitleText: '设置'
  }

  logout = () => {
    this.props.logout();
    Taro.navigateBack();
  };

  render() {
    console.log('Setting: ', this.props.compWorkType);
    return (
      <View className='setting'>
        <Menu />
        <AtButton className='logout' onClick={this.logout}>退出登录</AtButton>
      </View>
    );
  }
}

export default Setting;
