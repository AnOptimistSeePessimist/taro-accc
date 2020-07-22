import Taro, {Component} from '@tarojs/taro';
import {View, Text} from '@tarojs/components';
import fetch from '@utils/request';
import {API_ORDER_MYTRADE} from '@constants/api';
import {connect} from '@tarojs/redux';
import { getWindowHeight } from '@utils/style';

import './index.scss';

@connect(state => state.user, {})
class UserTransaction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      transactionList: [], // [0] [1]
    };
  }

  config = {
    navigationBarTitleText: '我的交易',
  };

  componentDidMount() {
    this.fetchMyTrade();
  }

  fetchMyTrade = () => {
    Taro.showLoading({
      title: '加载交易数据',
    });
    const {userInfo} = this.props;
    fetch({url: API_ORDER_MYTRADE, accessToken: userInfo.userToken.accessToken})
      .then((res) => {
        Taro.hideLoading();
        const {data: {status, data}} = res;
        console.log('我的交易: ', res);

        if (status === 200) {
          this.setState({
            transactionList: data.list,
          });
        }

      })
      .catch(() => {
        Taro.hideLoading();
      });
  };

  // renderNilTips = () => {
  //   return (
  //     <View>
  //       <Text>暂无交易记录</Text>
  //     </View>
  //   );
  // }

  renderTransactionList = () => {
    const {transactionList} = this.state;
    return transactionList.map((transactionRecord) => {
      const {orderRecid, address, orderNo, createTime, orderstatusDtoList} = transactionRecord;
      return (
        <View className="transaction-record" key={orderRecid}>
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
    return (
      <ScrollView
        className='user-transaction'
        scrollY
        enableFlex={true}
        style={{height: getWindowHeight(false)}}
      >
        {this.renderTransactionList()}
      </ScrollView>
    );
  }
}

export default UserTransaction;
