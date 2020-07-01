import Taro, { Component } from '@tarojs/taro'
import { View, Text, Icon} from '@tarojs/components'
import './index.scss'

export default class BuyAddress extends Component {

	static defaultProps = {
		list: {}
	}

	constructor(props) {
		super(props);
		this.state = {
			address: {
				userName: '张三',
				phone: '12345678911',
				userAddress: '上海市浦东国际机场厂区7号仓库'
			}

		}
	}

	render() {
		const { userName, phone, userAddress } = this.state.address
		return (
			<View className='buy-address'>
				<Text>{userName}</Text>
				<Text>{phone}</Text>
				<Text>{userAddress}</Text>
				<Icon size='30' type=''/>
			</View>
		)
	}
}
