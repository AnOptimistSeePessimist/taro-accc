import Taro, { Component } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { AtInputNumber } from 'taro-ui';

import './index.scss';
import list from 'dist/npm/taro-ui/dist/weapp/components/list';

export default class Information extends Component {
	static defaultProps = {
		listData: {},
		value: '',
		dollar: Number,
		textTitle: '',
		onhandNum: () => { }
	}

	constructor(props) {
		super(props)
		const { value, dollar, textTitle } = props
		console.log(value)
		this.state = {
			value,
			dollar,
			textTitle,
		}
	}

	handleValueChange = (value) => {
		this.setState({ value });
		this.props.onhandNum(value)
	};

	render() {
		const { listData } = this.props
		listData.station = '上海浦东国际机场货站'
		const { value, dollar, textTitle } = this.state
		const {rsNum, imgSrc,station, workTypeName } = listData
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
						<Text className='title' style={{ overflow: 'hidden', textOverflow: 'ellipsis', WebkitLineClamp: '2', display: '-webkit-box', WebkitBoxOrient: 'vertical' }}>{station} {workTypeName}</Text>
						<Text className='information-item-text-type'>{textTitle}</Text>
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
						max={parseInt(rsNum)}
						step={1}
						value={value}
						onChange={this.handleValueChange}
					/>
				</View>
			</View >
		)
	}
}
