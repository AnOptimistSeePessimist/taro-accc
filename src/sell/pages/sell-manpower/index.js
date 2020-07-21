import Taro, {Component} from '@tarojs/taro';
import {
  View,
  Text,
  Picker,
  Button
} from '@tarojs/components';
import {
  AtTag,
  AtForm,
  AtButton,
  AtList,
  AtListItem,
  AtInputNumber,
  AtModal,
  AtModalHeader,
  AtModalContent,
  AtModalAction,
  AtCheckbox,
} from 'taro-ui';
import classnames from 'classnames';
import {formatTimeStampToTime} from '@utils/common';
import {API_HRES_LIST, API_COMP_WORK_TYPE, API_RSPUBLISH_SAVE} from '@constants/api';
import fetch from '@utils/request';
import {connect} from '@tarojs/redux';
import intersectionWith from 'lodash.intersectionwith';

import './index.scss';

@connect(state => ({
  userInfo: state.user.userInfo,
}), {})
class SellManpower extends Component {
  constructor(props) {
    super(props);
    const date = new Date(); 
    date.setDate(date.getDate()  + 1);
    const nextDate = formatTimeStampToTime(date);

    this.state = {
      startDate: nextDate,
      endDate: nextDate,
      startTime: '08:00',
      endTimeList: ['12:00', '16:00'],
      endTimeIndex: 1,
      value: 10,
      workTypeList: Taro.getStorageSync('workType') || (new Array(8).fill)({}),
      checkedWorkTypeRecId: -1,
      isOpened: false, // 是否打开人员选择模态
      manpowerTitle: '', // 人员模态框标题
      manpower: [], // 当前模态框可选人力
      checkedManpower: [], // 选中的人力
      displayCheckedManpower: '' // 显示在界面中的人力
    };
  }

  componentDidMount() {
    console.log('workTypeList: ', this.state.workTypeList);
    if (this.state.workTypeList[0].typeRecId === undefined) {
      Taro.showLoading({
        title: '正在获取工种'
      });

      const {hresDto, userToken} = this.props.userInfo;

      fetch({
        url: API_COMP_WORK_TYPE + `/${hresDto.companyCode}`,
        accessToken: userToken.accessToken,
      })
        .then((res) => {
          const {data: {data}} = res;
          setTimeout(Taro.hideLoading, 1000);
          console.log('compWorkType: ', res);
          const workTypeList = data.map((item) => {
            item.checked = false;
            return item;
          });
          Taro.setStorageSync('workType', workTypeList);
          this.setState({
            workTypeList,
          });
        })
        .catch(() => {});
    }
  }

  config = {
    navigationBarTitleText: '出租人力'
  };

  onSubmit = e => {
    console.log('submit: ', e);
  };

  onReset = e => {

  };

  onStartDateChange = e => {
    this.setState({
      startDate: formatTimeStampToTime(e.detail.value)
    }, () => {
      if (this.state.startDate >= this.state.endDate) {
        this.setState({
          endDate: formatTimeStampToTime(e.detail.value)
        });
      }
    });
  };

  onStartTimeChange = e => {
    this.setState({
      startTime: e.detail.value
    }, () => {
      console.log('startTime: ', this.state.startTime);
      const time = this.state.startTime.split(':');
      const hour = time[0];
      const minute = time[1];
      const endTimeList = [];
      const workOneHour = Number(hour) + 4;
      const workTwoHour = Number(hour) + 8;
      const oneDay = 24;
      const workOne = (workOneHour.toString().length === 1 ? `0${workOneHour}` : (workOneHour >= oneDay ? ((workOneHour - 24).toString().length === 1 ? `0${workOneHour - oneDay}` : workOneHour - oneDay) : workOneHour)) + ':' + minute;
      const workTwo = (workTwoHour.toString().length === 1 ? `0${workTwoHour}` : (workTwoHour >= oneDay ? ((workTwoHour - 24).toString().length === 1 ? `0${workTwoHour - oneDay}` : workTwoHour - oneDay) : workTwoHour)) + ':' + minute;
      endTimeList.push(workOne, workTwo);
      this.setState({
        endTimeList,
        endTimeIndex: 1,
      });
    });
  };

  onEndDateChange = e => {
    this.setState({
      endDate: formatTimeStampToTime(e.detail.value)
    });
  };

  onEndTimeChange = e => {
    this.setState({
      endTimeIndex: e.detail.value
    });
  };

  handleValueChange = (value) => {
    this.setState({value});
  };

  setOpen = (isOpened) => {
    this.setState({
      isOpened
    });
  };

  handleCancel = () => {
    console.log('handleCancel');
    this.setState({
      isOpened: false,
    });
  };

  handleConfirm = () => {
    this.setOpen(false);
  };

  handleClickWorkType = (typeRecId) => {
    const {workTypeList, checkedWorkTypeRecId} = this.state;

    if (checkedWorkTypeRecId === typeRecId) {
      this.setOpen(true);
      return;
    }

    const newList = workTypeList.slice();
    let checkedWorkType;
    let currCheckedWorkTypeRecId;
    let manpowerTitle;

    newList.forEach((item) => {
      item.checked = false;
      if (item.typeRecId === typeRecId) {
        item.checked = true;
        manpowerTitle = item.workTypeName;
        checkedWorkType = item;
        currCheckedWorkTypeRecId = item.typeRecId;
      } 
    });


    this.setState({
      workTypeList: newList,
      manpowerTitle,
      checkedWorkTypeRecId: currCheckedWorkTypeRecId,
      checkedManpower: [],
      displayCheckedManpower: '',
    }, () => {
      this.fetchManpower(checkedWorkType);
    });
  };

  fetchManpower = (checkedWorkType) => {
    Taro.showLoading({title: `正在获取${checkedWorkType.workTypeName}`});
    const {hresDto: {companyCode}, userToken: {accessToken}} = this.props.userInfo;
    fetch({url: API_HRES_LIST + `?companyCode=${companyCode}&worktypeRecid=${checkedWorkType.typeRecId}`, accessToken})
      .then((res) => {
        Taro.hideLoading();
        console.log('获取人力资源: ', res);
        const newManpower = (res.data.data.list || []).map((item) => {
          item.label = item.name;
          item.value = item.hresRecid;
          return item;
        });
        this.setState({
          manpower: newManpower,
        }, () => {
          console.log('setOpen 方法已经执行');
          this.setOpen(true);
        });
      })
      .catch(() => {});
  };

  handleManpowerChange = (checkedManpower) => {
    console.log('handleManpowerChange: ', checkedManpower);
    const {manpower} = this.state;
    const newCheckedManpower = checkedManpower.map(value => ({hresRecid: value}));


    const newIntersection = intersectionWith(manpower, newCheckedManpower, function (arrVal, othVal) {
      return arrVal.hresRecid === othVal.hresRecid;
    });

    const manpowerName =  newIntersection.map(item => item.name);

    console.log('newIntersection: ', newIntersection);

    this.setState({
      checkedManpower,
      displayCheckedManpower: manpowerName.toString()
    });
  };

  // 发布人力
  release = () => {
    const {
      startDate, 
      endDate,
      startTime, 
      endTimeList, 
      endTimeIndex, 
      checkedWorkTypeRecId,
      value,
      checkedManpower,
    } = this.state;
    const {userInfo: {auth: {id}, userToken: {accessToken}}} = this.props;
    const payload = {
      dateStart: startDate,
      dateEnd: endDate,
      timeStart: startTime + ':00',
      timeEnd: endTimeList[endTimeIndex] + ':00',
      worktype: checkedWorkTypeRecId,
      price: value,
      rsId: checkedManpower.toString(),
      rsNum: checkedManpower.length,
      contentType: 1,
      publishBy: id,
      publishType: 1,  
      iscancel: 'N'
    };

    console.log('发布的数据: ', payload);

    Taro.showLoading({
      title: '正在发布人力中',
    });

    fetch({
      url: API_RSPUBLISH_SAVE,
      method: 'POST',
      payload,
      accessToken,
    })
      .then((res) => {
        const {status, data} = res.data;
        
        Taro.hideLoading();

        if (status === 200) {
          this.$preload('data', data);
          Taro.navigateTo({
            url: '/pages/sell-manpower-success/index'
          });
        }

        console.log('发布成功返回数据: ', res);
      })
      .catch((e) => {
        Taro.hideLoading();
        Taro.showToast({
          title: '人力发布失败',
          icon: 'success',
          duration: 2000,
        });
      });
  }

  render() {
    return (
      <View className='sell-manpower'>
        <View className='wrapper'>
          <AtForm
            onSubmit={this.onSubmit}
            onReset={this.onReset}
            className='form'
          >
            <View className='category'>
              <View className='at-article__h3'>工种</View>
                <View className='tag-wrapper'>
                  {
                    this.state.workTypeList.filter((item) => {
                      return item.workTypeName !== "销售员";
                    })
                    .map((item) => {
                      return (
                        <AtTag
                          key={item.typeRecId}
                          className={classnames('tag', item.checked && 'tag-active')}
                          active={item.checked}
                          type='primary'
                          onClick={() => this.handleClickWorkType(item.typeRecId)}
                        >
                          {item.workTypeName}
                        </AtTag>
                      );
                    })
                  }
                </View>
            </View>
            <View className='manpower'>
              <View
                className='manpower-label'
                onClick={() => {
                  if (this.state.manpower.length === 0) {
                    Taro.showToast({title: '请选择职业', icon: 'none'});
                    return;
                  }
                  this.setOpen(true);
                }}
              >
                人员 <Text>{this.state.displayCheckedManpower}</Text>
              </View>
              <AtModal
                isOpened={this.state.isOpened}
                closeOnClickOverlay={true}
              >
                  <AtModalHeader>{this.state.manpowerTitle}</AtModalHeader>
                  <AtModalContent className='at-modal-content'>
                    <View className='manpower-list'>
                      <AtCheckbox
                        className='curr-at-checkbox'
                        options={this.state.manpower}
                        selectedList={this.state.checkedManpower}
                        onChange={this.handleManpowerChange}
                      />
                    </View>
                  </AtModalContent>
                  <AtModalAction>
                    {/* <Button onClick={() => this.handleCancel()}>取消</Button> */}
                    <Button onClick={() => this.handleConfirm()}>确定</Button>
                  </AtModalAction>
              </AtModal>
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
                value={this.state.value}
                onChange={this.handleValueChange}
              />
            </View>
            <AtButton className='release' formType='submit' onClick={this.release}>立即发布</AtButton>
          </AtForm>
        </View>
    </View>
    );
  }
}

export default SellManpower;