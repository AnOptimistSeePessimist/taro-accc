/* eslint-disable import/no-commonjs */
/* eslint-disable no-unused-vars */
import Taro, {Component} from '@tarojs/taro';
import {View, Text, Image, ScrollView} from '@tarojs/components';

import './index.scss';

const MENU_LIST = [
  {key: 'favorite', text: '我的收藏', img: require('./assets/order.png')},
  {key: 'distribution', text: '我的发布', img: require('./assets/pin.png')},
  {key: 'information', text: '我的信息', img: require('./assets/bargain.png')},
  {key: 'updatePassword', text: '修改密码', img: require('./assets/credit.png')},
  {key: 'resources', text: '我的资源', img: require('./assets/service.png')},
  {key: 'transaction', text: '我的交易', img: require('./assets/location.png')}
];

export default class Menu extends Component {
  handleClick = (e) => {
    Taro.showToast({
      title: e.currentTarget.dataset.title,
      icon: 'success',
      duration: 2000
    });
  };


  render() {
    return (
      <View className='menu'>
        {
          MENU_LIST.map((menu, index) => {
            return (
              <View data-title={menu.text} key={menu.key} className='item' onClick={this.handleClick}>
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

