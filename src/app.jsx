/* eslint-disable import/first */
import Taro, { Component } from '@tarojs/taro'
import { Provider } from '@tarojs/redux'

import User from './pages/user/index'

import configStore from './store'

import 'taro-ui/dist/style/index.scss'; // 全局引入一次即可
import './app.scss'

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

const store = configStore()

class App extends Component {

  componentDidMount () {}

  config = {
    pages: [
      'pages/home/index',
      'pages/menu/index',
      'pages/user/index',
      'pages/sell/index',
      'pages/buy/index',
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fe871f',
      navigationBarTitleText: '空运帮',
      navigationBarTextStyle: 'white',
    },
    tabBar: {
      color: "#666",
      selectedColor: "#fe871f",
      backgroundColor: "#fafafa",
      borderStyle: 'black',
      list: [{
        pagePath: "pages/home/index",
        iconPath: "./assets/tab-bar/home.png",
        selectedIconPath: "./assets/tab-bar/home-active.png",
        text: "首页"
      },
      {
        pagePath: "pages/menu/index",
        iconPath: "./assets/tab-bar/menu.png",
        selectedIconPath: "./assets/tab-bar/menu-active.png",
        text: "菜单"
      },
      // {
      //   pagePath: "pages/buy/index",
      //   iconPath: "./assets/tab-bar/buy.png",
      //   selectedIconPath: "./assets/tab-bar/buy-active.png",
      //   text: "买家"
      // }, {
      //   pagePath: "pages/sell/index",
      //   iconPath: "./assets/tab-bar/sell.png",
      //   selectedIconPath: "./assets/tab-bar/sell-active.png",
      //   text: "卖家"
      // },
      {
        pagePath: "pages/user/index",
        iconPath: "./assets/tab-bar/user.png",
        selectedIconPath: "./assets/tab-bar/user-active.png",
        text: "我的"
      }]
    },
    subPackages: [
      {
        root: 'buy',
        name: 'buy',
        pages: [
          'pages/buy-manpower/index',
          'pages/buy-manpower-information/index',
          'pages/buy-confirm/index',
          'pages/buy-details/index',
          'pages/buy-material/index',
          'pages/buy-pay-success/index',
        ],
        independent: false
      },
      {
        root: 'user',
        pages: [
          'pages/user-information/index',
          'pages/user-release/index',
          'pages/user-release-details/index',
          'pages/user-resource/index',
          'pages/user-login/index',
          'pages/user-register/index',
          'pages/user-setting/index',
          'pages/user-transaction/index',
          'pages/user-order/index',
          'pages/user-order-details/index',
        ],
        independent: false
      },
      {
        root: 'sell',
        pages: [
          'pages/sell-manpower/index',
          'pages/sell-manpower-success/index',
        ],
        independent: false
      },
    ],
    preloadRule: {
      "pages/home/index": {
        network: "all",
        packages: ["buy"],
      }
    }
  }

  componentDidShow () {}

  componentDidHide () {}

  componentDidCatchError () {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
      <Provider store={store}>
        <User />
      </Provider>
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
