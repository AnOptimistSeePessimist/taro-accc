import Taro, {Component} from '@tarojs/taro';
import {View, Text, Button} from '@tarojs/components';
import {AtTimeline, AtButton, AtModal, AtModalHeader, AtModalContent, AtModalAction, AtCheckbox} from 'taro-ui';
import {API_ORDER_RS, API_WORK_ORDER_DISTRIBUTE, API_ORDER_ORDERONE, API_SEND_SUBSCRIBE_MSG} from '@constants/api';
import fetch from '@utils/request';
import { connect } from '@tarojs/redux';

import './index.scss';

@connect(state => ({userInfo: state.user.userInfo}), {})
class UserTransactionDetails extends Component {
  config = {
    navigationBarTitleText: '交易详情',
  };

  constructor() {
    super(...arguments);
    this.state = {
      transactionRecord: {}, // 交易记录
      manpower: [], // 人力列表
      checkedManpower: [], // 选中的人力
      displayCheckedManpower: '', // 显示在界面上的人力
      isOpenedManpowerList: false, // 是否打开人力选择界面
    };
  }

  componentDidMount() {
    this.fetchManpower();
  }

  fetchManpower = () => {
    const {userToken: {accessToken}} = this.props.userInfo;
    const {transactionRecord} = this.state;
    fetch({
      url: API_ORDER_RS + `/${transactionRecord.orderRecid}`,
      accessToken: accessToken
    })
      .then((res) => {
        const {data: {status, data: {hresDtoList}}} = res;

        if (status === 200) {
          const manpowerCount = transactionRecord.orderDetailDto.count;
          const checkedManpower = [];

          const newHresDtoList = hresDtoList.map((hresItem, index, sourceArray) => {
            hresItem.label = hresItem.name;
            hresItem.value = hresItem.usrRecId;

            if (manpowerCount === sourceArray.length) {
              checkedManpower.push(hresItem.usrRecId);
            }
            // hresItem.checked = false;
            return hresItem;
          });

          console.log('newHresDtoList: ', newHresDtoList);
          this.setState({
            checkedManpower: checkedManpower,
            manpower: newHresDtoList,
          });
        }

        console.log('获取订单对应的人力资源: ', res);
      })
      .catch(() => {

      });
  };

  componentWillPreload(param) {
    console.log('componentWillPreload');
    return this.retrieveData(param.transactionRecord);
  }

  retrieveData = (transactionRecord, flag) => {
    let parsedTransactionRecord;
    if (flag === 1) {
      parsedTransactionRecord = transactionRecord;
    } else {
      parsedTransactionRecord = JSON.parse(transactionRecord);
    }
    console.log('retrieveData: ', parsedTransactionRecord);
    parsedTransactionRecord.orderstatusDtoList = parsedTransactionRecord.orderstatusDtoList.map((ele, index, array) => {
      const {statusdsc, createTime, status}= ele;
      ele.title = statusdsc;
      ele.content = [createTime];
      ele.icon = '';
      if (index === 0) {
        ele.color = 'black';
      } else {
        ele.color = 'gray';
      }
      return ele;
    });

    this.setState({
      transactionRecord: parsedTransactionRecord,
    });
  }

  do = () => {
    this.toggleManpowerModal();
  };

  toggleManpowerModal = (callback = () => {}) => {
    this.setState((prevState) => ({
      isOpenedManpowerList: !prevState.isOpenedManpowerList
    }), () => {
      callback();
    });
  };

  handleManpowerChange = (checkedManpower) => {
    console.log('handleManpowerChange: ', checkedManpower);
    // const {manpower} = this.state;

    // const newIntersection = intersectionWith(manpower, newCheckedManpower, function (arrVal, othVal) {
    //   return arrVal.hresRecid === othVal.hresRecid;
    // });

    // const manpowerName =  newIntersection.map(item => item.name);

    // console.log('newIntersection: ', newIntersection);

    this.setState({
      checkedManpower,
      // displayCheckedManpower: manpowerName.toString()
    });
  };

  renderCheckbox = () => {
    const {isOpenedManpowerList, manpower, checkedManpower} = this.state;
    if (!isOpenedManpowerList) {
      return <View/>
    }

    return (
      <AtCheckbox
        className='curr-at-checkbox'
        options={manpower}
        selectedList={checkedManpower}
        onChange={this.handleManpowerChange}
      />
    );
  }

  sendSubscribeMsg = () => {
    const {userToken: {accessToken}} = this.props.userInfo;
    fetch({
      method: 'POST',
      url: API_SEND_SUBSCRIBE_MSG,
      accessToken: accessToken,
    })
      .then((res) => {
        console.log('sendSubscribeMsg: ', res);
      })
      .catch(() => {

      });
  };

  doing = () => {
    // this.sendSubscribeMsg();
    const {transactionRecord, checkedManpower} = this.state;
    const {userToken: {accessToken}} = this.props.userInfo;
    const manpowerCount = transactionRecord.orderDetailDto.count;
    console.log('购买的人数: ', transactionRecord.orderDetailDto.count);
    console.log('选择派工的人数: ', checkedManpower.length);

    if (manpowerCount !== checkedManpower.length) {
      Taro.showToast({
        icon: 'none',
        title: `请选择${manpowerCount}名工人`,
      });
      return;
    }

    this.toggleManpowerModal(() => {
      Taro.showLoading({
        title: '正在派工中',
      });

      fetch({
        url: API_WORK_ORDER_DISTRIBUTE + `?orderRecid=${transactionRecord.orderRecid}&staffIds=${checkedManpower.toString()}`,
        method: 'POST',
        accessToken: accessToken,
      })
        .then((res) => {
          Taro.hideLoading();
          console.log('doing 派工: ', res);
          const {data: {status}} = res;

          if (status === 200) {
            this.queryOrder();
            Taro.eventCenter.trigger('update', '触发了上一个界面的更新');
          }

        })
        .catch(() => {

        });
    });
  };


  queryOrder = () => {
    const {transactionRecord} = this.state;
    const {userToken: {accessToken}} = this.props.userInfo;

    fetch({
      url: API_ORDER_ORDERONE + `/${transactionRecord.orderNo}`,
      accessToken: accessToken,
    })
      .then((res) => {
        console.log('queryOrder: ', res);
        const {data} = res;

        if (data.status === 200) {
          this.retrieveData(data.data, 1);
        }
      })
      .catch((error) => {

      });
  };


  render() {
    console.log('render...');
    const {transactionRecord} = this.state;
    console.log('transactionRecord: ', transactionRecord);
    const orderDetail = transactionRecord.orderDetailDto === undefined ? {} : transactionRecord.orderDetailDto;
    return (
      <View className='user-transaction-details'>
        <View className='order-no'>
          <Text className='title'>订单编号:</Text>
          <Text>{transactionRecord.orderNo}</Text>
        </View>

        <View className='order-time'>
          <Text className='title'>订单时间:</Text>
          <Text>{transactionRecord.createTime}</Text>
        </View>

        <View className='order-price'>
          <Text className='title'>订单价格:</Text>
          <Text>{transactionRecord.paidSum}</Text>
        </View>

        <View className='order-content'>
          <Text className='title'>订单内容:</Text>
          <Text>{orderDetail.workTypeName || ''}</Text>
        </View>

        <View className='order-status'>
          <View className='title'>订单状态</View>
          <View>
          <AtTimeline
            className='time-line'
            items={transactionRecord.orderstatusDtoList || []}
          >
          </AtTimeline>
          </View>
        </View>
        <AtModal
          isOpened={this.state.isOpenedManpowerList}
          closeOnClickOverlay={false}
        >
          <AtModalHeader>选择派工人员(选{orderDetail.count}人)</AtModalHeader>
          <AtModalContent className='at-modal-content'>
            <View className='manpower-list'>
              {this.renderCheckbox()}
            </View>
          </AtModalContent>
          <AtModalAction>
            <Button onClick={() => {
              if (orderDetail.count === this.state.checkedManpower.length) {

              } else {
                this.setState({
                  checkedManpower: [],
                });
              }
              this.toggleManpowerModal();
            }}>取消</Button>
            <Button onClick={this.doing}>确定</Button>
          </AtModalAction>
        </AtModal>
        {
          transactionRecord.orderstatusDtoList &&
          (transactionRecord.orderstatusDtoList[0].status === 2) && <AtButton className='do' onClick={() => this.do()}>点击派工</AtButton>
        }
      </View>
    );
  }
}

export default UserTransactionDetails;
