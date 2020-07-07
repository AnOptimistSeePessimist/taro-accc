import Taro, { Component } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { AtInputNumber } from 'taro-ui';

import './index.scss';

export default class Information extends Component {
	static defaultProps = {
		listData: {},
		value: '',
		onhandNum: () => {}
	}

	constructor(props) {
		super(props)
		const {value} = props
		this.state = {
			value,
		}
	}

	handleValueChange = (value) => {
		this.setState({ value });
		this.props.onhandNum(value)
	};

	render() {
		const {listData} = this.props
		const {value} = this.state
		const { dollar, time, workerNum, imgSrc, startTime, endTime, station, workerType } = listData
		console.log('详细信息Information', value, listData)
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
		<Text className='information-item-dollar-money'>￥{dollar}</Text>
					<Text className='information-item-dollar-workerNum'>×{value}</Text>
				</View>
			</View>
			<View className='setting-spec'>
				<Text>员工数量</Text>
				<AtInputNumber
					className='at-input-number'
					min={1}
					max={parseInt(workerNum)}
					step={1}
					value={value}
					onChange={this.handleValueChange}
				/>
			</View>
			</View >
		)
	}
}
