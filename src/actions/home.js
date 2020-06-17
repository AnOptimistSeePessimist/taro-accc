import {TAROUI_DRAWER} from '../constants/home'

export const drawerShowHide = (data) => {
 return{
	 type: TAROUI_DRAWER,
	 data: data
 }
}