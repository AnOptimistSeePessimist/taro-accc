import Taro, { Component } from '@tarojs/taro'
import { View, Text,Button } from '@tarojs/components'
import {connect} from '@tarojs/redux'
import { 
	AtTimeline,
	AtModal,
  AtModalContent,
	AtModalAction,  
} from 'taro-ui'
import {API_CALLBACK_WX, API_ORDER_ONELIST, API_WORK_ORDER_LIST} from '@constants/api';
import WQRCode from '@utils/wqrCode/index'
import fetch from '@utils/request';

import './index.scss'

@connect(state => ({
  userInfo: state.user.userInfo,
}), {})
export default class UserDetails extends Component {
	config = {
		navigationBarTitleText: '订单详情'
	}
	
	constructor(props){
		super(props)
		this.state = {
			orderInformation: {}, //运单信息
			atTimeline: [ //操作步骤
				{id: 3, title: '订单未派工',  status: 3}, 
				{id: 2, title: '订单未支付',  status: 2}, 
				{id: 1, title: '订单未创建',  status: 1}, 
			],
			atTimeline2: [
				{id: 6, title: '订单未完成',  status: 6}
			],
			isAtModal: false,  //是否展示Modal模块
			isWqrCode: false,  //是否展示二维码
			bottonTitle: '',  //按钮内容
			isBotton: false,  //是否展示按钮
			signInWorkOver: false, //是否签到收工按钮
			workStatus: [],
			checkInOrOut: '', //签到码或收工码
		}
		
	}

	// componentDidMount() {
		
	// }

	componentWillPreload (params) {
    return this.fetchData(params.oneOrder)
  }

  fetchData (item) {
		const data = JSON.parse(item);
    this.setState({
			orderInformation: data
		}, () => {
			this.statusUpload(data.orderstatusDtoList)
			this.orderWorkInformation()
		})
	}
	
	statusUpload = (orderstatusDtoList) => {
		const {atTimeline} = this.state
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
		 let bottonTitle
		 let isBotton
		 let signInbtnTitle
		 let workOverBtnTitle
		 let signInWorkOver
		switch (orderstatusDtoList[0].status) {
			case 1:
				 bottonTitle ='支付'
				 isBotton = true
				 signInWorkOver = false
				break;
				case 2:
				 bottonTitle = '未派工'
				 isBotton = true
				 signInWorkOver = false
				break;
				case 3:
				 isBotton = false
				 signInWorkOver = true
				break;
				case 4:
				 isBotton = false
				 signInWorkOver = true
				break;
				case 5:
				 bottonTitle ='完成'
				 isBotton = true
				 signInWorkOver = true
				break;
				case 6:
				 bottonTitle= '完成'
				 isBotton = true
				 signInWorkOver = true
				break;
			default:
				break;
		}
		this.setState({
			atTimeline,
			bottonTitle,
			isBotton,
			signInbtnTitle,
			workOverBtnTitle,
			signInWorkOver,
		})
	}

	closeModal = () => {
		this.setState({
			isAtModal: !this.state.isAtModal
    })
	}

	closeWqrModal = () => {
		this.setState({
			isWqrCode: !this.state.isWqrCode
		})
		clearTimeout(this._signInTime)
		clearTimeout(this._workOverTime)
	}
	
	orderWorkInformation = () => {
		const token =  this.props.userInfo.userToken && this.props.userInfo.userToken.accessToken
		const {orderInformation:{orderRecid}} = this.state
		fetch({
			url: API_WORK_ORDER_LIST + `?orderRecid=${orderRecid}`,
			accessToken: token
		})
		.then((res) => {
			console.log('工单工人信息', res)
			const {data:{status, message, data}} = res
			if(status === 200 ){
					this.setState({
						workStatus: data.list
					})
			} else {
				Taro.showToast({
					icon: 'none',
					title: message,
					duration: 2000
				})
			}

		})
	}

	orderStatusUpload = (orderRecid) => {
		const token =  this.props.userInfo.userToken && this.props.userInfo.userToken.accessToken
		fetch({
			url: API_ORDER_ONELIST +'/'+ orderRecid,
			accessToken: token
		})
		.then((res) => {
			const {data:{data, status, message}} = res
			if(status === 200 ) {
				Taro.hideLoading()
				this.setState({
					isWqrCode: false
				}, () => {
					this.statusUpload(data)
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
	
	//派工
	dispatching = () => {
		console.log('提示派工')
	}

	//签到
	signIn = (checkInCode, orderRecid) => {
		console.log('签到', checkInCode)
		this.setState({
			isWqrCode: !this.state.isWqrCode,
			checkInOrOut: checkInCode,
		}, () => {
		 this._signInTime = setTimeout(() => {
				this.orderStatusUpload(orderRecid)
				this.orderWorkInformation()
			}, 5000)
		})
	}

	//收工
	workOver = (checkOutTime, orderRecid) => {
		console.log('收工', checkOutTime)
		this.setState({
			isWqrCode: !this.state.isWqrCode,
			checkInOrOut: checkOutTime
		}, () => {
		 this._workOverTime =	setTimeout(() => {
				this.orderStatusUpload(orderRecid)
				this.orderWorkInformation()
			}, 5000)
		})
		
	}

	//完成
	workSuccess = () => {
		console.log('完成')
	}

	render(){
		const {
			orderInformation, 
			orderInformation:{orderstatusDtoList, orderNo, orderRecid, createTime, paidSum, orderDetailDto, publishByCompanyName}, atTimeline, 
			bottonTitle, 
			atTimeline2, 
			workStatus,
			signInWorkOver,
		} = this.state
		
		console.log('订单详情', orderInformation, workStatus, signInWorkOver)
		return(
			<View className='oneOrder'>
				<View className='oneOrder-orderNum text'>订单编号： {orderNo}</View>
				<View className='oneOrder-time text'>订单时间： {createTime}</View>
				<View className='oneOrder-price text'>订单价钱： {paidSum}</View>
				<View className='oneOrder-title text'>订单内容： 工种类型-{orderDetailDto.workTypeName}</View>
				<View className='oneOrder-status text'>
					<View className='oneOrder-status-item'>订单状态:</View>
					{this.state.isBotton && 
						<Button plain={true} className='release submit' formType='submit' onClick={() => {
								switch (orderstatusDtoList[0].status) {
										case 2:
											this.dispatching()
										break;
										case 5:
											this.workSuccess()
										break;
									default:
										break;
								}
						}}>{bottonTitle}</Button>}
				</View>
				<View className='at-time-title'>
					{this.state.signInWorkOver && <AtTimeline
								className='at-time-line'
								pending
								items={atTimeline2}
								color={'#fe871f'}
							></AtTimeline>}
						
						{this.state.signInWorkOver && 		
							workStatus.map((item) => {
								// console.log(item)
								return (
									<View className='work-success' key={item.workRecid}>
										<View className='iconfont iconionc-- addressimg'></View>
										<Text className='work-text'>{item.staffName} {item.workDate}</Text> 
										<View className='work-over'>
											<Button 
											className='release btn' 
											style={{opacity: item.checkInTime? '0.6': '1'}} 
											onClick={() => {item.checkInTime?console.log('执行签到'):this.signIn(item.checkInCode,orderRecid)}}
											>
												{item.checkInTime? '已签到': '未签到'}
											</Button>
											<Button 
											className='release btn'
											style={{opacity: item.checkOutTime?'0.6': '1'}} 
											onClick={() => {item.checkOutTime?console.log('执行收工') : this.workOver(item.checkOutCode, orderRecid)}}
											>
												{item.checkOutTime?'已收工': '未收工'}
											</Button>
											
											
										</View>
									</View>
								)
							})
						}
						<AtTimeline
							className='at-time-line'
							pending
							items={atTimeline}
							color={'#fe871f'}
						></AtTimeline>
				</View>	


				
					<AtModal
          isOpened={this.state.isWqrCode}
					onClose={this.closeWqrModal}
					>
						<AtModalContent>
								<View className='WqrCode'>
									<Text className='WqrCode-title'>请扫描二维码</Text>
									 {/* {this.state.isWqrCode && <WQRCode cid="qrcode2302" ref='qrcode2302' text={orderNo +'/'+ orderRecid+'/' + Math.ceil(Math.random() * 100)} />} */}
									 { this.state.isWqrCode && 
									 <WQRCode 
										makeOnLoad 
										cid="qrcode2302" 
										text={this.state.checkInOrOut} 
									 />
									 }
								</View>
						</AtModalContent>
					</AtModal>
				

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
