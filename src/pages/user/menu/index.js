/* eslint-disable import/no-commonjs */
/* eslint-disable no-unused-vars */
import Taro, {Component} from '@tarojs/taro';
import {View, Text} from '@tarojs/components';
import {connect} from '@tarojs/redux';

import './index.scss';

const MENU_LIST = [
  {key: 'resources', text: '我的资源', img: 'iconresource', path: '/user/pages/user-resource/index', finished: true},
  {key: 'order', text: '我的订单', img: 'iconemaxcitygerenxinxitubiaoji03', path: '/user/pages/user-order/index', finished: true},
  {key: 'workOrder', text: '我的工单', img: 'icongongdan', path: '/user/pages/user-work-order/index', finished: true},
  {key: 'release', text: '我的发布', img: 'iconfabu', path: '/user/pages/user-release/index', finished: true},
  {key: 'transaction', text: '我的交易', img: 'iconjiaoyi', path: '/user/pages/user-transaction/index', finished: true},
];

@connect(state => ({userInfo: state.user.userInfo}), {})
export default class Menu extends Component {
  handleClick = (path, finished) => {
    const {userInfo} = this.props;
    console.log('User-Menu: ', userInfo);

    if (!userInfo.login) {
      Taro.navigateTo({url: '/user/pages/user-login/index'});
    } else {
      if (finished) {
        Taro.navigateTo({url: path});
      } else {
        Taro.showToast({
          icon: 'none',
          title: '敬请期待'
        });
      }
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
                  onClick={() => this.handleClick(menu.path, menu.finished)}
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

