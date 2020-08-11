import Taro, {Component} from '@tarojs/taro';
import {View, Text, Button, ScrollView} from '@tarojs/components';
import {connect} from '@tarojs/redux';
import {API_HRES_LIST, API_HRES_VERIFY} from '@constants/api';
import fetch from '@utils/request';
import {
  AtModal,
  AtModalHeader,
  AtModalContent,
  AtModalAction,
} from 'taro-ui';
import { getWindowHeight } from '@utils/style';
import chunk from 'lodash.chunk';
import throttle from 'lodash.throttle';

import './index.scss';

const sexList = [
  {name: '女', code: 'F'},
  {name: '男', code: 'M'}
];

@connect(state => ({userInfo: state.user.userInfo}), {})
class UserResource extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resource: [],
      isOpened: false,
      hresRecId: '',
      refresherTriggered: false, // 刷新器是否触发刷新
    };
    this._pageSize = 10; // 每页数据量
  }

  config = {
    navigationBarTitleText: '我的资源',
  };

  componentDidMount() {
    this.refresherRefresh();
  }

  fetchManpower = (pageNum, pageSize, callback) => {
    const {hresDto: {companyCode}, userToken: {accessToken}} = this.props.userInfo;
    fetch({url: API_HRES_LIST + `?companyCode=${companyCode}&pageNum=${pageNum}&pageSize=${pageSize}`, accessToken})
      .then((res) => {
        const {data: {status, data}} = res;
        console.log('获取人力资源: ', res);

        if (status === 200) {
          callback(data);
        }
      })
      .catch(() => {
        this._loadMore = false;
        Taro.hideLoading();
      });
  };

  validate = (hresRecId) => {
    this.setState({
      isOpened: true,
      hresRecId: hresRecId,
    });
  };

  renderResource = () => {
    const {resource} = this.state;

    return resource.map((resourceItem) => {
      const {hresRecid, name, worktypeRecid, isverify, sex, workTypeDesc} = resourceItem;
      return (
        <View className='resource-item' key={hresRecid}>
          <View className='left-details'>
            <View>{name}({sexList.find(sexItem => sexItem.code === sex).name}, {workTypeDesc})</View>
          </View>
          <View>
          <View>
            <Button
              className='validate-button'
              disabled={isverify === 'Y'}
              onClick={() => this.validate(hresRecid)}
            >
              {isverify === 'Y' ? '已审核' : '待审核'}
            </Button>
          </View>
          </View>
        </View>
      );
    });
  };

  handleCancel = () => {
    this.setState({
      isOpened: false,
      hresRecId: '',
    });
  };

  handleConfirm = () => {
    this.setState({
      isOpened: false,
    }, () => {
      Taro.showLoading({title: '正在审核资源中'});
      const {hresRecId} = this.state;
      const {userToken: {accessToken}} = this.props.userInfo;
      fetch({url: API_HRES_VERIFY + `/${hresRecId}`, accessToken})
        .then((res) => {
          const {data: {status}} = res;
          console.log('handleConfirm: ', res);

          if (status === 200) {
            const {resource} = this.state;
            const newResource = resource.map((resourceItem) => {
              if (resourceItem.hresRecid === hresRecId) {
                resourceItem.isverify = 'Y';
                return resourceItem;
              }
              return resourceItem;
            });
            this.setState({
              resource: newResource
            }, () => {
              Taro.hideLoading();
            });
          }
        })
        .catch(() => {
          Taro.hideLoading();
        });
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
      this.fetchManpower(this._pageNum, this._pageSize, (data) => {
        this.setState({
          resource: data.list,
          refresherTriggered: false,
        }, () => {
          Taro.hideLoading();
          this._freshing = false;
        });
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

    this.fetchManpower(this._pageNum, this._pageSize, ({list, total, nextPage}) => {
      this.setState((prevState) => {
        const resourceLen = prevState.resource.length;
        const matrixResource = chunk(prevState.resource, this._pageSize);
        const mrLen = matrixResource.length;
        let newestResource;

        if (nextPage === 0) {
          this._pageNum = Math.floor(total / this._pageSize);
        }

        if (resourceLen === total) {
          matrixResource[mrLen - 1] = list;
          newestResource = matrixResource.flat();
        } else {
          if (Math.ceil(resourceLen / this._pageSize) === Math.ceil(total / this._pageSize)) {
            matrixResource[mrLen - 1] = list;
            newestResource = matrixResource.flat();
          } else {
            newestResource = prevState.resource.concat(list);
          }
        }

        console.log('matrixResource: ', matrixResource);

        return {
          resource: newestResource,
        };
      }, () => {
        Taro.hideLoading();
        this._loadMore = false;
      });
    });
  };

  render() {
    return (
      <View className='user-resource'>
        <ScrollView
          className='scroll-view'
          scrollY
          enableFlex={true}
          style={{height: getWindowHeight(false)}}

          refresherEnabled={true}
          refresherThreshold={100}
          // // lowerThreshold={100}
          scrollAnchoring={true}
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
          <View style={{height: `${Taro.getSystemInfoSync().windowHeight + 1}px`}}>
            <View className='placeholder'>微信小程序 ScrollView 全是 bug, 这是必不可少的占位元素</View>
            {this.renderResource()}
            <View className='footer'>用户底部撑开 ios 安全区使用</View>
          </View>
        </ScrollView>
        <AtModal
            className='is-check-user'
            isOpened={this.state.isOpened}
            title='是否审核该用户'
            cancelText='取消'
            confirmText='确认'
            onCancel={ this.handleCancel }
            onConfirm={ this.handleConfirm }
            content=''
            closeOnClickOverlay={false}
          />
      </View>
    );
  }
}

export default UserResource;
