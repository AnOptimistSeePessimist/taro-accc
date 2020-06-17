/* eslint-disable import/no-commonjs */
/* eslint-disable no-unused-vars */
import Taro, {Component} from '@tarojs/taro';
import {View, Text, Image} from '@tarojs/components';

import './index.scss';

const MENU_LIST = [
  {key: 'favorite', text: '我的收藏', img: require('./assets/order.png'), path: '/pages/favorite/index'},
  {key: 'distribution', text: '我的发布', img: require('./assets/pin.png'), path: '/pages/distribution/index'},
  {key: 'information', text: '我的信息', img: require('./assets/bargain.png'), path: '/pages/information/index'},
  {key: 'updatePassword', text: '修改密码', img: require('./assets/credit.png'), path: '/pages/updatePassword/index'},
  {key: 'resources', text: '我的资源', img: require('./assets/service.png'), path: '/pages/resources/index'},
  {key: 'transaction', text: '我的交易', img: require('./assets/location.png'), path: '/pages/transaction/index'}
];

export default class Menu extends Component {
  handleClick = (path) => {
    const {userInfo} = this.props;

    if (!userInfo.login) {
      Taro.navigateTo({url: '/pages/login/index'});
    }

    Taro.showToast({title: path});
  };


  render() {
    return (
      <View className='menu'>
        {
          MENU_LIST.map((menu, index) => {
            return (
              <View data-title={menu.text} key={menu.key} className='item' onClick={() => this.handleClick(menu.path)}>
                <View className='left'>
                  <Image
                    className='img'
                    src={menu.img}
                  />
                  <Text>{menu.text}</Text>
                </View>
                <View className='right'>
                  <View className='iconfont iconright arrow' />
                </View>
              </View>
            );
          })
        }
      </View>
    );
  }
}

