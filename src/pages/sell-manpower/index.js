import Taro, {Component} from '@tarojs/taro';
import {View, Text, Picker} from '@tarojs/components';
import {AtForm, AtInput, AtButton, AtList, AtListItem} from 'taro-ui';
import {formatTimeStampToTime} from '@utils/common';

import './index.scss';

class SellManpower extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: formatTimeStampToTime(Date.now()),
    };
  }

  config = {
    navigationBarTitleText: '出租人力'
  };

  onSubmit = e => {

  };

  onReset = e => {

  };

  onDateChange = e => {
    this.setState({
      date: e.detail.value
    });
  };

  render() {
    return (
      <View className='sell-manpower'>
        <View className='wrapper'>
          {/* <AtForm
            onSubmit={this.onSubmit}
            onReset={this.onReset}
            className='form'
          > */}
            <Picker 
              className='date' 
              mode='date' 
              onChange={this.onDateChange} 
              start={formatTimeStampToTime(Date.now())}
            >
              <AtList>
                <AtListItem title='请选择日期' extraText={this.state.date} />
              </AtList>
            </Picker>
            <Picker className='workTime' mode='time' onChange={this.onTimeChange}>
              <AtList>
                <AtListItem title='请选择日期' extraText={''} />
              </AtList>
            </Picker>
            {/* <Picker className='outOfWorkTime' mode='time' onChange={this.onTimeChange}>
              <AtList>
                <AtListItem title='请选择日期' extraText={''} />
              </AtList>
            </Picker> */}
          {/* </AtForm> */}
        </View>
      </View>
    );
  }
}

export default SellManpower;
