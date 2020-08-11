import Taro, {Component} from '@tarojs/taro';
import {View, Text} from '@tarojs/components';
import fetch from '@utils/request';
import {API_ORDER_MYTRADE} from '@constants/api';
import {connect} from '@tarojs/redux';
import { getWindowHeight } from '@utils/style';
import chunk from 'lodash.chunk';
import throttle from 'lodash.throttle';

import './index.scss';

@connect(state => state.user, {})
class UserTransaction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      transactionList: [], // [0] [1]
      refresherTriggered: false,
    };
    this._pageSize = 5; // 每页数据量
  }

  config = {
    navigationBarTitleText: '我的交易',
  };

  componentDidMount() {
    Taro.eventCenter.on('update', (arg) => {
      console.log('arg: ', arg);
      this.refresherRefresh();
    });
    this.refresherRefresh();
  }

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
      this.fetchMyTrade(this._pageNum, this._pageSize, (data) => {
        this.setState({
          transactionList: data.list,
          refresherTriggered: false,
        }, () => {
          Taro.hideLoading();
          this._freshing = false;
        });
      });
    });
  };

  // 获取我的交易
  fetchMyTrade = (pageNum, pageSize, callback) => {
    const {userInfo} = this.props;
    fetch({url: API_ORDER_MYTRADE + `?pageNum=${pageNum}&pageSize=${pageSize}`, accessToken: userInfo.userToken.accessToken})
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

  scrollToLower = throttle(() => {
    console.log('onScrollToLower...');
    if (this._loadMore) return;
    this._loadMore = true;
    this.loadMore();
  }, 1000);


  // 加载更多也叫上拉刷新
  loadMore = () => {
    console.log('loadMore...');

    Taro.showLoading({
      mask: true,
      title: '正在加载更多',
    });

    this._pageNum = this._pageNum + 1;

    this.fetchMyTrade(this._pageNum, this._pageSize, ({list, total, nextPage}) => {
      this.setState((prevState) => {
        const transactionListLen = prevState.transactionList.length;
        const matrixTransactionList = chunk(prevState.transactionList, this._pageSize);
        const mtLen = matrixTransactionList.length;
        let newestTransactionList;

        if (nextPage === 0) {
          this._pageNum = Math.floor(total / this._pageSize);
        }

        if (transactionListLen === total) {
          matrixTransactionList[mtLen - 1] = list;
          newestTransactionList = matrixTransactionList.flat();
        } else {
          if (Math.ceil(transactionListLen / this._pageSize) === Math.ceil(total / this._pageSize)) {
            matrixTransactionList[mtLen - 1] = list;
            newestTransactionList = matrixTransactionList.flat();
          } else {
            newestTransactionList = prevState.transactionList.concat(list);
          }
        }

        console.log('matrixTransactionList: ', matrixTransactionList);

        return {
          transactionList: newestTransactionList,
        };
      }, () => {
        Taro.hideLoading();
        this._loadMore = false;
      });
    });
  };


  renderTransactionList = () => {
    const {transactionList} = this.state;
    const systemInfo = Taro.getSystemInfoSync();
    const marginBottom = systemInfo.safeArea == undefined ? 0 : systemInfo.screenHeight - systemInfo.safeArea.bottom;
    return transactionList.map((transactionRecord, index, sourceArray) => {
      const {orderRecid, address, orderNo, createTime, orderstatusDtoList} = transactionRecord;
      const newestStatus = orderstatusDtoList[0].status;
      const newestStatusDesc = orderstatusDtoList[0].statusdsc;
      return (
        <View
          style={{marginBottom: index === sourceArray.length - 1 ? marginBottom + 'px' : Taro.pxTransform(10)}}
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
        onRefresherRefresh={() => {
          console.log('onRefresherRefresh...');
          if (this._freshing) return;
          this._freshing = true;
          this.refresherRefresh();
        }}
        onScrollToLower={() => this.scrollToLower()}
      >
        <View style={{height: `${Taro.getSystemInfoSync().windowHeight + 1}px`}}>
          <View className='placeholder'>微信小程序 ScrollView 全是 bug, 这是必不可少的占位元素</View>
          {this.renderTransactionList()}
          <View className='footer'>用户底部撑开 ios 安全区使用</View>
        </View>
      </ScrollView>
    );
  }
}

export default UserTransaction;
