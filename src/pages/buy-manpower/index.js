import Taro, { Component } from '@tarojs/taro'
import { View, Text, Picker, Button } from '@tarojs/components'
import { AtTag, AtInputNumber, AtList, AtListItem, AtButton } from 'taro-ui'
import { formatTimeStampToTime } from '@utils/common';
import './index.scss'
class BuyManpower extends Component {

	config = {
		navigationBarTitleText: '租人力'

	}


	constructor() {
		this.state = {
			hollowTagList: [
				{ name: '装卸工', active: false, id: 1 },
				{ name: '组板工', active: false, id: 2 },
				{ name: '叉车司机', active: false, id: 3 },
			],
			workerName: '',
			date: formatTimeStampToTime(Date.now()),
			isOpenedModal: false,
			startTime: '08:00',
			endTiem: '16:00',
			workers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 100, 1000],
			workersNum: 1
		}
	}

	handleHollowClick = (data) => {
		console.log(data)
		const { hollowTagList } = this.state
		hollowTagList.forEach((item) => {
			if (item.name == data.name) {
				item.active = !data.active
				this.state.workerName = data.name
			} else {
				item.active = false
			}
		})
		this.setState({
			hollowTagList
		})
	}

	dateClick = () => {
		console.log('时间')
		this.setState({
			isOpenedModal: !this.state.isOpenedModal
		})
	}
	onDateChange = e => {
		console.log(e)
		this.setState({
			date: e.detail.value
		})
	}
	onStartTimeChange = e => {
		this.setState({
			startTime: e.detail.value
		})
	}

	onEndTimeChange = e => {
		this.setState({
			endTiem: e.detail.value
		})
	}

	addworkers = value => {
		this.setState({
			workersNum: value
		})
	}

	btnChange = () => {
		const { startTime, endTiem, workersNum, workerName } = this.state;
		console.log('获取页面数据', startTime, endTiem, workersNum, workerName)
		Taro.navigateTo({ url: '/pages/buy-manpower-information/index' })
	}

	render() {
		return (
			<View className='panel'>
				{/* <View className='panel-title' style={{ backgroundColor: '#F7F7F7', paddingTop: '5px', paddingBottom: '5px' }}>人力分类</View> */}
				<View className='work-type'>
					{this.state.hollowTagList.map((item, index) => (
						<View key={item.id} className='AtTag-item'>
							<AtTag
								name={item.name}
								active={item.active}
								circle={true}
								onClick={this.handleHollowClick}
							>{item.name}</AtTag>
						</View>
					))}
				</View>
				<View className='choose-date-time'>
					<View>
						<Picker mode='date' onChange={this.onDateChange}>
							<AtList>
								<AtListItem title='请选择日期' extraText={this.state.date} />
							</AtList>
						</Picker>
					</View>
				</View>
				<View className='choose-date-time'>
					<View>
						<Picker mode='time' onChange={this.onStartTimeChange}>
							<AtList>
								<AtListItem title='开始时间' extraText={this.state.startTime} />
							</AtList>
						</Picker>
					</View>
				</View>
				<View className='choose-date-time'>
					<View>
						<Picker mode='time' onChange={this.onEndTimeChange}>
							<AtList>
								<AtListItem title='结束时间' extraText={this.state.endTiem} />
							</AtList>
						</Picker>
					</View>
				</View>
				<View className='choose-date-time'>
					<View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', borderBottom: '1px solid #F1F6FA', padding: '10px 10px' }}>
						<View className='workerText'>工人数量</View>
						<AtInputNumber
							className='at-input-number'
							min={0}
							max={100}
							step={10}
							value={this.state.workersNum}
							onChange={this.addworkers}
						/>
					</View>
				</View>
				<AtButton className='ButtonStyle' formType='submit' onClick={this.btnChange}>查询</AtButton>
			</View>
		)
	}
}

export default BuyManpower
