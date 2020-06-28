import Taro, {Component} from '@tarojs/taro'
import {View, Text} from '@tarojs/components'
import './index.scss'

export default class BuyConfirm extends Component{

	config = {
		navigationBarTitleText: '下单确认'
	}

	componentWillMount(){
		console.log(JSON.parse(this.$router.params.buyData))
	}

	render(){
		return(
			<View>
				<Text>下单确认</Text>
			</View>
		)
	}
} 