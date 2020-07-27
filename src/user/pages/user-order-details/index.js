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
			atTimeline: [
				{title: '订单未完成',  status: 6},
				{title: '订单未收工',  status: 5}, 
				{title: '订单未签到',  status: 4}, 
				{title: '订单未派工',  status: 3}, 
				{title: '订单未支付',  status: 2}, 
				{title: '订单未创建',  status: 1}, 
			],
			isAtModal: false, 
			bottonTitle: '',
		}
		
	}

	componentWillPreload (params) {
    return this.fetchData(params.oneOrder)
  }

  fetchData (item) {
		const data = JSON.parse(item);
    this.setState({
			orderInformation: data
		}, () => {
			this.statusUpload(data.orderstatusDtoList)
		})
	}
	
	statusUpload = (orderstatusDtoList) => {
		const {atTimeline, bottonTitle} = this.state
		console.log('订单', orderstatusDtoList)
		orderstatusDtoList.map((item) => {
			console.log(item.status)
			atTimeline.map((atTimeItem) => {
				if(atTimeItem.status === item.status){
					atTimeItem.title = item.statusdsc
					atTimeItem.content = [`${item.createTime}`]
					atTimeItem.icon = 'iconfont iconionc-- addressimg'
				}
			})
		})
		switch (orderstatusDtoList[0].status) {
			case 1:
				 this.setState({bottonTitle: '支付'})
				break;
				case 2:
				 this.setState({bottonTitle: '未派工'})
				break;
				case 3:
				 this.setState({bottonTitle: '签到'})
				break;
				case 4:
				 this.setState({bottonTitle: '收工'})
				break;
				case 5:
				 this.setState({bottonTitle: '完成'})
				break;
				case 6:
				 this.setState({bottonTitle: '完成'})
				break;
			default:
				break;
		}
		this.setState({
			atTimeline
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
			if(status === 200 ) {
				Taro.hideLoading()
				this.statusUpload(data)
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
		const {orderInformation, orderInformation:{orderNo, orderRecid, createTime, paidSum, orderDetailDto, publishByCompanyName}, atTimeline, bottonTitle} = this.state
		
		console.log('订单详情', orderInformation, bottonTitle)
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
						<Button plain={true} className='release' formType='submit' onClick={this.handleBuy}>{bottonTitle}</Button>
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
						<Button className='btn-wx' onClick={() => {this.wxPay(orderNo, orderRecid)}}>
							确认支付
            </Button>
					</AtModalAction>
        </AtModal>
			</View>
		)
	}
}
