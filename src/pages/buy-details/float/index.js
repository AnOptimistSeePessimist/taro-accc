import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import { AtFloatLayout, AtTag } from 'taro-ui'
import classnames from 'classnames';

import './index.scss'

export default class Float extends Component {
	static defaultProps = {
		data: {},
		isOpened: Boolean,
		onHandleClose: () => { }
	}

	constructor(props){
		super(props);
		this.state = {
			list: [
        {
          id: 1,
          value: '1',
          text: '08:00-16:00 (共计8小时)',
          checked: false,
        },
        {
          id: 2,
          value: '2',
          text: '08:00 - 12:00 (共计4小时) ',
          checked: false,
        },
        {
          id: 3,
          value: '3',
          text: '12:00 - 16:00 (共计4小时)',
          checked: false,
        },
      ]
		}
		
	}

	handleClose = () => {
		this.props.onHandleClose()
	}

	handleBuy = () => {
		// Taro.showToast({
		//   title: '暂时只支持加入购物车',
		//   icon: 'none'
		// })
		const { data } = this.props;
		console.log('传入数据', data)
		Taro.navigateTo({ url: `/pages/buy-confirm/index?data=${JSON.stringify(data)}` })

	}

	handleClickCatogory = (category) => {
    const {list} = this.state;
    const newList = list.slice();
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
		const { isOpened, data } = this.props
		console.log('标志', isOpened, data)
		return (
			<AtFloatLayout
				isOpened={isOpened}
				scrollY
				onClose={this.handleClose}

			>
				<View className='float-item'>
					<View className='float-item-title'>
						<View className='float-item-title-img'>
							<Image
								className='img'
								src={data.imgSrc}
							/>
						</View>
						<View className='float-item-title-text'>
							<Text>￥{data.dollar * 4} - {data.dollar * 8}</Text>
							<Text>选择 规格</Text>
						</View>
					</View>

					<View className='category'>
              <View className='at-article__h3'>工种</View>
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

					<Button onClick={this.handleBuy}>确定</Button>
				</View>
			</AtFloatLayout>
		)
	}

}
