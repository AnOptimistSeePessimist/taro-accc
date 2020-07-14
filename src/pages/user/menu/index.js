/* eslint-disable import/no-commonjs */
/* eslint-disable no-unused-vars */
import Taro, {Component} from '@tarojs/taro';
import {View, Text} from '@tarojs/components';

import './index.scss';

const MENU_LIST = [
  {key: 'release', text: '我的发布', img: 'iconfabu', path: '/pages/user-release/index'},
  {key: 'resources', text: '我的资源', img: 'iconresource', path: '/pages/resources/index'},
  {key: 'transaction', text: '我的交易', img: 'iconjiaoyi', path: '/pages/transaction/index'}
];

export default class Menu extends Component {
  handleClick = (path) => {
    const {userInfo} = this.props;

    if (!userInfo.login) {
      Taro.navigateTo({url: '/pages/login/index'});
    } else {
      Taro.navigateTo({url: path});
    }
  };

  render() {
    return (
      <View className='menu'>
        {
          MENU_LIST.map((menu, index) => {
            return (
              <View 
                data-title={menu.text} 
                key={menu.key} 
                className='item' 
                onClick={() => this.handleClick(menu.path)}
              >
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

