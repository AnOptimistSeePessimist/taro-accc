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
      {key: 'buy1', text: '租人力', img: 'iconrenli', path: '/buy/pages/buy-manpower/index'},
      {key: 'buy2', text: '买耗材', img: 'icontubiao-', path:'/buy/pages/buy-material/index'},
      {key: 'buy3', text: '租叉车', img: 'iconchache1'},
      {key: 'buy4', text: '去拼车', img: 'iconpincheguanli'},
    ] 
  },
  {
    sectionName: '卖家',
    sectionId: 'sell',
    subMenu: [
      {key: 'buy3', text: '出租人力', img: 'iconLaw_manpower', path: '/sell/pages/sell-manpower/index'},
      {key: 'buy1', text: '出租叉车', img: 'iconchache'},
      {key: 'buy2', text: '出租拼车', img: 'iconcar'},
      {key: 'buy4', text: '售卖耗材', img: 'iconsuppliesinvoice'},
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

  handleClick = (path) => {
    if (!this.props.userInfo.login) {
      Taro.navigateTo({url: '/user/pages/user-login/index'});
    } else {
      Taro.navigateTo({url: path});
    }
  };

  render() {
    return (
      <View className='menu'>
        {
          menuList.map((menu) => {
            const {sectionName, sectionId, subMenu} = menu;
            return (
              <View className='section-container' key={sectionId}>
                <View className='section-header'>
                  <Text className='section-header-title'>{sectionName}</Text>
                </View>
                <View className='sub-menu'>
                {
                  subMenu.map((subMenuItem, index) => {
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
                        onClick={() => this.handleClick(subMenuItem.path)}
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
