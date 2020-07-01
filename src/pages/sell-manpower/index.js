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
  AtModalAction,
} from 'taro-ui';
import classnames from 'classnames';
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
      list: [
        {
          id: 1,
          value: '1',
          text: '装卸工',
          checked: false,
          manpower: [
            {id: 1, value: '1', text: '张一', checked: false},
            {id: 2, value: '2', text: '李一', checked: false},
            {id: 3, value: '3', text: '王一', checked: false},
            {id: 4, value: '4', text: '赵一', checked: false},
          ],
        },
        {
          id: 2,
          value: '2',
          text: '叉车司机',
          checked: false,
          manpower: [
            {id: 1, value: '1', text: '张二', checked: false},
            {id: 2, value: '2', text: '李二', checked: false},
            {id: 3, value: '3', text: '王二', checked: false},
          ],
        },
        {
          id: 3,
          value: '3',
          text: '组板工',
          checked: false,
          manpower: [
            {id: 1, value: '1', text: '张三', checked: false},
            {id: 2, value: '2', text: '李三', checked: false},
          ],
        },
        {
          id: 4,
          value: '4',
          text: '杂工',
          checked: false,
          manpower: [
            {id: 1, value: '1', text: '张四', checked: false},
          ],
        },
      ],
      isOpened: false, // 是否打开人员选择模态
      manpowerTitle: '', // 人员模态框标题
      manpower: [], // 当前模态框可选人力
      checkedManpower: [], // 选中的人力
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

  handleClickCatogory = (category) => {
    const {list} = this.state;
    const newList = list.slice();
    newList.forEach((item) => {
      if (item.id === category) {
        let manpower;
        let manpowerTitle = '';
        item.checked = !item.checked;
        if (item.checked === false) {
          manpower = [];
        } else {
          manpower = item.manpower;
          manpowerTitle = item.text;
        }
        this.setState({
          list: newList,
          manpower,
          manpowerTitle,
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
            <View className='manpower'>
              <View
                className='manpower-label'
                onClick={() => {
                  if (this.state.manpower.length === 0) {
                    Taro.showToast({title: '请选择工种', icon: 'none'});
                    return;
                  }
                  this.setOpen(true);
                }}
              >人员</View>
              <AtModal
                isOpened={this.state.isOpened}
                closeOnClickOverlay={false}
              >
                  <AtModalHeader>{this.state.manpowerTitle}</AtModalHeader>
                  <AtModalContent>
                    <View className='manpower-list'>
                      {this.state.manpower.map((item, i) => {
                        return (
                          <View className='manpower-checkbox-wrapper' key={item.value}>
                            <Label className='manpower-checkbox-label' for={i}>
                              <Checkbox color='#fe871f' className='checkbox-list__checkbox' value={item.value} checked={item.checked}>{item.text}</Checkbox>
                            </Label>
                          </View>
                        )
                      })}
                    </View>
                  </AtModalContent>
                  <AtModalAction>
                    <Button onClick={() => this.handleCancel()}>取消</Button>
                    <Button onClick={() => this.handleConfirm()}>确定</Button>
                  </AtModalAction>
              </AtModal>
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
