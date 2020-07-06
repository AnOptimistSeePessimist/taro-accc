import Taro, {Component} from '@tarojs/taro'
import {View, Text, Button} from '@tarojs/components'

import './index.scss'

export default class Footer extends Component {
	static defaultProps = {
		listDat: {}
	}

	render(){
		return (
			<View className='footer-item'>
				<Text className='footer-item-num'>共2件,</Text>
				<Text className='footer-item-total'>合计:</Text>
				<Text className='footer-item-dollar'>￥120</Text>
				<Button className='footer-item-btn'>提交订单</Button>
			</View>
		)
	}

}
