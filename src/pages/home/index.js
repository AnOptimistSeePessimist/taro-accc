import Taro, {Component} from '@tarojs/taro';
import {View, Text, Image, ScrollView, Button} from '@tarojs/components';
import {connect} from '@tarojs/redux'
import {drawerShowHide} from '../../actions/home'
import {AtDrawer} from 'taro-ui'
import './index.scss';

@connect(({ drawerShow }) => ({
  drawerShow
}), (dispatch) => ({
  drawerShowHides(data) {
    dispatch(drawerShowHide(data))
  }
}))
class Home extends Component {
  config = {
    navigationBarTitleText: '货运帮'
  }

  todrawerShowHide = (e) => {
    this.props.drawerShowHides(true)
 }


  render() {
    return (
      <View className='home'>
        <Text className='title'>Home</Text>
        {this.props.drawerShow.showHideDrawer}
        <Button onClick={this.todrawerShowHide}>测试抽屉</Button>
        <AtDrawer
          show={this.props.drawerShow.showHideDrawer}
          mask
          right
          items={['菜单1', '菜单2']}
        ></AtDrawer>
      </View>
    );
  }
}

export default Home;