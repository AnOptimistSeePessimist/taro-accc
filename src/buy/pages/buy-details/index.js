import Taro, { Component } from '@tarojs/taro'
import { View, Text, Swiper, SwiperItem, ScrollView, Button, Picker } from '@tarojs/components'
import {connect} from '@tarojs/redux'
import Gallery from './gallery'
import InfoBase from './infoBase'
import InfoParam from './infoParam'
import Footer from './footer'
import classnames from 'classnames'
import { getWindowHeight } from '@utils/style'
import { API_ORDER_CREATE, API_CALLBACK_WX } from '@constants/api';
import {formatTimeStampToTime} from '@utils/common';
import {
  AtFloatLayout,
  AtTag, 
  AtInputNumber, 
  AtButton, 
  AtList,
  AtListItem,
  AtToast,
  AtModal,
  AtModalContent,
	AtModalAction,
} from 'taro-ui'
import fetch from '@utils/request';

import './index.scss'

function datePoor (dateStart, dateEnd) {
  const start = new Date(dateStart); 
  const end = new Date(dateEnd); 
  const days = end.getTime() - start.getTime(); 
  const day = parseInt(days / (1000 * 60 * 60 * 24));
  return (day + 1)
}

@connect(state => ({
  userInfo: state.user.userInfo,
}))
export default class BuyDetails extends Component {
  constructor(props) {
    super(props);
    const eventChannel = this.$scope
    console.log(eventChannel)
    this.state = {
      value: '1',
      isOpeneds: false,
      isAtModal: false, 
      isAtToast: false,
      loaded: false,
      selected: {},
      dataImg: {},
      dataList: '',
      textTitle: '请选择:规格',
      dollar: '',
      safety: '',
      duration: 0,
      //endTime: [['a', 'b'], [['c','d','e'], ['s','r','t']]],
      timeStart: '',
      timeEnd: '',
      AtToastText:'',
      AtToastLoading:'',
      orderNo: '',
      dateStart: '',
      dateEnd: '',
      timeNum: 1, 
      address: {
				userName: '张三',
				phone: '12345678911',
				userAddress: '上海市浦东国际机场厂区7号仓库'
			},
      list: [
        {
          id: 1,
          value: '1',
          timeStart: '08:00:00',
          timeEnd: '16:00:00',
          checked: false,
          time: 8,
        },
        {
          id: 2,
          value: '2',
          timeStart: '08:00:00',
          timeEnd: '12:00:00',
          checked: false,
          time: 4,
        },
        {
          id: 3,
          value: '3',
          timeStart: '12:00:00',
          timeEnd: '16:00:00',
          checked: false,
          time: 4,
        },
      ]
    }

  }

  config = {
    navigationBarTitleText: '商品详情'
  }

  componentDidMount() {
    this.getSystemInfoSync()
  }

  componentWillPreload (params) {
    return this.fetchData(params.item)
  }

  fetchData (item) {
    console.log('《《《《',JSON.parse(item))
    const data = JSON.parse(item)
    this.setState({
      dataImg: data,
      dollar: data.price * 4 + '-' +data.price * 8,
      dateStart: data.dateStart,
      dateEnd: data.dateEnd
    })
  }

  toggleVisible = () => {
    this.setState({
      visible: !this.state.visible,
      selected: {}
    })
  }

  handleSelect = (selected) => {
    this.setState({ selected })
  }

  handleOpened = () => {
    this.setState({
      isOpeneds: !this.state.isOpeneds
    })
  }

  handleClose = () => {
    this.setState({
      isOpeneds: false
    })
  }

  // handleAdd = () => {
  //   // 添加购物车是先从 skuSpecValueList 中选择规格，再去 skuMap 中找 skuId，多个规格时用 ; 组合
  //   const { itemInfo } = this.props
  //   const { skuSpecList = [] } = itemInfo
  //   const { visible, selected } = this.state
  //   const isSelected = visible && !!selected.id && itemInfo.skuMap[selected.id]
  //   const isSingleSpec = skuSpecList.every(spec => spec.skuSpecValueList.length === 1)

  //   if (isSelected || isSingleSpec) {
  //     const selectedItem = isSelected ? selected : {
  //       id: skuSpecList.map(spec => spec.skuSpecValueList[0].id).join(';'),
  //       cnt: 1
  //     }
  //     const skuItem = itemInfo.skuMap[selectedItem.id] || {}
  //     const payload = {
  //       skuId: skuItem.id,
  //       cnt: selectedItem.cnt
  //     }
  //     this.props.dispatchAdd(payload).then(() => {
  //       Taro.showToast({
  //         title: '加入购物车成功',
  //         icon: 'none'
  //       })
  //     })
  //     if (isSelected) {
  //       this.toggleVisible()
  //     }
  //     return
  //   }

  //   if (!visible) {
  //     this.setState({ visible: true })
  //   } else {
  //     // XXX 加购物车逻辑不一定准确
  //     Taro.showToast({
  //       title: '请选择规格（或换个商品测试）',
  //       icon: 'none'
  //     })
  //   }
  // }

  handleBuy = () => {
    const token =  this.props.userInfo.userToken && this.props.userInfo.userToken.accessToken
    const {dataImg:{ price, publishBy, publishRecid}, value, AtToastLoading, AtToastText, timeStart, timeEnd, dollar, dateEnd, dateStart} = this.state
    // Taro.showToast({
    //   title: '暂时只支持加入购物车',
    //   icon: 'none'
    // })
    // const { dataImg } = this.state;
    // console.log('传入数据', dataImg)
    // Taro.navigateTo({ url: `/buy/pages/buy-confirm/index?data=${JSON.stringify(dataImg)}&value=${this.state.value}&dollar=${this.state.dollar}&textTitle=${this.state.textTitle}` })
    
    if(!token){
      Taro.navigateTo({url: '/user/pages/user-login/index'})
      return
    }

    if(!timeStart){
      this.setState({
        isAtToast: true,
        AtToastText: '请选择规格',
        AtToastLoading: '',
        duration: 2000
      })
      return
    }

    this.setState({
      isAtToast: true,
      AtToastLoading: 'loading',
      AtToastText: '',
      duration: 0
    })
   
    const payload = {
      address: " 张三12345678911上海市浦东国际机场厂区7号仓库",
      discountSum: 0,
      orderDetailDto: {
        count: value,
        dateEnd: dateEnd,
        dateStart: dateStart,
        price: price,
        publishRecid: publishRecid,
        timeEnd: timeEnd,
        timeStart:timeStart
      },
    }
   console.log('订单数据', payload)
    fetch({
      url: API_ORDER_CREATE,
      payload,
      method: 'POST',
      accessToken: token
    })
    .then((res) => {
      console.log('菜单基本信息: ', res);
      const {data: {status, data, message}} = res
      if(status === 200 ){
        this.setState({
          duration: 1000,
          orderNo: data
        })
        setTimeout(() => {
          this.closeModal()
        },1500)
      } else {
        this.setState({
          isAtToast: true,
          AtToastText: message,
          AtToastLoading: '',
          duration: 2000
        })
      }
    })
  }

  handleClickCatogory = (category) => {
    const {dataImg, list, value, dateEnd,dateStart} = this.state;
    const day = datePoor(dateStart, dateEnd)
    console.log('时间差', day)
    const newList = list.slice();
    newList.forEach((item) => {
      if (item.id === category) {
        item.checked = !item.checked;
        if(item.checked){
          this.setState({
            textTitle: `已选：${item.timeStart}-${item.timeEnd}(共计${item.time}小时)`,
            dollar: dataImg.price * item.time * value * day,
            timeNum: item.time,
            timeStart: item.timeStart,
            timeEnd: item.timeEnd
          })
        } else {
          this.setState({
            textTitle: '请选择:规格',
            dollar: dataImg.price * 4 + '-' + dataImg.price * 8,
            timeStart: '',
            timeEnd: '',
          })
        }
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

  handleValueChange = (value) => {
    const {dataImg, dateEnd, dateStart, timeNum, textTitle} = this.state
    const day = datePoor(dateStart, dateEnd)
    if(textTitle === '请选择:规格'){
      this.setState({ 
        value,
        dollar: dataImg.price * 4 + '-' + dataImg.price * 8,
      });
      return
    }
    this.setState({ 
      value,
      dollar: dataImg.price * timeNum * value * day
    });
  };

  getSystemInfoSync = () => {
    const res = Taro.getSystemInfoSync()
    const safety = res.screenHeight - res.safeArea.bottom
    this.setState({
      safety
    })
  }

  handleToastClose = () => {
    this.setState({
      isAtToast: false,
      
    })
  }

  onDateStartChange = e => {
    const {dataImg, dateEnd, timeNum, textTitle, value} = this.state
    const day = datePoor(e.detail.value, dateEnd)

    if(day <=0 ) {
        this.setState({
          isAtToast: true,
          AtToastText: '起始时间不能超过结束时间',
          AtToastLoading: '',
          duration: 2000
        })
        return
    }

    if(textTitle === '请选择:规格'){
      this.setState({ 
        dateStart: e.detail.value,
        dollar: dataImg.price * 4 + '-' + dataImg.price * 8,
      });
      return
    }

    this.setState({
      dateStart: e.detail.value,
      dollar: dataImg.price * timeNum * value * day
    });
  };

  onDateEndChange = e => {
    const {dataImg, dateStart, timeNum, textTitle, value} = this.state
    const day = datePoor(dateStart, e.detail.value)
    
    if(day <= 0) {
      this.setState({
        isAtToast: true,
        AtToastText: '结束时间不能小于起始时间',
        AtToastLoading: '',
        duration: 2000
      })
      return
    }

    if(textTitle === '请选择:规格'){
      this.setState({ 
        dateEnd: e.detail.value,
        dollar: dataImg.price * 4 + '-' + dataImg.price * 8,
      });
      return
    }

    this.setState({
      dateEnd: e.detail.value,
      dollar: dataImg.price * timeNum * value * day
    });
  };

  closeModal = () => {
		this.setState({
			isAtModal: !this.state.isAtModal
    })
  }
  
  wxPay = () => {
    const token =  this.props.userInfo.userToken && this.props.userInfo.userToken.accessToken
		this.setState({
			isAtModal: !this.state.isAtModal
    })
    fetch({
      url: API_CALLBACK_WX + `?orderNo=${this.state.orderNo}`,
      method: 'POST',
      accessToken: token
    })
    .then((res) => {
      console.log(res)
      const {data: {status, message}} = res
      if(status === 200) {
        this.setState({
          isAtToast: true,
          AtToastText: '支付成功',
          AtToastLoading: 'success',
          duration: 1500
        })
        setTimeout(() => {
          Taro.navigateTo({url: '/buy/pages/buy-pay-success/index'})
        }, 2000)
      } else {
        this.setState({
          isAtToast: true,
          AtToastText: message,
          AtToastLoading: '',
          duration: 1500
        })
      }
    })
  }


  render() {
    const height = getWindowHeight(false)
    const { dataImg, isOpeneds, textTitle, dollar, safety, dateEnd, dateStart, address: { userName, phone, userAddress } } = this.state
    console.log(dataImg)
    console.log('屏幕高度', height)
    return (
      <View className='buy-details'>
        <ScrollView
          scrollY
          className='item-warp'
          style={{ height, paddingBottom: `${safety+40}px` }}
        >
          <Gallery list={dataImg.listImg} />
          <InfoBase data={dataImg}/>
          <InfoParam />
        </ScrollView>
        {/* <Float isOpened={isOpeneds}  onHandleClose={this.handleClose} data={dataImg}/> */}
        <AtFloatLayout
          isOpened={isOpeneds}
          scrollY
          onClose={this.handleClose}
        >
          <ScrollView className='float-item'>
            <View className='float-item-title'>
              <View className='float-item-title-img'>
                <Image
                  className='img'
                  src={dataImg.imgSrc}
                />
              </View>
              <View className='float-item-title-text'>
                <Text className='dollar'>￥{dollar}</Text>
                <Text>{textTitle}</Text>
              </View>
            </View>

            <View className='category'>
              <View className='at-article__h3'>规格</View>
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
                        {item.timeStart}-{item.timeEnd}(共计{item.time}小时)
                      </AtTag>
                    );
                  })
                }
              </View>
            </View>

            <Picker
              className='date'
              mode='date'
              onChange={this.onDateStartChange}
              //start={formatTimeStampToTime(Date.now())}
            >
              <AtList className='date-at-list'>
                <AtListItem className='item' title='起始日期' extraText={dateStart} />
              </AtList>
            </Picker>

            <Picker
              className='date'
              mode='date'
              onChange={this.onDateEndChange}
              //start={formatTimeStampToTime(Date.now())}
            >
              <AtList className='date-at-list'>
                <AtListItem className='item' title='结束日期' extraText={dateEnd} />
              </AtList>
            </Picker>

            <View className='setting-spec'>
              <Text>工人人数</Text>
              <AtInputNumber
                className='at-input-number'
                min={1}
                max={dataImg.rsNum}
                step={1}
                value={this.state.value}
                onChange={this.handleValueChange}
              />
            </View>

            {/* <Picker value={0} range={this.state.endTime} className='out-of-work-time' mode='multiSelector' >
              <AtList className='end-list'>
                <AtListItem className='end' title='结束工作时间' extraText={this.state.endTime} />
              </AtList>
            </Picker> */}
          <View className='pay-address'>
            <View className={`iconfont iconionc-- addressimg`} />
            <View className='pay-address-userName-phone-address'>
              <View className='pay-address-userName-phone'>
                <Text>{userName}</Text>
                <Text className='pay-address-phone'>{phone}</Text>
                <Text className='pay-address-address'>{userAddress}</Text>
              </View>
            </View>
          </View>
          </ScrollView>
          <Button className='release' formType='submit' onClick={this.handleBuy}>付款</Button>
        </AtFloatLayout>
        <View className='item-footer' style={{paddingBottom: `${safety}px`}}>
          <Footer onAdd={this.handleAdd} onIsOpened={this.handleOpened}/>
        </View>

        <AtToast
          // icon={this.state.icon}
          text={this.state.AtToastText}
          // image={this.state.image}
          status={this.state.AtToastLoading}
          // hasMask={this.state.hasMask}
          isOpened={this.state.isAtToast}
          duration={this.state.duration}
          onClose={this.handleToastClose}
        />

        <AtModal
          isOpened={this.state.isAtModal}
          onClose={this.closeModal}
        >
          <AtModalContent>
              <View className='wx-pay'>
                <View className='store'>
                  <Text className='store-name'>{dataImg.station}</Text>
                  <Text className='store-dollar'>￥{this.state.dollar}</Text>
                </View>
              </View>
          </AtModalContent>
          <AtModalAction>
						<Button onClick={this.wxPay}>
							确认支付
            </Button>
					</AtModalAction>
        </AtModal>
      </View>
    )
  }

}
