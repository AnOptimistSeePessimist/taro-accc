import Taro, {Component} from '@tarojs/taro';
import {View, Text} from '@tarojs/components';
import {connect} from '@tarojs/redux';
import classNames from 'classnames';

import './index.scss';

const menuList = [
  {
    sectionName: '买家',
    sectionId: 'buy',
    subMenu: [
      {key: 'buy1', text: '租人力', img: 'iconrenli', path: '/buy/pages/buy-manpower/index', finished: true},
      {key: 'buy2', text: '买耗材', img: 'icontubiao-', path:'/buy/pages/buy-material/index', finished: false},
      {key: 'buy3', text: '租叉车', img: 'iconchache1', finished: false},
      {key: 'buy4', text: '去拼车', img: 'iconpincheguanli', finished: false},
    ]
  },
  {
    sectionName: '卖家',
    sectionId: 'sell',
    subMenu: [
      {key: 'buy3', text: '出租人力', img: 'iconLaw_manpower', path: '/sell/pages/sell-manpower/index', finished: true},
      {key: 'buy1', text: '出租叉车', img: 'iconchache', finished: false},
      {key: 'buy2', text: '出租拼车', img: 'iconcar', finished: false},
      {key: 'buy4', text: '售卖耗材', img: 'iconsuppliesinvoice', finished: false},
    ]
  }
];

const COUNT_LINE = 2;

@connect(state => ({
  userInfo: state.user.userInfo,
}), {})
class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  config = {
    navigationBarTitleText: '菜单',
  };

  handleClick = (path, finished) => {
    if (!this.props.userInfo.login) {
      Taro.navigateTo({url: '/user/pages/user-login/index'});
    } else {
      if (finished) {
        Taro.navigateTo({url: path});
      } else {
        Taro.showToast({
          title: '敬请期待',
          icon: 'none',
        });
      }
    }
  };

  render() {
    return (
      <View className='menu'>
        {
          this.props.userInfo.login &&
          menuList.map((menu) => {
            const {sectionName, sectionId, subMenu} = menu;
            menu.curMenu = this.props.userInfo.auth.menuDtoSet.find((menuDtoItem) => {
              return sectionName === menuDtoItem.menuName;
            });
            return (
              <View className='section-container' key={sectionId}>
                <View className='section-header'>
                  <Text className='section-header-title'>{sectionName}</Text>
                </View>
                <View className='sub-menu'>
                {
                  !!!menu.curMenu ?
                  (
                    <View className='nil-sub-menu'>
                      <Text>您还没有成为{menu.sectionName}</Text>
                    </View>
                  )
                  :
                  menu.curMenu.subMenuDtoList && menu.subMenu.map((subMenuItem, index) => {
                    const curSubMenu = menu.curMenu.subMenuDtoList.find((curSubMenuItem) => {
                      return subMenuItem.text === curSubMenuItem.menuName;
                    });

                    if (!!!curSubMenu) {
                      return <View/>
                    }

                    const nth = (index + 1) % COUNT_LINE === 0;
                    const firstLine = index === 0 || index === 1;
                    const lastLine = parseInt(index / COUNT_LINE) === parseInt(menu.subMenu.length / COUNT_LINE);
                    return (
                      <View
                        key={subMenuItem.key}
                        className={classNames(
                          'item',
                          firstLine && 'item-first',
                          nth && 'item-nth',
                          lastLine && subMenu.length % 2 === 1 && 'item-nth'
                        )}
                        onClick={() => this.handleClick(subMenuItem.path, subMenuItem.finished)}
                      >
                        <View className={`iconfont ${subMenuItem.img} img`} />
                        <Text className='title'>{subMenuItem.text}</Text>
                      </View>
                    );
                  })
                }
                </View>
              </View>
            );
          })
        }
      </View>
    );
  }
}

export default Menu;
