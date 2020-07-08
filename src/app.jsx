/* eslint-disable import/first */
import Taro, { Component } from '@tarojs/taro'
import { Provider } from '@tarojs/redux'

import Index from './pages/index/index'

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
      'pages/user-information/index',
      'pages/user/index',
      'pages/sell/index',
      'pages/buy/index',
      'pages/buy-manpower/index',
      'pages/sell-manpower/index',
      'pages/login/index',
      'pages/buy-manpower-information/index',
      'pages/register/index',
      'pages/buy-confirm/index',
      'pages/buy-details/index',
      'pages/setting/index',
      'pages/buy-material/index',
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fe871f',
      navigationBarTitleText: '空运帮',
      navigationBarTextStyle: 'white'
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
      }, {
        pagePath: "pages/buy/index",
        iconPath: "./assets/tab-bar/buy.png",
        selectedIconPath: "./assets/tab-bar/buy-active.png",
        text: "买家"
      }, {
        pagePath: "pages/sell/index",
        iconPath: "./assets/tab-bar/sell.png",
        selectedIconPath: "./assets/tab-bar/sell-active.png",
        text: "卖家"
      }, {
        pagePath: "pages/user/index",
        iconPath: "./assets/tab-bar/user.png",
        selectedIconPath: "./assets/tab-bar/user-active.png",
        text: "我的"
      }]
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
        <Index />
      </Provider>
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
