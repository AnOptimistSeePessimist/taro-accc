import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import {
	AtModal,
	AtModalHeader,
	AtModalContent,
	AtModalAction,
} from 'taro-ui'

import './index.scss'

export default class Menu extends Component {
	static defaultProps = {
		listImg: {},
		hresCargostationMap: []
	}

	constructor(props) {
		super(props)
		this.state = {
			isModalOpened: false,
			stationdsc: []
		}
	}

	closeModal = () => {
		console.log('关闭')
		this.setState({
			isModalOpened: !this.state.isModalOpened
		})
	}

	confirm = () => {
		const { listImg, hresCargostationMap } = this.props
		const hcmKeys = Object.keys(hresCargostationMap)
		const hresCargostation =hcmKeys.map((key) => {
			return 	hresCargostationMap[key]
		})
		console.log('Menu测试数据', hresCargostation)
		Taro.navigateTo({ url: `/buy/pages/buy-details/index?item=${JSON.stringify(listImg)}&hresCargostationMap=${JSON.stringify(hresCargostation)}` })
	}
	render() {
		const { listImg, hresCargostationMap } = this.props
		console.log(listImg)
		const hcmKeys = Object.keys(hresCargostationMap)
		// console.log(hcmKeys)
		const time = parseInt(listImg.timeEnd) - parseInt(listImg.timeStart)
		return (
			<View className='data-img'>
				<Image
					className='img'
					src={listImg.imgSrc}
					onClick={this.confirm}
				/>
				<View className='text'>
					<Text className='text-workerName' onClick={this.confirm}>{listImg.workTypeName} </Text>
					<Text className='text-hours' onClick={this.confirm}>{listImg.timeStart} - {listImg.timeEnd} ({time}小时)</Text>
					<View className='text-data'  onClick={this.confirm}>
						<View className='text-hours'>日期:</View>
						<View className='text-data-text'>
							{listImg.workdateList && listImg.workdateList.map((item) => {
								return (<Text key={item}>{item}</Text>)
							})}
						</View>
					</View>
					<Text className='text-dollar' onClick={this.confirm}>￥{listImg.price}/小时</Text>
					<Text className='text-workerStation' onClick={this.closeModal}> ({listImg.rsNum}人)</Text>
				</View>

				<AtModal
					isOpened={this.state.isModalOpened}
					onClose={this.closeModal}
				>
					<AtModalHeader>适用区域</AtModalHeader>
					<AtModalContent>
						<View className='modal-content'>
							{
								hcmKeys.map((key, index) => {
									return (
										<View key={index}> 1 人:
											{
												hresCargostationMap[key].map((item, hcIndex) => {
													return (<Text key={hcIndex}>{item.stationdsc} (
														{
															item.passareaDtoList.map((item, passIndex) => {
																return (<Text key={passIndex}>{item.areaCode} </Text>)
															})
														}
													) </Text>)
												})
											}
										</View>)
								})
							}
						</View>
					</AtModalContent>
					<AtModalAction>
						<Button onClick={this.closeModal}>
							确定
            </Button>
					</AtModalAction>
				</AtModal>
			</View>
		)
	}
}
