import Taro, {Component} from '@tarojs/taro';
import {View, Text, Picker} from '@tarojs/components';
import { AtButton, AtNavBar, AtList, AtListItem, AtInputNumber } from 'taro-ui';
import {formatTimeStampToTime} from '@utils/common';

import './index.scss';

class UserReleaseDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      publishDetail: {},
      previousViewFlag: undefined,
      startDate: '', //
      endDate: '', //
      startTime: '', //
      endTimeList: [],
      endTimeIndex: -1,
      value: '', //
      displayCheckedManpower: '',
    };
  }

  config = {
    navigationBarTitleText: '发布详情',
    navigationStyle: 'custom',
  };

  componentWillMount() {
  }


  getEndTimeWithStartTime = (startTime) => {
    const time = startTime.split(':');
    const hour = time[0];
    const minute = time[1];
    const endTimeList = [];
    const workOneHour = Number(hour) + 4;
    const workTwoHour = Number(hour) + 8;
    const oneDay = 24;
    const workOne = (workOneHour.toString().length === 1 ? `0${workOneHour}` : (workOneHour >= oneDay ? ((workOneHour - 24).toString().length === 1 ? `0${workOneHour - oneDay}` : workOneHour - oneDay) : workOneHour)) + ':' + minute;
    const workTwo = (workTwoHour.toString().length === 1 ? `0${workTwoHour}` : (workTwoHour >= oneDay ? ((workTwoHour - 24).toString().length === 1 ? `0${workTwoHour - oneDay}` : workTwoHour - oneDay) : workTwoHour)) + ':' + minute;
    endTimeList.push(workOne, workTwo);
    console.log('endTimeList: ', endTimeList);
    return endTimeList;
  };


  componentDidMount() {
    console.log('UserReleaseDetails -preload: ', this.$router.preload);
    const flag = this.$router.preload.flag;
    const publishItem = this.$router.preload.data;
    const publishDetail = flag === 1 ? publishItem.rspublishDto : publishItem;
    const {dateStart, dateEnd, timeStart, timeEnd, price, workTypeName, rsId} = publishDetail;
    const timeStartList = timeStart.split(':');
    const startTime = timeStartList[0] + ':' + timeStartList[1];
    const timeEndList = timeEnd.split(':');
    const endTime = timeEndList[0] + ':' + timeEndList[1];
    const endTimeList = this.getEndTimeWithStartTime(startTime);
    console.log('publishDetail: ', publishDetail);
    this.setState({
      publishDetail,
      previousViewFlag: this.$router.preload.flag,
      startDate: dateStart,
      endDate: dateEnd,
      startTime,
      endTimeList,
      endTimeIndex: endTimeList.findIndex(item => item === endTime),
      value: price,
      category: workTypeName,
      displayCheckedManpower: rsId,
    });
  }

  onStartDateChange = () => {

  };

  onEndDateChange = () => {

  };

  onStartTimeChange = () => {};
  onEndTimeChange = () => {};
  handleValueChange = () => {};

  render() {
    const {safeArea = {}, statusBarHeight} = Taro.getSystemInfoSync();
    console.log('Taro.getSystemInfoSync(): ', Taro.getSystemInfoSync().statusBarHeight);
    const navStyle = {
      'width': '100%',
      'background-color': '#fe871f',
      // Taro.pxTransform(
      'height':  statusBarHeight + 'px',
    };
    return (
      <View className='user-release-details'>
        <View style={navStyle} />
        <AtNavBar
          className="nav-bar"
          leftIconType="chevron-left"
          // onClickRgIconSt={() => {}}
          // onClickRgIconNd={() => {}}
          onClickLeftIcon={() => {
            if (this.state.previousViewFlag === 1) {
              Taro.navigateBack();
            } else {
              Taro.switchTab({
                url: '/pages/user/index',
              });
            }
          }}
          color='white'
          // title='NavBar 导航栏示例'
          // leftText='返回'
          // rightFirstIconType='bullet-list'
          // rightSecondIconType='user'
        >
          <Text className='nav-bar-title'>发布详情</Text>
        </AtNavBar>
        <View className='form-wrapper'>
          <View className='category'>
            <View className='at-article__h3'>工种</View>
            <View className='tag-wrapper'>{this.state.category}</View>
          </View>
          <View className='manpower'>
              <View
                className='manpower-label'
              >
                人员: <Text>{this.state.displayCheckedManpower}</Text>
              </View>
            </View>
          <Picker
            className='start-date'
            mode='date'
            onChange={this.onStartDateChange}
            value={this.state.startDate}
            start={formatTimeStampToTime(Date.now())}
          >
            <AtList className='start-date-at-list'>
              <AtListItem className='start-item' title='开始日期' extraText={this.state.startDate} />
            </AtList>
          </Picker>
          <Picker
            className='end-date'
            mode='date'
            start={this.state.startDate}
            onChange={this.onEndDateChange}
            value={this.state.endDate}
          >
            <AtList className='end-date-at-list'>
              <AtListItem className='end-item' title='结束日期' extraText={this.state.endDate} />
            </AtList>
          </Picker>
          <Picker
            value={this.state.startTime}
            className='work-time'
            mode='time'
            onChange={this.onStartTimeChange}
          >
            <AtList className='start-list'>
              <AtListItem className='start' title='开始时间' extraText={this.state.startTime} />
            </AtList>
          </Picker>
          <Picker
            value={this.state.endTimeIndex}
            range={this.state.endTimeList}
            className='out-of-work-time'
            mode='selector'
            onChange={this.onEndTimeChange}
          >
            <AtList className='end-list'>
              <AtListItem className='end' title='结束时间' extraText={this.state.endTimeList[this.state.endTimeIndex]} />
            </AtList>
          </Picker>
          <View className='setting-spec'>
            <Text>单价(每小时)</Text>
            <AtInputNumber
              className='at-input-number'
              min={0}
              max={1000}
              step={10}
              disabledInput={true}
              value={this.state.value}
              onChange={this.handleValueChange}
            />
          </View>
        </View>
      </View>
    );
  }
}

export default UserReleaseDetails;
