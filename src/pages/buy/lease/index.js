import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtTag, AtCalendar } from 'taro-ui'
import './index.scss'
class lease extends Component {

	config = {
		navigationBarTitleText: '租人力'

	}


	constructor() {
		this.state = {
			hollowTagList: [
				{ name: '装卸工', active: false },
				{ name: '组板工', active: false },
				{ name: '叉车司机', active: false },
			],
		}
	}

	handleHollowClick = (data) => {
		console.log(data)
		const { hollowTagList } = this.state
		hollowTagList.forEach((item) => {
			if (item.name == data.name) {
				item.active = !data.active
			} else {
				item.active = false
			}
		})
		this.setState({
			hollowTagList
		})
	}

	render() {
		return (
			<View>
				<View className='panel-title'>人力分类</View>
				<View className='example-item'>
					{this.state.hollowTagList.map((item, index) => (
						<View key={index} className='AtTag-item'>
							<AtTag
								name={item.name}
								active={item.active}
								circle={true}
								onClick={this.handleHollowClick}
							>{item.name}</AtTag>
						</View>
					))}
				</View>
				{true && (<AtCalendar  onSelectDate={(value) => {console.log('日期',value)}}/>)}
			</View>
		)
	}
}

export default lease

