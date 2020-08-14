import Taro, { Component } from '@tarojs/taro'
import { 
  View,
  Text, 
  Swiper, 
  SwiperItem, 
  ScrollView, 
  Button, 
  Picker, 
  CheckboxGroup,
  Checkbox,
} from '@tarojs/components'
import {connect} from '@tarojs/redux'
import Gallery from './gallery'
import InfoBase from './infoBase'
import InfoParam from './infoParam'
import Footer from './footer'
import classnames from 'classnames'
import { getWindowHeight } from '@utils/style'
import { API_ORDER_CREATE, API_CALLBACK_WX, API_CARGOSTATION_LIST } from '@constants/api';
import cloneDeep from 'lodash.clonedeep';
import {
  AtFloatLayout,
  AtTag,
  AtInputNumber,
  AtList,
  AtListItem,
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
    this.state = {
      value: '1', //人数
      isOpeneds: false, //显示选择规格
      isAtModal: false, //支付弹框
      isDataStart: false, //是否显示日期选择
      dataImg: {}, //基础数据
      textTitle: '请选择:规格', //规格头部
      dollar: '', //金额
      timeStart: '', //开始时间
      timeEnd: '', //结束时间
      orderNo: '', //订单编号
      timeNum: 1, //买家选择的时长
      dataTitle: '请选择日期', //日期说明
      workDateList: [], //缓存的日期
      workDateTitle: [], //买家选择的日期
      address: '', //货站
      areaCode: '', //货站区域
      isOpenedPassarea: false,// 是否显示通行证选择列表
      passareaList: [], // 通行证适用区域列表
      displayCheckedPassareaList: {}, // 显示在界面上的通行证适用区域
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

  componentWillMount () {
    console.log('执行componentWillMount', this.$preloadData)
    this.fetchData(this.$router.params.item, this.$router.params.hresCargostationMap)
  }

  componentWillPreload (params) {
    console.log('执行componentWillPreload')
    return this.fetchData(params.item, params.hresCargostationMap)
  }

  fetchData (item, hresCargostationMap) {
    console.log('《《《《',JSON.parse(item), JSON.parse(hresCargostationMap))
    const data = JSON.parse(item)
    const hresCargostationList = JSON.parse(hresCargostationMap)
    let workDateList = []
    data.workdateList.map((item, index) => {
      workDateList.push({id: index, name: item, active: false})
    })
    let newPassareaList
     hresCargostationList.map(item => {
      console.log('hresCargostation',item)
      newPassareaList = item.map(station => {
        const {passareaDtoList: areas} = station;
        const newAreas = areas.map(area => {
          area.checked = false;
          return area;
        });
        station.passareaDtoList = newAreas;
        return station;
      })
    });
    console.log('newPassareaList: ', newPassareaList);
    this.setState({
      dataImg: data,
      dollar: data.price * 4 + '-' +data.price * 8,
      workDateList,
      passareaList: newPassareaList,
    })
  }

  // station = () => {
  //   const token = this.props.userInfo.userToken && this.props.userInfo.userToken.accessToken
  //   let address = [[], []]
  //   let areaCode = []
  //   fetch({
  //     url: API_CARGOSTATION_LIST,
  //     accessToken: token
  //   }).then((res) => {
  //     const {data, statusCode} = res
  //     if(statusCode === 200){
  //       data.map((item) => {
  //         address[0].push(item.stationdsc)
  //         item.passareaDtoList.map((items) => {
  //           areaCode.push(items.areaCode)
  //           address[1] = [...new Set(areaCode)].sort()
  //         })
  //       })
  //       console.log('所有货站',address)
  //       this.setState({
  //         address
  //       })
  //     }
  //   })
  // }

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

  handleClosePassarea = () => {
    this.setState({
      isOpenedPassarea: false,
    })
  };

  handleBuy = () => {
    const token =  this.props.userInfo.userToken && this.props.userInfo.userToken.accessToken
    const {dataImg:{ price, publishRecid}, value, timeStart, timeEnd, workDateTitle} = this.state
    let address = ''
    let areaCode = ''
    

    if(!token){
      Taro.navigateTo({url: '/user/pages/user-login/index'})
      return
    }

    if(!timeStart){
      Taro.showToast({
        icon: "none",
        title: '请选择规格',
        duration: 2000
      })
      return
    }

    if(Object.keys(this.state.displayCheckedPassareaList).length === 0){
      Taro.showToast({
        icon: "none",
        title: '请选择地址',
        duration: 2000
      })
      return
    }
    Object.keys(this.state.displayCheckedPassareaList).map(passarea => {
      address = passarea;   
      areaCode = this.state.displayCheckedPassareaList[passarea].sort().join()
    })

    if(workDateTitle.length === 0 ){
      Taro.showToast({
        icon: "none",
        title: '请选择时间',
        duration: 2000
      })
      return
    }

    Taro.showLoading({
      title: '加载中',
    })

   

    const payload = {
      stationCode: address,
      address: areaCode,
      discountSum: 0,
      orderDetailDto: {
        count: value,
        price: price,
        publishRecid: publishRecid,
        timeEnd: timeEnd,
        timeStart:timeStart
      },
      workdateList: workDateTitle
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
        Taro.hideLoading()
        this.setState({
          orderNo: data
        })
        this.closeModal()
      } else {
        Taro.showToast({
          icon: "none",
          title: message,
          duration: 2000
        })
      }
    })
  }

  handleClickCatogory = (category) => {
    const {dataImg, list, value, workDateTitle} = this.state;
    const days = workDateTitle.length
    const newList = list.slice();
    newList.forEach((item) => {
      if (item.id === category) {
        item.checked = !item.checked;
        if(item.checked){
          this.setState({
            textTitle: `已选：${item.timeStart}-${item.timeEnd}(共计${item.time}小时)`,
            dollar: days===0?dataImg.price * 4 + '-' + dataImg.price * 8 : dataImg.price * item.time * value * days,
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

  workDate = (e) => {
    console.log(e)
    const { workDateList, workDateTitle, dataImg, timeNum, value, textTitle} = this.state
    const findIndex = workDateList.findIndex(item => item.name === e.name)
    workDateList[findIndex].active = !workDateList[findIndex].active
    if(!e.active){
      workDateTitle.push(e.name).toString()
    } else {
      const index = workDateTitle.indexOf(e.name);
      workDateTitle.splice(index, 1).toString()
    }
    const days = workDateTitle.length
    // console.log('整理后的数据', workDateTitle)
    this.setState({ 
      workDateList, 
      workDateTitle,
      dollar: textTitle === '请选择:规格'? dataImg.price * 4 + '-' + dataImg.price * 8 : dataImg.price * timeNum * value * days,
      dataTitle: days===0? '请选择日期': ''
    })
  }

  // addressChoose = (e) => {
  //   const {address} = this.state
  //   let stationdsc
  //   let areaCode
  //   e.detail.value.map((item,index) => {
  //        index === 0? stationdsc = address[index][item] : areaCode = address[index][item]
  //   })
  //   this.setState({
  //     addressTitle: stationdsc + areaCode,
  //     areaCode
  //   })
  //   console.log('选择地址', stationdsc + areaCode)

  // }

  handlePassareaChange = (e) => {
    const {passareaList, displayCheckedPassareaList: displayCheckedPassarea} = this.state;
    const stationId = e.target.dataset.stationId;
    const areaId = e.target.dataset.areaId;
    console.log('handlePassareaChange: ', e);
    const newPassareaList = passareaList.slice();
    
    
      newPassareaList.forEach((station) => {
        const {recid, stationcode, stationdsc, passareaDtoList} = station;
        console.log('newPassareaList', station)
        if (recid === stationId) {
          passareaDtoList.forEach(area => {
            if (area.recId === areaId) {
              if (!!!displayCheckedPassarea[stationcode]) {
                displayCheckedPassarea[stationcode] = [];
              }
              area.checked = !area.checked;
              if (area.checked) {
                displayCheckedPassarea[stationcode].push(area.areaCode);
              } else {
                displayCheckedPassarea[stationcode].forEach((areaCode1, index) => {
                  if (areaCode1 === area.areaCode) {
                    displayCheckedPassarea[stationcode].splice(index, 1);
                  }
                });
                displayCheckedPassarea[stationcode].splice();
                if (displayCheckedPassarea[stationcode].length === 0) {
                  delete displayCheckedPassarea[stationcode];
                }
              }
            }
          });
        }else {
          passareaDtoList.forEach(area => {
            area.checked = false
            if(displayCheckedPassarea[stationcode]){
              displayCheckedPassarea[stationcode].forEach((areaCode1, index) => {
                if (areaCode1 === area.areaCode) {
                  displayCheckedPassarea[stationcode].splice(index, 1);
                }
              });
                displayCheckedPassarea[stationcode].splice();
                if (displayCheckedPassarea[stationcode].length === 0) {
                  delete displayCheckedPassarea[stationcode];
                }
            }
          })
        }
      });
    
    console.log('选中后的区域列表: ',  newPassareaList);
    this.setState({
      passareaList: newPassareaList,
      displayCheckedPassareaList: displayCheckedPassarea,
    });
  };

  renderPassarea = () => {
    const {passareaList, displayCheckedPassareaList: displayCheckedPassarea} = this.state;
    console.log('displayCheckedPassarea', displayCheckedPassarea)
    return passareaList.map((stationItem) => {
      const {recid: stationId, stationcode, stationdsc, passareaDtoList} = stationItem;
      return (
        <View className='station' key={stationId}>
          <View className='station-item'>
            <Text>{stationdsc}</Text>
          </View>
          <View className='area'>
            {
              passareaDtoList.map((areaItem) => {
                const {recId, areaCode, checked} = areaItem;
                console.log('areaCode', areaCode)
                return (
                  <View className='area-item' key={recId}>
                    <CheckboxGroup 
                      data-station-id={stationItem.recid}  
                      data-area-id={recId} 
                      onChange={this.handlePassareaChange}
                    >
                      <Checkbox 
                        className='area-checkbox' 
                        value="还未给"
                        checked={checked}
                      >
                       {areaCode.toString()}
                      </Checkbox>
                    </CheckboxGroup>
                  </View>
                );
              })
            }
          </View>
        </View>
      );
    });
  };

  handleValueChange = (value) => {
    const {dataImg, workDateTitle, timeNum, textTitle} = this.state
    const day = workDateTitle.length
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

  closeModal = () => {
		this.setState({
			isAtModal: !this.state.isAtModal
    })
  }

  closeDataModal = () => {
    this.setState({
      isDataStart: !this.state.isDataStart
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
      console.log('订单编号', this.state.orderNo)
      if(status === 200) {

        Taro.navigateTo({url: `/buy/pages/buy-pay-success/index?orderNo=${this.state.orderNo}`})

      } else {
        Taro.showToast({
          icon: "none",
          title: message,
          duration: 2000
        })
      }
    })
  }


  render() {
    const height = getWindowHeight(false);
    const { dataImg, isOpeneds, textTitle, workDateList, workDateTitle, dollar, dataTitle } = this.state;
    const res = Taro.getSystemInfoSync();
    const paddingBottom = res.safeArea == undefined ? 0 : res.screenHeight - res.safeArea.bottom;
    const safety = res.screenHeight - res.safeArea.bottom;
    console.log(dataImg)
    console.log('屏幕高度', height, safety)
    return (
      <View className='buy-details'>
        <ScrollView
          scrollY
          className='item-warp'
          style={{ height, paddingBottom: `${safety}px` }}
        >
          <Gallery list={dataImg.listImg} />
          <InfoBase data={dataImg}/>
          {/* <InfoParam /> */}
        </ScrollView>
        {/* <Float isOpened={isOpeneds}  onHandleClose={this.handleClose} data={dataImg}/> */}
        <AtFloatLayout
          isOpened={isOpeneds}
          scrollY
          onClose={this.handleClose}
        >
          <ScrollView
            className='float-item'
            scrollY
            style={{paddingBottom: safety + 10 + 'px'}}
          >
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

            <View className='data-start-end' onClick={this.closeDataModal}>
              <Text className='data-title'>工作日期</Text>
              <Text className='data-content'>{dataTitle}{workDateTitle.join()} </Text>
            </View>

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
            <View 
            className='pay-address' 
            onClick={() => {
                  this.setState({
                     isOpenedPassarea: true,
                    })
                }}
              >
              <View className={`iconfont iconionc-- addressimg`} />
              <View className='pay-address-userName-phone-address'>
                  {Object.keys(this.state.displayCheckedPassareaList).length === 0? '请选择地址':
                  this.state.passareaList.length !== 0 && Object.keys(this.state.displayCheckedPassareaList).map(passarea => {
                        let desc = '';
                        this.state.passareaList.forEach((passareaItem) => {
                          if (passarea === passareaItem.stationcode) {
                            desc = passareaItem.stationdsc;
                          }
                        });
                        
                      return (
                        <View key={passarea}>
                          {desc + this.state.displayCheckedPassareaList[passarea]}
                        </View>
                      );
                    })}
              </View>
            </View>
          </ScrollView>
          <View className='release' style={{paddingBottom: safety + 'px'}}>
            <Button
              plain={true}
              className="btn"
              formType='submit'
              onClick={this.handleBuy}
            >
              付款
            </Button>
          </View>
        </AtFloatLayout>

        <AtFloatLayout
          className='at-float-layout-container'
          scrollY={true}
          isOpened={this.state.isOpenedPassarea} 
          title="选择适用区域" 
          onClose={this.handleClosePassarea}
        >
          <ScrollView
            enableFlex={true}
            style={{'padding-bottom': Taro.pxTransform(paddingBottom)}} 
            className='passarea-wrapper'
          > 
             {this.renderPassarea()}
          </ScrollView>
        </AtFloatLayout>

        <View className='item-footer' style={{paddingBottom: `${safety}px`}}>
          <Footer onAdd={this.handleAdd} onIsOpened={this.handleOpened}/>
        </View>

        <AtModal
          isOpened={this.state.isAtModal}
          onClose={this.closeModal}
        >
          <AtModalContent>
              <View className='wx-pay-address'>
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
      
        <AtModal
          isOpened={this.state.isDataStart}
          onClose={this.closeDataModal}
          className='at-modal-date'
        >
          <AtModalContent>
              <View className='wx-pay-address select-date'>
                <View className='store'>
                  <Text className='store-name'>选择日期</Text>
                </View>
                <View className='tag-wrapper tag-date'>
                  {workDateList.map((item) => {
                      return(
                        <AtTag 
                          key={item.id}
                          type='primary'
                          className={classnames('tag', item.active && 'tag-active')}
                          active={item.active}
                          name={item.name}
                          circle
                          onClick={this.workDate}
                        >{item.name}</AtTag>
                      )
                  })}
                </View>
                
              </View>
          </AtModalContent>
        </AtModal>
      </View>
    )
  }
}
