import Taro, {Component} from '@tarojs/taro';
import {View, Text, Picker} from '@tarojs/components';
import {AtForm, AtInput, AtButton, AtList, AtListItem, AtInputNumber} from 'taro-ui';
import {formatTimeStampToTime} from '@utils/common';

import './index.scss';

class SellManpower extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: formatTimeStampToTime(Date.now()),
      startTime: '08:00',
      endTime: '16:00',
      value: '10',
    };
  }

  config = {
    navigationBarTitleText: '出租人力'
  };

  onSubmit = e => {
    console.log('submit: ', e);
  };

  onReset = e => {

  };

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

  render() {
    return (
      <View className='sell-manpower'>
        <View className='wrapper'>
          <AtForm
            onSubmit={this.onSubmit}
            onReset={this.onReset}
            className='form'
          >
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
            <AtButton className='release' formType='submit'>立即发布</AtButton>
          </AtForm>
        </View>
      </View>
    );
  }
}

export default SellManpower;
