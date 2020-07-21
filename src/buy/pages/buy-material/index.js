import Taro, { Component } from '@tarojs/taro';
import {
	View,
	Text,
	Picker,
} from '@tarojs/components';
import {
	AtTag,
	AtForm,
	AtButton,
	AtList,
	AtListItem,
	AtInputNumber,
} from 'taro-ui';
import classnames from 'classnames';
import { formatTimeStampToTime } from '@utils/common';

import './index.scss';


class BuyMaterial extends Component {
	constructor(props) {
		super(props);
		this.state = {
			widthValue: '1',
			heightValue: '1',
			isView: false,
			list: [
				{
					id: 1,
					value: '1',
					text: '缠绕膜',
					checked: false,
				},
				{
					id: 2,
					value: '2',
					text: '绷带',
					checked: false,
				},
				{
					id: 3,
					value: '3',
					text: '包角',
					checked: false,
				},
				{
					id: 4,
					value: '4',
					text: '网罩',
					checked: false,
				},
			]
		};
	}

	config = {
		navigationBarTitleText: '买耗材'
	};

	submit = () => {
		const {list, widthValue, heightValue} = this.state;
		const buyData = {list: list, widthValue: widthValue, heightValue: heightValue}
		Taro.navigateTo({ url: `/buy/pages/buy-manpower-information/index?buyData=${JSON.stringify(buyData)}` })
	}


	handleWidthValueChange = (value) => {
		this.setState({
			widthValue: value
		});
	};

	handleHeightValueChange = (value) => {
		this.setState({
			heightValue: value
		})
	}

	handleClickCatogory = (category) => {
		const { list } = this.state;
		const newList = list.slice();
		if(category == '1') {
			 this.setState({
				 isView: !this.state.isView
			 })
		}
		newList.forEach((item) => {
			if (item.id === category) {
				item.checked = !item.checked;
				this.setState({
					list: newList,
				});
			} else {
				item.checked = false;
				this.setState({
					list: newList,
				});
			}
		});
	};

	render() {
		const { isView } = this.state;
		return (
			<View className='buy-material'>
				<View className='wrapper'>
					<AtForm
						onSubmit={this.onSubmit}
						onReset={this.onReset}
						className='form'
					>
						<View className='category'>
							<View className='at-article__h3'>耗材种类</View>
							<View className='tag-wrapper'>
								{
									this.state.list.map((item) => {
										return (
											<AtTag
												key={item.value}
												className={classnames('tag', item.checked && 'tag-active')}
												active={item.checked}
												type='primary'
												onClick={() => this.handleClickCatogory(item.id)}
											>
												{item.text}
											</AtTag>
										);
									})
								}
							</View>
						</View>

						{isView && (
							<View>
								<View className='setting-spec'>
									<Text>宽/M</Text>
									<AtInputNumber
										className='at-input-number'
										min={1}
										max={1000}
										step={1}
										value={this.state.widthValue}
										onChange={this.handleWidthValueChange}
									/>
								</View>

								<View className='setting-spec'>
									<Text>长/M</Text>
									<AtInputNumber
										className='at-input-number'
										min={1}
										max={1000}
										step={1}
										value={this.state.heightValue}
										onChange={this.handleHeightValueChange}
									/>
								</View>
							</View>
						)}


						<AtButton className='release' formType='submit' onClick={this.submit}>查询</AtButton>
					</AtForm>
				</View>
			</View>
		);
	}
}

export default BuyMaterial;
