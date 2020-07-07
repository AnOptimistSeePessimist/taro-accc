import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.scss'

export default class Menu extends Component {
	static defaultProps = {
		listImg: {}
	}

	confirm = () => {
		const { listImg } = this.props
		console.log('Menu测试数据', listImg)
		Taro.navigateTo({ url: `/pages/buy-details/index?item=${JSON.stringify(listImg)}` })
	}
	render() {
		const { listImg } = this.props
		return (
			<View className='data-img' onClick={this.confirm}>
				<Image
					className='img'
					src={listImg.imgSrc}
				/>
				<View className='text'>
					<Text className='text-workerName'>{listImg.workerType} </Text>
					<Text className='text-hours'>{listImg.startTime} - {listImg.endTime} ({listImg.time}小时) {listImg.date}</Text>
					<Text className='text-dollar'>￥{listImg.dollar}/小时</Text>
					<Text className='text-workerStation'>{listImg.station} ({listImg.workerNum}人)</Text>
				</View>
			</View>
		)
	}
}
