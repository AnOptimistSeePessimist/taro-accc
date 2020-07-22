import Taro, { Component } from '@tarojs/taro'
import { View, Text, Swiper, SwiperItem, ScrollView, Button, Picker } from '@tarojs/components'

export default class UserDetails extends Component {
	config = {
		navigationBarTitleText: '商品详情'
	}

	render(){
		return(
			<View>
				<Text>订单详情</Text>
			</View>
		)
	}
}
