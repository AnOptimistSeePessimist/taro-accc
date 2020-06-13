import Taro, { Component } from '@tarojs/taro'
import { Provider } from '@tarojs/redux'

// import Index from './pages/index/index'
import Home from './pages/home';

import configStore from './store'

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
      // 'pages/index/index',
      'pages/home/index',
      'pages/buy/index',
      'pages/sell/index',
      'pages/user/index',
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: '货运帮',
      navigationBarTextStyle: 'black'
    },
    tabBar: {
      color: "#666",
      selectedColor: "#b4282d",
      backgroundColor: "#fafafa",
      borderStyle: 'black',
      list: [{
        pagePath: "pages/home/index",
        iconPath: "./assets/tab-bar/home.png",
        selectedIconPath: "./assets/tab-bar/home-active.png",
        text: "首页"
      }, {
        pagePath: "pages/buy/index",
        iconPath: "./assets/tab-bar/cate.png",
        selectedIconPath: "./assets/tab-bar/cate-active.png",
        text: "买"
      }, {
        pagePath: "pages/sell/index",
        iconPath: "./assets/tab-bar/cart.png",
        selectedIconPath: "./assets/tab-bar/cart-active.png",
        text: "卖"
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
        <Home />
      </Provider>
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
