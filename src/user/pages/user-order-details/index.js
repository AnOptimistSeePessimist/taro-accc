import Taro, { Component } from '@tarojs/taro'
import { View, Text,Button } from '@tarojs/components'
import {connect} from '@tarojs/redux'
import { 
	AtTimeline,
	AtModal,
  AtModalContent,
	AtModalAction,  
} from 'taro-ui'
import {API_CALLBACK_WX, API_ORDER_ONELIST} from '@constants/api';
import fetch from '@utils/request';

import './index.scss'

@connect(state => ({
  userInfo: state.user.userInfo,
}))
export default class UserDetails extends Component {
	config = {
		navigationBarTitleText: '订单详情'
	}
	
	constructor(props){
		super(props)
		this.state = {
			orderInformation: {},
			atTimeline: [],
			isAtModal: false, 
			isBotton: false,
		}
		
	}

	componentWillPreload (params) {
    return this.fetchData(params.oneOrder)
  }

  fetchData (item) {
		const data = JSON.parse(item);
		let atTimeline = []
		console.log('订单',data)
    this.setState({
			orderInformation: data
		}, () => {
			data.orderstatusDtoList.map((item, index) => {
				atTimeline[index] = {
					title: item.statusdsc,
					icon: 'iconfont iconionc-- addressimg'
				}
			})
			if(data.orderstatusDtoList.length === 1) {
					this.setState({
						isBotton: true
					})
			}
			this.setState({
				atTimeline
			})
		})
  }

	closeModal = () => {
		this.setState({
			isAtModal: !this.state.isAtModal
    })
	}
	
	orderStatusUpload = (orderRecid) => {
		const token =  this.props.userInfo.userToken && this.props.userInfo.userToken.accessToken
		fetch({
			url: API_ORDER_ONELIST +'/'+ orderRecid,
			accessToken: token
		})
		.then((res) => {
			console.log(res)
			const {data:{data, status, message}} = res
			let atTimeline = []
			if(status === 200 ) {
				Taro.hideLoading()
				data.map((item, index) => {
					atTimeline[index] = {
						title: item.statusdsc,
						icon: 'iconfont iconionc-- addressimg'
					}
				})
				this.setState({
					atTimeline,
					isBotton: false
				})
			}else {
				Taro.showToast({
          icon: "none",
          title: message,
          duration: 2000
        })
			}
			
		})
	}



	wxPay = (orderNo, orderRecid) => {
		const token =  this.props.userInfo.userToken && this.props.userInfo.userToken.accessToken
		console.log('订单号-订单id',orderNo, orderRecid)
		this.setState({
			isAtModal: !this.state.isAtModal
    })
    fetch({
      url: API_CALLBACK_WX + `?orderNo=${orderNo}`,
      method: 'POST',
      accessToken: token
    })
    .then((res) => {
      console.log(res)
      const {data: {status, message}} = res
      if(status === 200) {
				Taro.showLoading({
					title: '加载中',
				})
        this.orderStatusUpload(orderRecid)
  
      } else {
        Taro.showToast({
          icon: "none",
          title: message,
          duration: 2000
        })
      }
    })
	}
	handleBuy = () => {
		this.setState({
			isAtModal: !this.state.isAtModal
		})
	}

	render(){
		const {orderInformation, orderInformation:{orderNo, orderRecid, createTime, paidSum, orderDetailDto, publishByCompanyName}, atTimeline, isBotton} = this.state
		
		console.log('订单详情', orderInformation)
		return(
			<View className='oneOrder'>
				<View className='oneOrder-orderNum text'>订单编号： {orderNo}</View>
				<View className='oneOrder-time text'>订单时间： {createTime}</View>
				<View className='oneOrder-price text'>订单价钱： {paidSum}</View>
		<View className='oneOrder-title text'>订单内容： 工种类型-{orderDetailDto.workTypeName}</View>
				<View className='oneOrder-status text'>
						<View className='oneOrder-status-item'>订单状态:</View>
						<AtTimeline
							className='at-time-line'
							pending
							items={atTimeline}
							color={'#fe871f'}
						></AtTimeline>
						<Button plain={true} className='release' formType='submit' onClick={this.handleBuy}>付款</Button>
				</View>


				<AtModal
          isOpened={this.state.isAtModal}
          onClose={this.closeModal}
        >
          <AtModalContent>
              <View className='wx-pay'>
                <View className='store'>
                  <Text className='store-name'>{publishByCompanyName}</Text>
                  <Text className='store-dollar'>￥{paidSum}</Text>
                </View>
              </View>
          </AtModalContent>
          <AtModalAction>
						<Button onClick={() => {this.wxPay(orderNo, orderRecid)}}>
							确认支付
            </Button>
					</AtModalAction>
        </AtModal>
			</View>
		)
	}
}
