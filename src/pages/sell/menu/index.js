import Taro, {Component} from '@tarojs/taro';
import {View, Text} from '@tarojs/components';
import classNames from 'classnames';
import {connect} from '@tarojs/redux';

import './index.scss';

const MENU_LIST = [
  {key: 'buy3', text: '出租人力', img: 'iconLaw_manpower', path: '/pages/sell-manpower/index'},
  {key: 'buy1', text: '出租叉车', img: 'iconchache'},
  {key: 'buy2', text: '出租拼车', img: 'iconcar'},
  {key: 'buy4', text: '售卖耗材', img: 'iconsuppliesinvoice'},
];

const COUNT_LINE = 2;

@connect(state => ({
  userInfo: state.user.userInfo,
}), {})
class Menu extends Component {
  constructor(props) {
    super(props);
  }

  handleClick = (path) => {
    if (!this.props.userInfo.login) {
      Taro.navigateTo({url: '/pages/login/index'});
    } else {
      Taro.navigateTo({url: path});
    }
  };


  render() {
    console.log('Menu - props: ', this.props.userInfo);
    return (
      <View className='menu'>
        {
          MENU_LIST.map((menu, index) => {
            const nth = (index + 1) % COUNT_LINE === 0;
            const firstLine = index === 0 || index === 1;
            const lastLine = parseInt(index / COUNT_LINE) === parseInt(MENU_LIST.length / COUNT_LINE);
            return (
              <View
                key={menu.key}
                className={classNames(
                  'item',
                  firstLine && 'item-first',
                  nth && 'item-nth',
                  lastLine && MENU_LIST.length % 2 === 1 && 'item-nth'
                )}
                onClick={() => this.handleClick(menu.path)}
              >
                <View className={`iconfont ${menu.img} img`} />
                <Text className='title'>{menu.text}</Text>
              </View>
            );
          })
        }
      </View>
    );
  }
}

export default Menu;
