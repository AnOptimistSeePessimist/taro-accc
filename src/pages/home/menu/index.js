import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { IMAGE_PREFIX } from '@constants/api';
import './index.scss'

export default class Menu extends Component {
	static defaultProps = {
		listImg: {},
		hresCargostationMap: [],
		oncloseModal: () => {}
	}

	constructor(props) {
		super(props)
		this.state = {
			isModalOpened: false,
			stationdsc: []
		}
	}

	closeModal = () => {
		const {oncloseModal} = this.props
		// console.log('函数', oncloseModal)
		oncloseModal(this.props.hresCargostationMap)
	}

	confirm = () => {
		const { listImg, hresCargostationMap } = this.props
		const hcmKeys = Object.keys(hresCargostationMap)
		console.log('hcmKeys', hcmKeys)
		let hresCargostation
		hcmKeys.map((key) => {
			console.log('hresCargostationMap', hresCargostationMap[key])
			hresCargostation =	hresCargostationMap[key]
		})
		console.log('Menu测试数据', listImg)
		this.$preload('item', listImg)
		this.$preload('hresCargostationMap', hresCargostation)
		Taro.navigateTo({ url: `/buy/pages/buy-details/index` })
	}
	render() {
		const { listImg } = this.props
		console.log(listImg)
		const time = parseInt(listImg.timeEnd) - parseInt(listImg.timeStart)
		return (
			<View className='data-img'>
				<Image
					className='img'
					src={IMAGE_PREFIX + listImg.workTypePicUrl}
					onClick={this.confirm}
				/>
				<View className='text'>
					<Text className='text-workerName' onClick={this.confirm}>{listImg.workTypeName} </Text>
					<Text className='text-hours' onClick={this.confirm}>{listImg.timeStart} - {listImg.timeEnd} ({time}小时)</Text>
					<Text className='text-hours' onClick={this.confirm}>日期:</Text>
					<View className='text-data-text' onClick={this.confirm}>
							{listImg.workdateList && listImg.workdateList.map((item) => {
								return (<Text key={item}>{item}</Text>)
							})}
					</View>
					<Text className='text-dollar' onClick={this.confirm}>￥{listImg.price}/小时</Text>
					<Text className='text-workerStation' onClick={this.closeModal}> ({listImg.rsNum}人)</Text>
				</View>

			
			</View>
		)
	}
}
