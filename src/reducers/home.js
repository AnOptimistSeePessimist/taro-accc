import {
  TAROUI_DRAWER, HOME_PAGE_LIST
} from '../constants/home'

const INITIAL_STATE = {
  showHideDrawer: false
}
export default function home(state = INITIAL_STATE, actions) {
  switch (actions.type) {
    case TAROUI_DRAWER:
      return {
        ...state,
        showHideDrawer: actions.data
      };
    case HOME_PAGE_LIST: 
      return {
        ...state,
        pageList: actions.payload
      }
      default:
        return state
  }
}
