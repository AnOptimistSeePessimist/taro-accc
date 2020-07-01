import Taro, {Component} from '@tarojs/taro'
import {View, Text, ScrollView} from '@tarojs/components'
import { getWindowHeight } from '@utils/style'
import Address from './buy-address'
import './index.scss'

export default class BuyConfirm extends Component{

	config = {
		navigationBarTitleText: '下单确认'
	}

	

	componentWillMount(){
		console.log(JSON.parse(this.$router.params.data))
	}

	render(){
		const height = getWindowHeight(false)
		return(
			<View className='buy-comfirm'>

			 <ScrollView
					scrollY
					className='item-warp'
					style={{height}}
				>
				  <Address />
				</ScrollView>
			</View>
		)
	}
} 