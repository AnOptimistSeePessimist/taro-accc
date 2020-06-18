import Taro, {Component} from '@tarojs/taro';
import {View, Text} from '@tarojs/components';
import classNames from 'classnames';

import './index.scss';

const MENU_LIST = [
  {key: 'buy1', text: '租人力', img: require('./assets/order.png'), path: '/pages/buy/lease/index'},
  {key: 'buy2', text: '买耗材', img: require('./assets/pin.png')},
  {key: 'buy3', text: '租叉车', img: require('./assets/bargain.png')},
  {key: 'buy4', text: '去拼车', img: require('./assets/credit.png')},
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
                <Image 
                  className='img'
                  src={menu.img}
                />
                <Text className='title'>{menu.text}</Text>
              </View>
            );
          })
        }
      </View>
    );
  }
}
