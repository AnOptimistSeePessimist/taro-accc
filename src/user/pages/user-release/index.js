import Taro, {Component} from '@tarojs/taro';
import {View, Text, Image, ScrollView} from '@tarojs/components';
import {connect} from '@tarojs/redux';
import fetch from '@utils/request';
import {API_RSPUBLISH_LIST} from '@constants/api';
import { getWindowHeight } from '@utils/style';
import chunk from 'lodash.chunk';
import throttle from 'lodash.throttle';
import {AtSwipeAction} from 'taro-ui';

import './index.scss';

@connect(state => ({userInfo: state.user.userInfo}), {})
class UserRelease extends Component {
  constructor(props) {
    super(props);
    this.state = {
      publishList: [], // 发布列表
      refresherTriggered: false, // 刷新器被触发
    };
    this._pageSize = 6; // 每页数据量
  }

  config = {
    navigationBarTitleText: '我的发布',
  };

  componentDidMount() {
    this.refresherRefresh();
  }

  getReleaseData = (pageNum, pageSize, callback) => {
    fetch({url: API_RSPUBLISH_LIST + `?pageNum=${pageNum}&pageSize=${pageSize}`, accessToken: this.props.userInfo.userToken.accessToken})
      .then((res) => {
        console.log('publishList: ', res);
        const {data: {data, status}} = res;

        if (status === 200) {
          callback(data);
        }
      })
      .catch(() => {
        this._loadMore = false;
        Taro.hideLoading();
      });
  };

  renderItem = () => {
    console.log('renderItem');
    const {publishList} = this.state;
    return publishList.map((publish, key, sourceArray) => {
      const {
        rspublishDto:
          {
            price,
            dateEnd,
            dateStart,
            iscancel,
            timeEnd,
            timeStart,
            rsId,
            publishRecid,
            workTypeName,
            workdateList,
            workTypePicUrl,
          }
      } = publish;
      return (
      <AtSwipeAction
        key={rsId.toString() + publishRecid.toString()}
        autoClose={true}
        onClick={(e) => {
          if (e.text === '删除') {

          } else {

          }
        }}
        options={[
          {
            text: '删除',
            style: {
              backgroundColor: '#FF4949'
            }
          }
        ]}
      >
        <View
          className='publish-item'
          onClick={() => {
            this.$preload({
              flag: 1,
              data: publish,
            });
            Taro.navigateTo({
              url: '/user/pages/user-release-details/index'
            });
          }}
        >
          <View
            className='publish-item-wrapper'
            style={{
              'margin-top': key === 0 ? Taro.pxTransform(14) : Taro.pxTransform(7),
              'opacity': iscancel === 'N' ? '1' : '0.5'
              }}
            >
            <View className='left-image'>
            <Image
              className='image'
              src={workTypePicUrl}
            />
            </View>
            <View className='right-information'>
              <Text className='work-type'>
                {workTypeName}
                <Text className='dollar'>({price}元/每小时)</Text>
              </Text>
              <Text className='data-start-end'>{workdateList.join('、')}</Text>
              <Text className='time-start-end'>{timeStart} 至 {timeEnd}</Text>
              {/* <Text>人员: {rsId}</Text> */}
              {/* <Text>是否已作废: {iscancel}</Text> */}
            </View>
          </View>
        </View>
      </AtSwipeAction>
      );
    });
  };

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
      this.getReleaseData(this._pageNum, this._pageSize, (data) => {
        if (data.list.length !== 0) {
          this.setState({
            publishList: data.list,
            refresherTriggered: false,
          }, () => {
            Taro.hideLoading();
            this._freshing = false
          });
        } else {
          Taro.showToast({
            icon: 'none',
            title: '暂无发布信息',
            duration: 2000,
          });
          setTimeout(() => {
            Taro.navigateBack();
          }, 2000);
        }
      });
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

    this.getReleaseData(this._pageNum, this._pageSize, ({list, total, nextPage}) => {
      this.setState((prevState) => {
        const publishListLen = prevState.publishList.length;
        const matrixPublishList = chunk(prevState.publishList, this._pageSize);
        const mpLen = matrixPublishList.length;
        let newestPublishList;

        if (nextPage === 0) {
          this._pageNum = Math.floor(total / this._pageSize);
        }

        if (publishListLen === total) {
          matrixPublishList[mpLen - 1] = list;
          newestPublishList = matrixPublishList.flat();
        } else {
          if (Math.ceil(publishListLen / this._pageSize) === Math.ceil(total / this._pageSize)) {
            matrixPublishList[mpLen - 1] = list;
            newestPublishList = matrixPublishList.flat();
          } else {
            newestPublishList = prevState.publishList.concat(list);
          }
        }

        console.log('matrixPublishList: ', matrixPublishList);

        return {
          publishList: newestPublishList,
        };
      }, () => {
        Taro.hideLoading();
        this._loadMore = false;
      });
    });
  };



  render() {
    const {publishList} = this.state;
    const systemInfo = Taro.getSystemInfoSync();
    const height = systemInfo.safeArea == undefined ? 0 : systemInfo.screenHeight - systemInfo.safeArea.bottom;
    return (
      <ScrollView
        className='user-release'
        scrollY
        style={{height: getWindowHeight(false)}}
        refresherEnabled={true}
        refresherThreshold={100}
        lowerThreshold={150}
        refresherDefaultStyle="black"
        refresherBackground="white"
        refresherTriggered={this.state.refresherTriggered}
        onRefresherRefresh={() => {
          if (this._freshing) return;
          this._freshing = true;
          this.refresherRefresh();
        }}
        enableBackToTop={true}
        onScrollToLower={() => this.scrollToLower()}
      >
        <View style={{height: `${Taro.getSystemInfoSync().windowHeight + 1}px`}}>
          <View className='placeholder'>微信小程序 ScrollView 全是 bug, 这是必不可少的占位元素</View>
          {this.renderItem()}
          <View className='footer' style={{height: height + 'px'}}>用户底部撑开 ios 安全区使用</View>
        </View>
      </ScrollView>
    );
  }
}

export default UserRelease;
