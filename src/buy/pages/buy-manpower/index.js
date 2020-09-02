import Taro, {Component} from '@tarojs/taro';
import {
  View,
  Text,
  Picker,
} from '@tarojs/components';
import {
  AtTag,
  AtForm,
  AtButton,
  AtList,
  AtListItem,
  AtInputNumber,
} from 'taro-ui';
import {API_WORK_TYPE_DISTINCT, API_RSPUBLISH_LIST} from '@constants/api'
import {formatTimeStampToTime} from '@utils/common';
import {connect} from '@tarojs/redux'
import fetch from '@utils/request';
import classnames from 'classnames';
import './index.scss';

@connect(state => ({
  userInfo: state.user.userInfo,
}))
class BuyManpower extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: formatTimeStampToTime(Date.now()),
      startTime: '08:00',
      endTime: '16:00',
      value: '1',
      workTypeList: new Array(8).fill({}),
    };
  }

  config = {
    navigationBarTitleText: '人力查询'
  };

  componentWillMount(){
    this.workType()
  }

  onSubmit = e => {
    console.log('submit: ', e);
  };

	submit = () => {
    //Taro.navigateTo({ url: `/buy/pages/buy-manpower-information/index?buyData=${JSON.stringify(buyData)}` })
    let workTypeName 
    this.state.workTypeList.map(item => {
      if(item.checked){
        workTypeName = item.workTypeName
      }
    })
    // const workTypeName=this.state.workTypeList.filter(item => item.checked === true).map(item => {
    //   return item.workTypeName
    // })
    console.log('workTypeName',workTypeName)
    fetch({
      url: API_RSPUBLISH_LIST + `?contentType=1&dateStart=${this.state.date}&worktypeName=${workTypeName}`
    })
    .then(res => {
      const {data: {data, status, message}} = res
      if(status === 200){
        if(data.list.length ===0){
          Taro.showToast({
            icon: "none",
            title: '没有人力数据',
            duration: 2000
          })
          return
        }
        this.$preload('item', data.list)
        this.$preload('workTypeName', workTypeName)
        Taro.navigateTo({ url: `/buy/pages/buy-manpower-information/index`})
      } else {
        Taro.showToast({
          icon: "none",
          title: message,
          duration: 2000
        })
      }
    })
  }
  
  workType = () => {
    fetch({
      url: API_WORK_TYPE_DISTINCT,
    })
      .then((res) => {
        const {data: {data}} = res;
        console.log('compWorkType: ', res);
        const workTypeList = data.map((item) => {
          item.checked = false;
          return item;
        });
        this.setState({
          workTypeList,
        });
      })
      .catch(() => {});
  }

  onDateChange = e => {
    this.setState({
      date: e.detail.value
    });
  };

  onStartTimeChange = e => {
    this.setState({
      startTime: e.detail.value
    });
  };

  onEndTimeChange = e => {
    this.setState({
      endTime: e.detail.value
    });
  };

  handleValueChange = (value) => {
    this.setState({value});
  };

  handleClickWorkType = (typeRecId) => {
    const {workTypeList} = this.state;
    const newList = workTypeList.slice(); 
    newList.forEach((item) => {
      item.checked = false;
      if (item.typeRecId === typeRecId) {
        item.checked = true;
      }
    });

    this.setState({
      workTypeList: newList,
    });
  };

  render() {
    return (
      <View className='buy-manpower'>
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
                    this.state.workTypeList.map((item) => {
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
          
            <Picker
              className='date'
              mode='date'
              onChange={this.onDateChange}
              start={formatTimeStampToTime(Date.now())}
            >
              <AtList className='date-at-list'>
                <AtListItem className='item' title='请选择日期' extraText={this.state.date} />
              </AtList>
            </Picker>
            <Picker value={this.state.startTime} className='work-time' mode='time' onChange={this.onStartTimeChange}>
              <AtList className='start-list'>
                <AtListItem className='start' title='开始工作时间' extraText={this.state.startTime} />
              </AtList>
            </Picker>
            <Picker value={this.state.endTime} className='out-of-work-time' mode='time' onChange={this.onEndTimeChange}>
              <AtList className='end-list'>
                <AtListItem className='end' title='结束工作时间' extraText={this.state.endTime} />
              </AtList>
            </Picker>
            <View className='setting-spec'>
              <Text>员工数量</Text>
              <AtInputNumber
                className='at-input-number'
                min={1}
                max={1000}
                step={1}
                value={this.state.value}
                onChange={this.handleValueChange}
              />
            </View>
            <AtButton className='release' formType='submit' onClick={this.submit}>查询</AtButton>
          </AtForm>
        </View>
      </View>
    );
  }
}

export default BuyManpower;
