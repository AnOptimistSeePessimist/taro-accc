import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'

import './index.scss'

export default class Footer extends Component {
	static defaultProps = {
		listData: {},
		value: ''
	}

	render() {
		const { value, listData } = this.props
		const { dollar } = listData
		return (
			<View className='footer-item'>
				<Text className='footer-item-num'>共{value}件,</Text>
				<Text className='footer-item-total'>合计:</Text>
				<Text className='footer-item-dollar'>￥{dollar * value}</Text>
				<Button className='footer-item-btn'>提交订单</Button>
			</View>
		)
	}

}
