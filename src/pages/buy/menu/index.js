import Taro, {Component} from '@tarojs/taro';
import {View, Text} from '@tarojs/components';
import classNames from 'classnames';

import './index.scss';

const MENU_LIST = [
  {key: 'buy1', text: '租人力', img: 'iconrenli', path: '/pages/buy-manpower/index'},
  {key: 'buy2', text: '买耗材', img: 'icontubiao-'},
  {key: 'buy3', text: '租叉车', img: 'iconchache1'},
  {key: 'buy4', text: '去拼车', img: 'iconpincheguanli'},
];

const COUNT_LINE = 2;

export default class Menu extends Component {
  handleClick = (path) => {
    //const {userInfo} = this.props;

    // if (!userInfo.login) {
      
    // }
    Taro.navigateTo({url: path});
    
  }

  render() {
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
