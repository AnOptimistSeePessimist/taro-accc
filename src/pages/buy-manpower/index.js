import Taro, {Component} from '@tarojs/taro';
import {
  View,
  Text,
  Picker,
  RadioGroup,
  Label,
  Radio,
  Checkbox,
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
  AtModalAction
} from 'taro-ui';
import classnames from 'classnames';
import {formatTimeStampToTime} from '@utils/common';

import './index.scss';

class BuyManpower extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: formatTimeStampToTime(Date.now()),
      startTime: '08:00',
      endTime: '16:00',
      value: '1',
      list: [
        {
          id: 1,
          value: '1',
          text: '装卸工',
          checked: false,
        },
        {
          id: 2,
          value: '2',
          text: '叉车司机',
          checked: false,
        },
        {
          id: 3,
          value: '3',
          text: '组板工',
          checked: false,
        },
        {
          id: 4,
          value: '4',
          text: '杂工',
          checked: false,
        },
      ]
    };
  }

  config = {
    navigationBarTitleText: '出租人力'
  };

  onSubmit = e => {
    console.log('submit: ', e);
  };

	submit = () => {
		const {date, startTime, endTime, value, list} = this.state;
		const buyData = { date: date, startTime: startTime, endTime: endTime, workersNum: value, list: list }
		Taro.navigateTo({ url: `/pages/buy-manpower-information/index?buyData=${JSON.stringify(buyData)}` })
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

  handleClickCatogory = (category) => {
    const {list} = this.state;
    const newList = list.slice();
    newList.forEach((item) => {
      if (item.id === category) {
        item.checked = !item.checked;
        this.setState({
          list: newList,
        });
      } else {
        item.checked = false;
        this.setState({
          list: newList,
        });
      }
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
                    this.state.list.map((item) => {
                      return (
                        <AtTag
                          key={item.value}
                          className={classnames('tag', item.checked && 'tag-active')}
                          active={item.checked}
                          type='primary'
                          onClick={() => this.handleClickCatogory(item.id)}
                        >
                          {item.text}
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
