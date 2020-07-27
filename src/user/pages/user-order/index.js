import Taro, {Component} from '@tarojs/taro';
import {View, Text, ScrollView} from '@tarojs/components';
import fetch from '@utils/request';
import {API_ORDER_MYORDER} from '@constants/api';
import {connect} from '@tarojs/redux';

import './index.scss';
import { getWindowHeight } from '@utils/style';

@connect(state => state.user, {})
class UserOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderList: [],
    };
  }

  config = {
    navigationBarTitleText: '我的订单',
  };

  componentDidMount() {
    this.fetchMyOrder();
  }

  fetchMyOrder = () => {
    Taro.showLoading({
      title: '加载订单数据',
    });
    const {userInfo} = this.props;
    fetch({url: API_ORDER_MYORDER, accessToken: userInfo.userToken.accessToken})
      .then((res) => {
        Taro.hideLoading();
        const {data: {status, data}} = res;
        console.log('我的交易: ', res);

        if (status === 200) {
          this.setState({
            orderList: data.list,
          });
        }
      })
      .catch(() => {
        Taro.hideLoading();
      });
  };

  userOrderDetails = (orderRecord) => {
    Taro.navigateTo({url: `/user/pages/user-order-details/index?oneOrder=${JSON.stringify(orderRecord)}`})

  }

  renderOrderList = () => {
    const {orderList} = this.state;
    return orderList.map((orderRecord) => {
      const {orderRecid, orderNo, createTime, orderstatusDtoList} = orderRecord;
      return (
        <View className="order-record" key={orderRecid} onClick={() => {this.userOrderDetails(orderRecord)}}>
          <View className="order-no">
            <Text>订单编号: {orderNo}</Text>
          </View>
          <View className="create-time">
            <Text>下单时间: {createTime}</Text>
          </View>
          <View className="order-status">
            <Text>订单状态: {orderstatusDtoList[0].statusdsc}</Text>
          </View>
        </View>
      );
    });
  };

  render() {
    // const {transactionList} = this.state;
    return (
      <ScrollView
        className='user-order'
        scrollY
        style={{height: getWindowHeight(false)}}
      >
        {this.renderOrderList()}
      </ScrollView>
    );
  }
}

export default UserOrder;
