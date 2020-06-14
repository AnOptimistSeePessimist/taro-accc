import Taro, {Component} from '@tarojs/taro';
import {View, Text, ScrollView} from '@tarojs/components';
import {connect} from '@tarojs/redux';

import {getWindowHeight} from '../../utils/style';

import { add } from '../../actions/counter'

import './index.scss';

@connect(state => state, {})
class User extends Component {

  componentDidMount() {
    console.log(getWindowHeight());
    this.props.dispatch(add());
  }

  config = {
    navigationBarTitleText: '我的'
  }

  render() {
    return (
      <View className='user'>
        <ScrollView className='scroll-view' style={{height: getWindowHeight()}}>
          <Text>User</Text>
        </ScrollView>
      </View>
    );
  }
}

export default User;
