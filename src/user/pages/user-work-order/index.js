import Taro, {Component} from '@tarojs/taro';
import {View, Text, ScrollView, Button} from '@tarojs/components';
import fetch from '@utils/request';
import {API_WORK_ORDER_LIST, API_WORK_ORDER_CHECK_IN, API_WORK_ORDER_CHECK_OUT} from '@constants/api';
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
    const {userInfo} = this.props;
    fetch({url: API_WORK_ORDER_LIST, accessToken: userInfo.userToken.accessToken})
      .then((res) => {
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

  // http://172.21.118.79:8090/accc-openapi/workorder/list?staffId=148


  checkIn = () => {
    Taro.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        this.checkInRequest(res);
      }
    })
  };

  checkInRequest = (qrCodeData) => {
    console.log('checkInRequest - qrCodeData: ', qrCodeData);
    const {userInfo} = this.props;
    fetch({
      url: API_WORK_ORDER_CHECK_IN,
      accessToken: userInfo.userToken.accessToken,
    })
      .then((res) => {
        console.log('checkInRequest: ', res);
      })
      .catch(() => {});
  };

  checkOut = (workOrderItem) => {
    const {orderRecid, checkInBy} = workOrderItem;
    if (!checkInBy) {
      Taro.showToast({
        icon: 'none',
        title: '请先签到',
      });
      return;
    }
    Taro.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        console.log(res);
      }
    })
  };

  checkOutRequest = (qrCodeData) => {
    console.log('checkOutRequest - qrCodeData: ', qrCodeData);
    const {userInfo} = this.props;
    fetch({
      url: API_WORK_ORDER_CHECK_OUT,
      accessToken: userInfo.userToken.accessToken,
    })
      .then((res) => {
        console.log('checkInRequest: ', res);
      })
      .catch(() => {});
  };


  renderWorkOrder = () => {
    const {workOrderList} = this.state;
    console.log('workOrderList: ', workOrderList);
    return workOrderList.map((workOrderItem) => {
      const {orderRecid, checkInBy, checkInTime, checkOutBy, checkOutTime, orderDto: {address, orderDetailDto: {dateEnd, dateStart, timeEnd, timeStart}}} = workOrderItem;
      return (
        <View className='work-order-item' key={orderRecid.toString()}>
          <View className='info-wrapper'>
            <View className='location'>
              工作地点:  <Text>{address}</Text>
            </View>
            <View className='date'>
              工作日期:  <Text>{dateStart} - {dateEnd}</Text>
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
            !checkInBy && !checkOutBy && (
              <View className='btn-wrapper'>
                {
                  !checkInBy && <AtButton className='card' onClick={this.checkIn}>签到</AtButton>
                }
                {
                  !checkOutBy && <AtButton className='work' onClick={() => this.checkOut(workOrderItem)}>收工</AtButton>
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
