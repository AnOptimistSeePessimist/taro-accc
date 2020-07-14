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
		const time = parseInt(listImg.timeEnd) - parseInt(listImg.timeStart)
		return (
			<View className='data-img' onClick={this.confirm}>
				<Image
					className='img'
					src={listImg.imgSrc}
				/>
				<View className='text'>
					<Text className='text-workerName'>{listImg.workTypeName} </Text>
					<Text className='text-hours'>{listImg.timeStart} - {listImg.timeEnd} ({time}小时) {listImg.dateStart}</Text>
					<Text className='text-dollar'>￥{listImg.price}/小时</Text>
					<Text className='text-workerStation'> ({listImg.rsNum}人)</Text>
				</View>
			</View>
		)
	}
}
