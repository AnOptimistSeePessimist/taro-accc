import Taro, { Component } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { AtInputNumber } from 'taro-ui';

import './index.scss';

export default class Information extends Component {
	static defaultProps = {
		listData: {}
	}

	constructor(props) {
		super(props)
		const listData = props
		this.state = {
			value: listData.listData.workerNum,
		}
	}

	handleValueChange = (value) => {
		this.setState({ value });
	};

	render() {
		const listData = this.props
		const { dollar, time, workerNum, imgSrc, startTime, endTime, station, workerType } = listData.listData
		console.log('详细信息Information', listData.listData)
		return (
			<View className='information-item'>
				<Text className='information-item-station'>{station}</Text>
				<View className='information-item-goods'>
					<View className='information-item-img'>
						<Image
							className='img'
							src={imgSrc}
						/>
					</View>
					<View className='information-item-text'>
						<Text className='title' style={{overflow: 'hidden', textOverflow: 'ellipsis', WebkitLineClamp: '2', display: '-webkit-box', WebkitBoxOrient: 'vertical'}}>{station} {workerType}</Text>
					<Text className='information-item-text-type'>规格：时间从{startTime} 至 {endTime} {time}小时</Text>
				</View>
				<View className='information-item-dollar'>
					<Text className='information-item-dollar-money'>￥60.00</Text>
					<Text className='information-item-dollar-workerNum'>×{workerNum}</Text>
				</View>
			</View>
			<View className='setting-spec'>
				<Text>员工数量</Text>
				<AtInputNumber
					className='at-input-number'
					min={1}
					max={1000}
					step={1}
					value={this.state.value}
					onChange={this.handleValueChange}
				/>
			</View>
			</View >
		)
	}
}
