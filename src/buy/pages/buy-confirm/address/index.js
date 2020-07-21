import Taro, { Component } from '@tarojs/taro'
import { View, Text} from '@tarojs/components'
import './index.scss'

export default class Address extends Component {

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
				<View className={`iconfont iconionc-- img`} />
				<View className='buy-address-userName-phone-address'>
					<View className='buy-address-userName-phone'>
						<Text>{userName}</Text>
						<Text className='buy-address-phone'>{phone}</Text>
					</View>
					<Text className='buy-address-address'>{userAddress}</Text>
				</View>
			</View>
		)
	}
}
