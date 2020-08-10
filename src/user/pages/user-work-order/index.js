import Taro, {Component} from '@tarojs/taro';
import {View, Text, ScrollView, Button, Input} from '@tarojs/components';
import fetch from '@utils/request';
import {
  API_WORK_ORDER_LIST,
  API_WORK_ORDER_CHECK_IN,
  API_WORK_ORDER_CHECK_OUT,
  API_WORK_ORDER_MY,
  API_WORK_ORDER_RECID
} from '@constants/api';
import {connect} from '@tarojs/redux';
import {AtButton, AtModal, AtModalHeader, AtModalContent, AtModalAction} from 'taro-ui';
import chunk from 'lodash.chunk';
import throttle from 'lodash.throttle';

import './index.scss';
import { getWindowHeight } from '@utils/style';

@connect(state => ({
  userInfo: state.user.userInfo,
}), {})
class UserWorkOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      workOrderList: [], // 工单列表
      isOpenedCheckInModal: false, // 是否打开签到模态
      isFocusCheckInInput: false, // 签到输入框是否获取焦点
      isOpenedCheckOutModal: false, // 是否打开收工模态
      curWorkOrder: {}, // 当前正在操作的工单
      checkInCode: '', // 签到码
      checkOutCode: '', // 手工码
      refresherTriggered: false, // 刷新器是否触发刷新
      total: -1, // 列表总数
    };
    this._pageSize = 5; // 每页数据量
  }

  config = {
    navigationBarTitleText: '我的工单',
  };

  componentDidMount() {
    this.refresherRefresh();
  }

  // 获取工单
  fetchWorkOrder = (pageNum, pageSize, callback) => {
    const {userInfo} = this.props;
    fetch({url: API_WORK_ORDER_MY + `?pageNum=${pageNum}&pageSize=${pageSize}`, accessToken: userInfo.userToken.accessToken})
      .then((res) => {
        const {data, status} = res.data;

        if (status === 200) {
          callback(data);
        }
      })
      .catch(() => {
        this._loadMore = false;
        Taro.hideLoading();
      });
  };

  // 下拉刷新
  refresherRefresh = () => {
    this._loadMore = false;
    Taro.showLoading({
      mask: true,
      title: '正在刷新中'
    });
    this._pageNum = 1;
    this.setState({
      refresherTriggered: true,
    }, () => {
      this.fetchWorkOrder(this._pageNum, this._pageSize, (data) => {
        this.setState({
          workOrderList: data.list,
          refresherTriggered: false,
        }, () => {
          Taro.hideLoading();
          this._freshing = false;
        });
      });
    });
  };

  // 加载更多也叫上拉刷新
  loadMore = () => {
    console.log('loadMore...');

    Taro.showLoading({
      mask: true,
      title: '正在加载更多',
    });

    this._pageNum = this._pageNum + 1;

    this.fetchWorkOrder(this._pageNum, this._pageSize, ({list, total, nextPage}) => {
      this.setState((prevState) => {
        const workOrderListLen = prevState.workOrderList.length;
        const matrixWorkOrderList = chunk(prevState.workOrderList, this._pageSize);
        const mwoLen = matrixWorkOrderList.length;
        let newestWorkOrderList;

        if (nextPage === 0) {
          this._pageNum = Math.floor(total / this._pageSize);
        }

        if (workOrderListLen === total) {
          matrixWorkOrderList[mwoLen - 1] = list;
          newestWorkOrderList = matrixWorkOrderList.flat(1);
        } else {
          if (Math.ceil(workOrderListLen / this._pageSize) === Math.ceil(total / this._pageSize)) {
            matrixWorkOrderList[mwoLen - 1] = list;
            newestWorkOrderList = matrixWorkOrderList.flat(1);
          } else {
            newestWorkOrderList = prevState.workOrderList.concat(list);
          }
        }

        console.log('metrixWorkOrderList: ', matrixWorkOrderList);

        return {
          workOrderList: newestWorkOrderList,
        };
      }, () => {
        Taro.hideLoading();
        this._loadMore = false;
      });
    });
  };

  fetchEditWorkOrder = (workRecId) => {
    const {userInfo: {userToken: {accessToken}}} = this.props;
    const {workOrderList} = this.state;
    const newWorkOrderList = workOrderList.slice();
    fetch({
      url: API_WORK_ORDER_RECID + `/${workRecId}`,
      accessToken: accessToken,
    })
      .then((res) => {
        console.log('当前正在编辑的工单的更新: ', res);
        const {data: {data: workOrder, status}} = res;
        if (status === 200) {
          const curWorkOrderIndex = newWorkOrderList.findIndex((ele) => {
            return ele.workRecid === workOrder.workRecid;
          });
          newWorkOrderList[curWorkOrderIndex] = workOrder;
          this.setState({
            workOrderList: newWorkOrderList,
          }, () => {
            Taro.hideLoading();
          });
        }
      })
      .catch(() => {
        Taro.hideLoading();
      });
  };

  // updateWorkList = () => {

  // };

  // http://172.21.118.79:8090/accc-openapi/workorder/list?staffId=148


  checkIn = () => {
    Taro.scanCode({
      onlyFromCamera: true,
      scanType: 'qrCode',
      success: (res) => {
        this.setState({
          checkInCode: res.result,
        }, () => {
          this.checkInRequest(res.result);
        });
      }
    });
  };

  checkInRequest = (qrCodeData) => {
    const {checkInCode, curWorkOrder: {checkInCode: workOrderCheckInCode, workRecid, orderDto: {address}}} = this.state;
    const newestCheckInCode = qrCodeData || checkInCode;
    const {userInfo: {userToken: {accessToken}, auth: {id: userId}}} = this.props;
    console.log('newestCheckInCode - workOrderCheckInCode: ', newestCheckInCode, workOrderCheckInCode);

    // workOrderCheckInCode 暂时还没有
    if (newestCheckInCode == workOrderCheckInCode) {
      Taro.showLoading({
        icon: 'none',
        title: '正在签到中',
        mask: true,
      });
      fetch({
        url: API_WORK_ORDER_CHECK_IN,
        accessToken: accessToken,
        method: 'POST',
        payload: {
          checkInArea: address,
          checkInBy: userId,
          checkInType: 1,
          staffId: userId,
          workRecid: workRecid,
          checkInCode: newestCheckInCode,
        }
      })
        .then((res) => {
          console.log('checkInRequest: ', res);
          const {data: {status}} = res;
          if (status === 200) {
            this.setState({
              isOpenedCheckInModal: false,
              isFocusCheckInInput: false,
              checkInCode: '',
            });
            this.fetchEditWorkOrder(workRecid);
          }
        })
        .catch(() => {
          Taro.hideLoading();
        });
    } else {
        Taro.showToast({
          icon: 'none',
          title: '请输入正确的签到码',
          duration: 2000,
        });
    }
  };

  checkOut = () => {
    Taro.scanCode({
      onlyFromCamera: true,
      scanType: 'qrCode',
      success: (res) => {
        this.setState({
          checkOutCode: res.result,
        }, () => {
          this.checkOutRequest(res.result);
        });
      }
    });
  };

  checkOutRequest = (qrCodeData) => {
    const {checkOutCode, curWorkOrder: {checkOutCode: workOrderCheckOutCode, workRecid, orderDto: {address}}} = this.state;
    const newestCheckOutCode = qrCodeData || checkOutCode;
    console.log('newestCheckOutCode - workOrderCheckOutCode: ', newestCheckOutCode, workOrderCheckOutCode);

    const {userInfo: {userToken: {accessToken}, auth: {id: userId}}} = this.props;

    if (newestCheckOutCode === workOrderCheckOutCode) {
      Taro.showLoading({
        icon: 'none',
        title: '正在收工中',
        mask: true,
      });
      fetch({
        url: API_WORK_ORDER_CHECK_OUT,
        accessToken: accessToken,
        method: 'POST',
        payload: {
          checkOutArea: address,
          checkOutBy: userId,
          checkOutType: 1,
          staffId: userId,
          workRecid: workRecid,
          checkOutCode: newestCheckOutCode,
        }
      })
        .then((res) => {
          console.log('checkOutRequest: ', res);
          const {data: {status}} = res;
          if (status === 200) {
            this.setState({
              isOpenedCheckOutModal: false,
              isFocusCheckOutInput: false,
              checkOutCode: '',
            });
            this.fetchEditWorkOrder(workRecid);
          }
        })
        .catch(() => {
          Taro.hideLoading();
        });
    } else {
        Taro.showToast({
          icon: 'none',
          title: '请输入正确的收工码',
          duration: 2000,
        });
    }
  };

  renderWorkOrder = () => {
    const {workOrderList} = this.state;
    const systemInfo = Taro.getSystemInfoSync();
    const marginBottom = systemInfo.safeArea == undefined ? 0 : systemInfo.screenHeight - systemInfo.safeArea.bottom;
    return workOrderList.map((workOrderItem, index, sourceArray) => {
      const {
        workRecid,
        orderRecid,
        workDate,
        checkInBy,
        checkInTime,
        checkOutBy,
        checkOutTime,
        orderDto: {
          address,
          stationCode,
          stationdsc,
          orderDetailDto: {
            dateEnd,
            dateStart,
            timeEnd,
            timeStart
        }}} = workOrderItem;
      return (
        <View className='work-order-item' style={{marginBottom: index === sourceArray.length - 1 ? marginBottom + 'px' : Taro.pxTransform(20)}} key={workRecid.toString() + orderRecid.toString()}>
          <View className='info-wrapper'>
            <View className='location'>
              <Text>工作站点: </Text><Text>{stationdsc}</Text>
            </View>
            <View className='location'>
              <Text>工作区域: </Text><Text>{address.split(',').sort().join('、')}</Text>
            </View>
            <View className='date'>
              <Text>工作日期: </Text><Text>{workDate}</Text>
            </View>
            <View className='time'>
              <Text>工作时间: </Text><Text>{timeStart} - {timeEnd}</Text>
            </View>
            {
              checkInBy && (
                <View className='check-in-time'>
                  <Text>签到时间: </Text><Text>{checkInTime}</Text>
                </View>
              )
            }
            {
              checkOutBy && (
                <View className='check-out-time'>
                  <Text>收工时间: </Text><Text>{checkOutTime}</Text>
                </View>
              )
            }
          </View>
          {
            !(checkInTime && checkOutTime) && (
              <View className='btn-wrapper'>
                {
                  !checkInTime && (
                    <AtButton
                      className='card'
                      onClick={() => {
                        this.setState({
                          isOpenedCheckInModal: true,
                          curWorkOrder: workOrderItem,
                        }, () => {
                          this.setState({
                            isFocusCheckInInput: true,
                          })
                        });
                      }}
                    >
                      签到
                    </AtButton>
                  )
                }
                {
                  !checkOutTime && (
                    <AtButton
                      className='work'
                      onClick={() => {
                        const {checkInBy} = workOrderItem;
                        if (!checkInBy) {
                          Taro.showToast({
                            icon: 'none',
                            title: '请先签到',
                          });
                          return;
                        }
                        this.setState({
                          isOpenedCheckOutModal: true,
                          curWorkOrder: workOrderItem,
                        }, () => {
                          this.setState({
                            isFocusCheckOutInput: true,
                          });
                        })
                      }}
                    >
                      收工
                    </AtButton>
                  )
                }
              </View>
            )
          }
        </View>
      );
    });
  }

  scrollToLower = throttle(() => {
    console.log('onScrollToLower...');
    if (this._loadMore) return;
    this._loadMore = true;
    this.loadMore();
  }, 1000);

  render() {
    return (
      <View className='user-work-order'>
        <AtModal
          isOpened={this.state.isOpenedCheckInModal}
          closeOnClickOverlay={false}
          className='check-in-modal'
        >
          <AtModalHeader>输入签到码</AtModalHeader>
          <AtModalContent>
          {this.state.isOpenedCheckInModal &&
            <Input
              value={this.state.checkInCode}
              onInput={(e) => {
                console.log('输入的签到码: ', e);
                this.setState({
                  checkInCode: e.detail.value
                });
              }}
              className='check-in-code'
              adjustPosition={true}
              cursorSpacing={100}
              focus={this.state.isFocusCheckInInput}
              type="number"
              placeholder='签到码'
            />
          }
          </AtModalContent>
          <AtModalAction>
            <Button onClick={() => this.checkIn()}>扫码</Button>
            <Button onClick={() => {
              this.setState({
                isOpenedCheckInModal: false,
                isFocusCheckInInput: false,
                checkInCode: '',
              });
            }}>取消</Button>
            <Button onClick={() => this.checkInRequest()}>确定</Button>
          </AtModalAction>
        </AtModal>
        <AtModal
          isOpened={this.state.isOpenedCheckOutModal}
          closeOnClickOverlay={false}
          className='check-out-modal'
        >
          <AtModalHeader>输入收工码</AtModalHeader>
          <AtModalContent>
            {
              this.state.isOpenedCheckOutModal &&
              <Input
                value={this.state.checkOutCode}
                onInput={(e) => {
                  this.setState({
                    checkOutCode: e.detail.value
                  });
                }}
                className='check-out-code'
                adjustPosition={true}
                cursorSpacing={100}
                focus={this.state.isFocusCheckOutInput}
                type="number"
                placeholder='收工码'
              />
            }
          </AtModalContent>
          <AtModalAction>
            <Button onClick={() => this.checkOut()}>扫码</Button>
            <Button onClick={() => {
              this.setState({
                isOpenedCheckOutModal: false,
                isFocusCheckOutInput: false,
                checkOutCode: '',
              });
            }}>取消</Button>
            <Button onClick={() => this.checkOutRequest()}>确定</Button>
          </AtModalAction>
        </AtModal>
        <ScrollView
          className='scroll-view'
          scrollY
          enableFlex={true}
          style={{height: getWindowHeight(false)}}
          refresherEnabled={true}
          refresherThreshold={100}
          // lowerThreshold={100}
          refresherDefaultStyle="black"
          refresherBackground="white"
          refresherTriggered={this.state.refresherTriggered}
          onRefresherRefresh={() => {
            console.log('onRefresherRefresh...');
            if (this._freshing) return;
            this._freshing = true;
            this.refresherRefresh();
          }}
          onScrollToLower={() => this.scrollToLower()}
        >
          {/* <View className='placeholder'>微信小程序 ScrollView 全是 bug, 这是必不可少的占位元素</View> */}
          {this.renderWorkOrder()}
          <View className='footer'>用户底部撑开 ios 安全区使用</View>
        </ScrollView>
      </View>
    );
  }
}

export default UserWorkOrder;
