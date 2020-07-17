/* eslint-disable import/no-commonjs */
/* eslint-disable no-unused-vars */
import Taro, {Component} from '@tarojs/taro';
import {View, Text} from '@tarojs/components';
import {connect} from '@tarojs/redux';

import './index.scss';

const MENU_LIST = [
  {key: 'resources', text: '我的资源', img: 'iconresource', path: '/pages/user-resource/index'},
  {key: 'order', text: '我的订单', img: 'iconemaxcitygerenxinxitubiaoji03', path: '/pages/order/index'},
  {key: 'workOrder', text: '我的工单', img: 'icongongdan', path: '/pages/work-order/index'},
  {key: 'release', text: '我的发布', img: 'iconfabu', path: '/pages/user-release/index'},
  {key: 'transaction', text: '我的交易', img: 'iconjiaoyi', path: '/pages/transaction/index'},
];

@connect(state => ({userInfo: state.user.userInfo}), {})
export default class Menu extends Component {
  handleClick = (path) => {
    const {userInfo} = this.props;
    console.log('User-Menu: ', userInfo);

    if (!userInfo.login) {
      Taro.navigateTo({url: '/pages/login/index'});
    } else {
      Taro.navigateTo({url: path});
    }
  };

  render() {
    const {userInfo} = this.props;
    console.log('userMenu: ', userInfo);
    let curUserMenu = [];

    if (userInfo.login) {
      const menuDtoSet = userInfo.auth.menuDtoSet;
      const myMenuDto = menuDtoSet.find(menuDto => {
        return menuDto.menuName === '我的';
      });

      if (myMenuDto) {
        curUserMenu = myMenuDto.subMenuDtoList.filter((myMenu) => {
          return !(myMenu.menuName === "我的信息" || myMenu.menuName === "修改密码");
        });
      }

    }

    return (
      <View className='menu'>
        {
          userInfo.login && MENU_LIST.map((menu, index) => {
            const findOutMenu = curUserMenu.find(curMenu => {
              return menu.text === curMenu.menuName;
            });
            if (findOutMenu) {
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
            }
          })
        }
      </View>
    );
  }
}

