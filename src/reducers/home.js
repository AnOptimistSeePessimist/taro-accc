import {
  TAROUI_DRAWER
} from '../constants/home'

const INITIAL_STATE = {
  showHideDrawer: false
}
export default function drawerShow(state = INITIAL_STATE, actions) {
  switch (actions.type) {
    case TAROUI_DRAWER:
      return {
        ...state,
        showHideDrawer: actions.data
      }
      default:
        return state
  }
}
