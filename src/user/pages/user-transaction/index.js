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
      refresherTriggered: false,
    };
  }

  config = {
    navigationBarTitleText: '我的交易',
  };

  componentDidMount() {
    Taro.eventCenter.on('update', (arg) => {
      console.log('arg: ', arg);
      this.fetchMyTrade(1);
    });
    this.fetchMyTrade(1);
  }

  fetchMyTrade = (refreshFlag) => {
    // refreshFlag(1 = 下拉刷新, 2 = 上拉加载)
    if (refreshFlag === 1) {
      this.setState({
        refresherTriggered: true,
      });
    }

    const {userInfo} = this.props;
    fetch({url: API_ORDER_MYTRADE, accessToken: userInfo.userToken.accessToken})
      .then((res) => {
        Taro.hideLoading();
        const {data: {status, data}} = res;
        console.log('我的交易: ', res);

        if (status === 200) {
          setTimeout(() => {
            this.setState((prevState) => {
              if (refreshFlag === 1) {
                return ({
                  transactionList: data.list || []
                });
              } else {
                return ({
                  transactionList: prevState.transactionList.concat(data.list || [])
                });
              }
            }, () => {
              this.setState({
                refresherTriggered: false,
              })
              this._freshing = false
            });
          }, 1000);
        }

      })
      .catch(() => {
        Taro.hideLoading();
      });
  };

  renderTransactionList = () => {
    const {transactionList} = this.state;
    return transactionList.map((transactionRecord, index, array) => {
      const {orderRecid, address, orderNo, createTime, orderstatusDtoList} = transactionRecord;
      const newestStatus = orderstatusDtoList[0].status;
      const newestStatusDesc = orderstatusDtoList[0].statusdsc;
      return (
        <View
          className="transaction-record"
          key={orderRecid}
          onClick={() => {
            // this.$preload('transactionRecord', transactionRecord);
            Taro.navigateTo({
              url: `/user/pages/user-transaction-details/index?transactionRecord=${JSON.stringify(transactionRecord)}`,
            });
          }}
        >
          <View className="order-no">
            <Text>订单编号: {orderNo}</Text>
          </View>
          <View className="create-time">
            <Text>下单时间: {createTime}</Text>
          </View>
          <View className="order-status">
            订单状态: <Text style={{color: newestStatus === 3 ? '#fe871f' : 'black', fontWeight: newestStatus === 3 ? 800 : 400}}>{newestStatusDesc}</Text>
          </View>
        </View>
      );
    });
  };

  render() {
    const res = Taro.getSystemInfoSync();
    const height = res.safeArea == null ? 0 : res.screenHeight - res.safeArea.bottom;
    return (
      <ScrollView
        className='user-transaction'
        scrollY
        enableFlex={true}
        style={{height: getWindowHeight(false)}}
        refresherEnabled={true}
        refresherThreshold={100}
        refresherDefaultStyle="white"
        refresherBackground="#fe871f"
        refresherTriggered={this.state.refresherTriggered}
        onRefresherPulling={() => {}}
        onRefresherRefresh={() => {
          if (this._freshing) return;
          this._freshing = true;
          this.fetchMyTrade(1);
        }}
        onRefresherRestore={(e) => {}}
        onRefresherAbort={(e) => {}}
      >
        {this.renderTransactionList()}
        <View style={{height: height + 'px'}} />
      </ScrollView>
    );
  }
}

export default UserTransaction;
