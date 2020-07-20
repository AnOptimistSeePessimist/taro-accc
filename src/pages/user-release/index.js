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
              <Text className='data-start-end'>{dateStart} 至 {dateEnd}</Text>
              <Text className='time-start-end'>{timeStart} 至 {timeEnd}</Text>
              {/* <Text>人员: {rsId}</Text> */}
              {/* <Text>是否已作废: {iscancel}</Text> */}
            </View>
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
