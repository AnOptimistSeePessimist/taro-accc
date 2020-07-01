import Taro, {Component} from '@tarojs/taro';
import {connect} from '@tarojs/redux';
import {View, Text, Picker} from '@tarojs/components';
import { AtInput, AtForm, AtList, AtListItem} from 'taro-ui';
import fetch from '@utils/request';
import {API_COMPANY_ALL} from '@constants/api';

import './index.scss';

@connect(state => state.user, {})
class UserInfomation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      companyList: [],
      checkedCompany: '',
    };
  }

  componentDidMount() {
    this.retrieveAllCompany();
    console.log('UserInformation-props: ', this.props);
  }

  retrieveAllCompany = () => {
    fetch({url: API_COMPANY_ALL, accessToken: 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxODM1MDg2MzIzNiIsImV4cCI6MTU5MzgyNzc4MX0.n9YLma_3_ARl4iWRxtBlwF-KL-R4gf1XLmn4r2VLZ2E' || this.props.userInfo.userToken.accessToken})
      .then((res) => {
        console.log('所有公司: ', res);
        const {data: {data}} = res;
        const companyList = data.slice();
        companyList.splice(0, 0, {companyId: -1, companyCode: 'X', companyName: 'X'});
        this.setState({
          companyList
        })
      });
  };


  config = {
    navigationBarTitleText: '个人信息'
  }

  onChange = e => {
    this.setState({
      checkedCompany: this.state.companyList[e.detail.value].companyName
    })
  }

  render() {
    return (
      <View className='user-information'>
          <AtForm className='form'>
            <View className='page-section'>
              <View>
                <Picker 
                  mode='selector' 
                  range={this.state.companyList} 
                  rangeKey='companyName'
                  onChange={this.onChange}
                  // value={3}
                  >
                  <AtList>
                    <AtListItem
                      className='at-list-item'
                      title='所属公司'
                      extraText={this.state.checkedCompany}
                    />
                  </AtList>
                </Picker>
              </View>
            </View>
            <AtInput
              className='margin-to-padding'
              title='姓名'
              type='text'
              border={false}
              placeholder='姓名'
              // value={this.state.value5}
              // onChange={this.handleInput.bind(this)}
            />
            <AtInput
              className='margin-to-padding'
              title='年龄'
              type='text'
              // border={false}
              placeholder='年龄'
              // value={this.state.value5}
              // onChange={this.handleInput.bind(this)}
            />
            <AtInput
              className='margin-to-padding id'
              title='身份证号'
              type='text'
              placeholder='身份证号'
              // value={this.state.value5}
              // onChange={this.handleInput.bind(this)}
            />
            <AtInput
              className='margin-to-padding'
              title='通行证适用区域'
              type='text'
              border={false}
              placeholder='通行证适用区域'
              // value={this.state.value5}
              // onChange={this.handleInput.bind(this)}
            />
          </AtForm>
        </View>
    );
  }
}

export default UserInfomation;
