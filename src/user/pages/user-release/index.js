import Taro, {Component} from '@tarojs/taro';
import {View, Text, Image, ScrollView} from '@tarojs/components';
import {connect} from '@tarojs/redux';
import fetch from '@utils/request';
import {API_RSPUBLISH_LIST} from '@constants/api';
import { getWindowHeight } from '@utils/style';

import './index.scss';

function getRandomImage() {
  return `https://picsum.photos/seed/${Math.ceil(Math.random() * 100)}/100/100`;
}

@connect(state => ({userInfo: state.user.userInfo}), {})
class UserRelease extends Component {
  constructor(props) {
    super(props);
    this.state = {
      publishList: [], // 发布列表
      refresherTriggered: false, // 刷新器被触发
    };
  }

  config = {
    navigationBarTitleText: '我的发布',
  };

  componentDidMount() {
    this.onRefresherRefresh();
  }

  getReleaseData = (pageNum, pageSize, callback) => {
    fetch({url: API_RSPUBLISH_LIST + `?pageNum=${pageNum}&pageSize=${pageSize}`, accessToken: this.props.userInfo.userToken.accessToken})
      .then((res) => {
        console.log('publishList: ', res);
        const {data: {data: {list}, status}} = res;

        if (status === 200) {
          callback(list);
        }
      })
      .catch(() => {
      });
  };

  renderItem = () => {
    console.log('renderItem');
    const {publishList} = this.state;
    return publishList.map((publish, key) => {
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
            workTypeName,
            workdateList,
          }
      } = publish;
      return (
        <View
          className='publish-item'
          key='a'
          style={{'padding-bottom': key === publishList.length - 1 ? Taro.pxTransform(15) : '0px'}}
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
              src={getRandomImage()}
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
      );
    });
  };

  onRefresherRefresh = () => {
    this.setState({
      refresherTriggered: true,
    }, () => {
      this.getReleaseData(1, 5, (list) => {
        if (list.length !== 0) {
          this.setState({
            publishList: list,
          }, () => {
            this.setState({
              refresherTriggered: false,
            })
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

  scrollToLower = () => {
    console.log('scrollToLower');
  };

  render() {
    const {publishList} = this.state;
    const systemInfo = Taro.getSystemInfoSync();
    const paddingBottom = systemInfo.safeArea == undefined ? 0 : systemInfo.screenHeight - systemInfo.safeArea.bottom;
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
          this.onRefresherRefresh();
        }}
        enableBackToTop={true}
        onScrollToLower={this.scrollToLower}
      >
        {this.renderItem()}
      </ScrollView>
    );
  }
}

export default UserRelease;
