import {
  TAROUI_DRAWER,
  HOME_PAGE_LIST
} from '../constants/home'

export const drawerShowHide = (data) => {
  return {
    type: TAROUI_DRAWER,
    data: data
  }
}

export const dispatchPageList = (payload) => ({type: HOME_PAGE_LIST, payload: payload})

export const dataPageList = (payload) => {
  console.log('测试',payload)
  return dispatch => {
    dispatch(dispatchPageList(payload))
  }
  
}

