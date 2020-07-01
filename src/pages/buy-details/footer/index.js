import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
// import jump from '@utils/jump'
import homeIcon from './assets/home.png'
import serviceIcon from './assets/service.png'
import cartIcon from './assets/cart.png'
import './index.scss'

const NAV_LIST = [{
  key: 'home',
  img: homeIcon,
  url: '/pages/home/home'
}, {
  key: 'service',
  img: serviceIcon
}, {
  key: 'service',
  img: cartIcon,
  //url: '/pages/cart/cart'
}]

export default class Footer extends Component {
  static defaultProps = {
    data: {},
    onAdd: () => {}
  }

  handleNav = (item) => {
    if (item.key === 'service') {
      Taro.showToast({
        title: '敬请期待',
        icon: 'none'
      })
    } else {
      // jump({ url: item.url, method: 'switchTab' })
    }
  }

  handShopping = () => {
    Taro.showToast({
        title: '敬请期待',
        icon: 'none'
      })
  }

  handleBuy = () => {
    // Taro.showToast({
    //   title: '暂时只支持加入购物车',
    //   icon: 'none'
    // })
    const {data} = this.props;
    Taro.navigateTo({url: `/pages/buy-confirm/index?data=${JSON.stringify(data)}`})
  }

  render () {
    const {data} = this.props;
    console.log('购买',data)
    return (
      <View className='item-footer'>
        {NAV_LIST.map(item => (
          <View
            key={item.key}
            className='item-footer-nav'
            onClick={this.handleNav.bind(this, item)}
          >
            <Image
              className='item-footer-nav-img'
              src={item.img}
            />
          </View>
        ))}
        <View className='item-footer-shopping-cart' onClick={this.handShopping}>
          <Text className='item-footer-buy-txt'>加入购物车</Text>
        </View>
        <View className='item-footer-buy' onClick={this.handleBuy}>
          <Text className='item-footer-buy-txt'>立即购买</Text>
        </View>
      </View>
    )
  }
}