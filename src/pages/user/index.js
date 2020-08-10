import Taro, {Component} from '@tarojs/taro';
import {View} from '@tarojs/components';
import {connect} from '@tarojs/redux';
import { dispatchLogout } from '@actions/user';
import Profile from './profile';
import Menu from './menu';

import './index.scss';

@connect(state => state.user, (dispatch) => ({
  logout() {
    dispatch(dispatchLogout());
  }
}))
class User extends Component {
 componentDidMount() {

 }

  config = {
    navigationBarTitleText: '我的'
  }

  render() {
    console.log('render');
    const {userInfo} = this.props;
    return (
      <View className='user'>
        {/* <OpenData type='userAvatarUrl'/>
        <OpenData type='userNickName'/> */}
        <Profile userInfo={userInfo} />
        <Menu userInfo={userInfo} />
      </View>
    );
  }
}

export default User;
