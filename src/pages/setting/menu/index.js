/* eslint-disable import/no-commonjs */
/* eslint-disable no-unused-vars */
import Taro, {Component} from '@tarojs/taro';
import {View, Text} from '@tarojs/components';

import './index.scss';

const MENU_LIST = [
  {key: 'information', text: '我的信息', img: 'iconinfo', path: '/pages/user-information/index'},
  {key: 'updatePassword', text: '修改密码', img: 'iconxiugaimima', path: '/pages/updatePassword/index'}
];

export default class Menu extends Component {
  handleClick = (path) => {
    Taro.navigateTo({url: path});
  };

  render() {
    return (
      <View className='menu'>
        {
          MENU_LIST.map((menu, index) => {
            return (
              <View data-title={menu.text} key={menu.key} className='item' onClick={() => this.handleClick(menu.path)}>
                <View className='left'>
                <View className={`iconfont img ${menu.img}`} />
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