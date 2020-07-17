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
    };
  }

  config = {
    navigationBarTitleText: '我的发布',
  };

  componentDidMount() {
    fetch({url: API_RSPUBLISH_LIST, accessToken: this.props.userInfo.userToken.accessToken})
      .then((res) => {
        console.log('publishList: ', res);
        const {data: {data: {list}, status}} = res;

        if (status === 200) {
          if (list.length !== 0) {
            this.setState({
              publishList: list,
            });
          }
        }

      })
      .catch(() => {});
  }

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
              url: '/pages/user-release-details/index'
            });
          }}
        >
          <View className='left-image'>
          <Image
            className='image'
            src={getRandomImage()}
          />
          </View>
          <View className='right-information'>
            <View className='dollar-worker-date-time'>
              {/* <View className={`iconfont iconqian img`}></View> */}
              <View className='dollar'>￥{price}</View>
            </View>
            
            <View className='dollar-worker-date-time'>
              {/* <View className={`iconfont iconrenyuan img`}></View> */}
              <View className='worker'>{workTypeName}</View>
            </View>
            <View className='dollar-worker-date-time'>
              {/* <View className={`iconfont iconrili img`}></View> */}
              <View className='data-start-end'>{dateStart} 至 {dateEnd}</View>
            </View>
            <View className='dollar-worker-date-time'>
              {/* <View className={`iconfont icontime img`}></View> */}
              <View className='time-start-end'>{timeStart} 至 {timeEnd}</View>
            </View>
            
            
            {/* <Text>开始日期: </Text> */}
            {/* <Text className='time-start-end'>时间范围: {timeStart} 至 {timeEnd}</Text> */}
            {/* <Text>结束时间</Text> */}
            {/* <Text>是否已作废: {iscancel}</Text> */}
            {/* <Text>人员: {rsId}</Text> */}
          </View>
        </View>
      );
    });
  };

  render() {
    const {publishList} = this.state;
    return (
      <ScrollView 
        className='user-release'
        scrollY
        style={{height: getWindowHeight()}}
      >
        {publishList.length !== 0 && this.renderItem()}
      </ScrollView>
    );
  }
}

export default UserRelease;
