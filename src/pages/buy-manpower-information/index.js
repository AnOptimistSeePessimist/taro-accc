import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.scss'

class LeaseInformation extends Component {

	config = {
		navigationBorTitileText: '租人力'
	}

	render() {
		return (
			<View>
				<View className='panel-title' style={{ backgroundColor: '#F7F7F7', paddingTop: '5px', paddingBottom: '5px' }}>人力信息</View>
				<View className='information-title'>
					<View className='dataList'>
						<Image
							style='width: 100%;height: 300rpx;background: #fff;'
							src='https://picsum.photos/seed/picsum/200/300'
						/>
						<View className='text'>
							<Text>￥60/小时</Text>
							<Text>装卸工 2020-02-20 08：00-16：00 （8小时）</Text>
							<Text>浦东国际机场货站（3人）</Text>
						</View>
					</View>

					<View className='dataList'>
						<Image
							style='width: 100%;height: 300rpx;background: #fff;'
							src='https://picsum.photos/seed/picsum/200/300'
						/>
						<View className='text'>
							<Text>￥60/小时</Text>
							<Text>装卸工 2020-02-20 08：00-16：00 （8小时）</Text>
							<Text>浦东国际机场货站（3人）</Text>
						</View>

					</View>

				</View>
			</View>
		)
	}
}
export default LeaseInformation
