/* eslint-disable import/prefer-default-export */
/* eslint-disable no-unused-vars */
import Taro from '@tarojs/taro';

const NAVIGATOR_HEIGHT =44;
const TAB_BAR_HEIGHT = 50;

/**
 * 
 * 返回屏幕可用高度
 * 
 * @param {*} showTabBar
 */
export function getWindowHeight(showTabBar = true) {
  const info = Taro.getSystemInfoSync();
  const {windowHeight, statusBarHeight, titleBarHeight} = info;
  const tabBarHeight = showTabBar ? TAB_BAR_HEIGHT : 0;

  return `${windowHeight}px`;
}
