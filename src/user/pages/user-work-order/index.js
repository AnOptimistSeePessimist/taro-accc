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
    };
  }

  config = {
    navigationBarTitleText: '我的工单',
  };

  componentDidMount() {
    this.fetchWorkOrder();
  }

  // 获取工单
  fetchWorkOrder = () => {
    Taro.showLoading({
      icon: 'none',
      title: '正在加载我的工单',
    });
    const {userInfo} = this.props;
    fetch({url: API_WORK_ORDER_MY, accessToken: userInfo.userToken.accessToken})
      .then((res) => {
        Taro.hideLoading();
        const {data: {list}, status, } = res.data;

        if (status === 200) {
          this.setState({
            workOrderList: list,
          });
        }

      })
      .catch(() => {

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
    console.log('checkInRequest - qrCodeData: ', qrCodeData);
    const {checkInCode, curWorkOrder: {checkInCode: workOrderCheckInCode, workRecid, orderDto: {address}}} = this.state;
    const newestCheckInCode = qrCodeData || checkInCode;
    const {userInfo: {userToken: {accessToken}}} = this.props;

    // workOrderCheckInCode 暂时还没有
    if (newestCheckInCode === workOrderCheckInCode) {
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
          workRecid: workRecid
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
    console.log('checkOutRequest - qrCodeData: ', qrCodeData);
    const {checkOutCode, curWorkOrder: {checkOutCode: workOrderCheckOutCode, workRecid, orderDto: {address}}} = this.state;
    const newestCheckOutCode = qrCodeData || checkOutCode;

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
    console.log('workOrderList: ', workOrderList);
    return workOrderList.map((workOrderItem) => {
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
          orderDetailDto: {dateEnd, dateStart, timeEnd, timeStart}}} = workOrderItem;
      return (
        <View className='work-order-item' key={workRecid.toString() + orderRecid.toString()}>
          <View className='info-wrapper'>
            <View className='location'>
              工作地点:  <Text>{address}</Text>
            </View>
            <View className='date'>
              工作日期:  <Text>{workDate}</Text>
            </View>
            <View className='time'>
              工作时间:  <Text>{timeStart} - {timeEnd}</Text>
            </View>
            {
              checkInBy && (
                <View className='check-in-time'>
                  签到时间: <Text>{checkInTime}</Text>
                </View>
              )
            }
            {
              checkOutBy && (
                <View className='check-out-time'>
                  收工时间: <Text>{checkOutTime}</Text>
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

  render() {
    return (
      <View className='user-work-order'>
        <ScrollView
          className='scroll-view'
          scrollY
          enableFlex={true}
          style={{height: getWindowHeight(false)}}
        >
          {this.renderWorkOrder()}
        <AtModal
          isOpened={this.state.isOpenedCheckInModal}
          onClose={() => {
            this.setState({
              isOpenedCheckInModal: false,
              isFocusCheckInInput: false,
            });
          }}
          className='check-in-modal'
        >
          <AtModalHeader>输入签到码</AtModalHeader>
          <AtModalContent>
          {this.state.isOpenedCheckInModal &&
            <Input
              value={this.state.checkInCode}
              onInput={(e) => {
                this.setState({
                  checkInCode: e.target.value
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
            <Button onClick={this.checkIn}>扫码</Button>
            <Button onClick={this.checkInRequest}>确定</Button>
          </AtModalAction>
        </AtModal>
        <AtModal
          isOpened={this.state.isOpenedCheckOutModal}
          onClose={() => {
            this.setState({
              isOpenedCheckOutModal: false,
              isFocusCheckOutInput: false,
            });
          }}
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
                    checkInCode: e.target.value
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
            <Button onClick={this.checkOut}>扫码</Button>
            <Button onClick={this.checkOutRequest}>确定</Button>
          </AtModalAction>
        </AtModal>
        </ScrollView>
      </View>
    );
  }
}

export default UserWorkOrder;
