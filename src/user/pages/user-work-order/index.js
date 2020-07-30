import Taro, {Component} from '@tarojs/taro';
import {View, Text, ScrollView, Button} from '@tarojs/components';
import fetch from '@utils/request';
import {
  API_WORK_ORDER_LIST,
  API_WORK_ORDER_CHECK_IN,
  API_WORK_ORDER_CHECK_OUT,
  API_WORK_ORDER_MY,
  API_WORK_ORDER_RECID
} from '@constants/api';
import {connect} from '@tarojs/redux';
import {AtButton} from 'taro-ui';

import './index.scss';
import { getWindowHeight } from '@utils/style';

@connect(state => ({
  userInfo: state.user.userInfo,
}), {})
class UserWorkOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      workOrderList: [],
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


  checkIn = (workOrder) => {
    const {workRecid, staffId} = workOrder;
    // this.checkInRequest(`${workRecid}/${staffId}/3/123`, workOrder);
    Taro.scanCode({
      onlyFromCamera: true,
      scanType: 'qrCode',
      success: (res) => {
        console.log('checkIn - 扫描到的内容: ', res);
        this.checkInRequest(res.result, workOrder);
      }
    });
  };

  // 3 => 签到
  checkInRequest = (qrCodeData, workOrder) => {
    console.log('checkInRequest - qrCodeData: ', qrCodeData);
    const codeList = qrCodeData.split('/');
    const workRecId = codeList[0];
    const staffId = codeList[1];
    const operationType = codeList[2];
    const random = codeList[3];
    const {workRecid, orderDto: {address}} = workOrder;
    console.log('workRecId/staffId/operationType/random: ', `${workRecId}/${staffId}/${operationType}/${random}`);
    console.log('workOrder:', workOrder);

    const {userInfo: {userToken: {accessToken}, auth: {id: userId}}} = this.props;

    console.log('二维码上的workRecId/当前工单的workRecid: ', `${workRecId}/${workRecid}`);
      console.log('二维码上的staffId/当前用户的staffId', `${staffId}/${userId}`);
    // 比较 staffId 和 workRecid
    if (workRecId == workRecid && userId == staffId && operationType == 3) {
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
            this.fetchEditWorkOrder(workRecid);
          }
        })
        .catch(() => {
          Taro.hideLoading();
        });
    } else {
        Taro.showToast({
          icon: 'none',
          title: '请出示正确的签到二维码',
          duration: 2000,
        });
    }
  };

  checkOut = (workOrder) => {
    const {orderRecid, checkInBy, workRecid, staffId} = workOrder;
    if (!checkInBy) {
      Taro.showToast({
        icon: 'none',
        title: '请先签到',
      });
      return;
    }
    // this.checkOutRequest(`${workRecid}/${staffId}/4/456`, workOrder);
    Taro.scanCode({
      onlyFromCamera: true,
      scanType: 'qrCode',
      success: (res) => {
        console.log('checkOut - 扫描到的内容: ', res);
        this.checkOutRequest(res.result, workOrder);
      }
    });
  };

  // 4 => 收工
  checkOutRequest = (qrCodeData, workOrder) => {
    console.log('checkOutRequest - qrCodeData: ', qrCodeData);
    const codeList = qrCodeData.split('/');
    const workRecId = codeList[0];
    const staffId = codeList[1];
    const operationType = codeList[2];
    const random = codeList[3];
    const {workRecid, orderDto: {address}} = workOrder;
    console.log('workRecId/staffId/operationType/random: ', `${workRecId}/${staffId}/${operationType}/${random}`);
    console.log('workOrder:', workOrder);

    const {userInfo: {userToken: {accessToken}, auth: {id: userId}}} = this.props;

    console.log('二维码上的workRecId/当前工单的workRecid: ', `${workRecId}/${workRecid}`);
    console.log('二维码上的staffId/当前用户的staffId', `${staffId}/${userId}`);

      // 比较 staffId 和 workRecid
      if (workRecId == workRecid && userId == staffId && operationType == 4) {
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
            console.log('checkInRequest: ', res);
            const {data: {status}} = res;
            if (status === 200) {
              this.fetchEditWorkOrder(workRecid);
            }
          })
          .catch(() => {
            Taro.hideLoading();
          });
      } else {
          Taro.showToast({
            icon: 'none',
            title: '请出示正确的收工二维码',
            duration: 2000,
          });
      }


  };

  renderWorkOrder = () => {
    const {workOrderList} = this.state;
    console.log('workOrderList: ', workOrderList);
    return workOrderList.map((workOrderItem) => {
      const {orderRecid, workDate, checkInBy, checkInTime, checkOutBy, checkOutTime, orderDto: {address, orderDetailDto: {dateEnd, dateStart, timeEnd, timeStart}}} = workOrderItem;
      return (
        <View className='work-order-item' key={orderRecid.toString()}>
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
                  !checkInTime && <AtButton className='card' onClick={() => this.checkIn(workOrderItem)}>签到</AtButton>
                }
                {
                  !checkOutTime && <AtButton className='work' onClick={() => this.checkOut(workOrderItem)}>收工</AtButton>
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
        </ScrollView>
      </View>
    );
  }
}

export default UserWorkOrder;
