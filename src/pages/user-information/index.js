import Taro, {Component} from '@tarojs/taro';
import {connect} from '@tarojs/redux';
import {
  View, 
  Text, 
  Picker, 
  Button
} from '@tarojs/components';
import {
  AtInput,
  AtForm,
  AtList,
  AtListItem,
  AtModal,
  AtModalHeader,
  AtModalContent,
  AtModalAction,
  AtTag
} from 'taro-ui';
import fetch from '@utils/request';
import {API_COMPANY_ALL, API_USER_BIND_COMPANY_ROLE} from '@constants/api';
import classnames from 'classnames';
import {
  compWorkType,
  dispatchCompWorkType
} from '@actions/compWorkType';

import './index.scss';
import { API_USER_REGISTER } from 'src/constants/api';

const accessToken = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxODM1MDg2MzIzNiIsImV4cCI6MTU5Mzg1NTc0NX0.hbeBbBTa0gWZ9wNi052wHKQYx62RhISQvj0BQiV4t30';

@connect(state => ({
  userInfo: state.user.userInfo,
  compWorkType: state.compWorkType
}), (dispatch) => ({
  dispatchGetCompWorkType(payload) {
    dispatch(compWorkType(payload));
  },
  dispatchCompWorkTypeProp() {
    dispatch(dispatchCompWorkType([]));
  }
}))
class UserInfomation extends Component {
  constructor(props) {
    super(props);
    console.log('UserInformation: ', props);
    this.state = {
      companyList: [],
      checkedCompany: '',
      isOpened: false,
      compWorkTypes: [],
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (state.compWorkTypes !== props.compWorkType) {
      console.log('getDerivedStateFromProps: ', props.compWorkType);
      return {
        compWorkTypes: props.compWorkType,
      };
    }
    return null;
  }

  componentDidMount() {
    this.retrieveAllCompany(); 
  }

  retrieveAllCompany = () => {
    Taro.showLoading({
      title: '获取公司数据中',
      mask: true,
    });

    fetch({
      url: API_COMPANY_ALL,
      accessToken: (this.props.userInfo.userToken && this.props.userInfo.userToken.accessToken) || accessToken
    })
      .then((res) => {
        Taro.hideLoading();
        console.log('所有公司: ', res);
        const {data: {data}} = res;
        const companyList = data.slice();
        companyList.splice(0, 0, {companyId: -1, companyCode: '', companyName: ''});
        this.setState({
          companyList
        })
      });
  };


  config = {
    navigationBarTitleText: '个人信息'
  }

  onChangeCompany = e => {
    this.setState({
      checkedCompany: this.state.companyList[e.detail.value].companyName,
      // checkedCompanyId: 
    }, () => {
      if (e.detail.value == 0) {
        this.props.dispatchCompWorkTypeProp();
      } else {
        this.props.dispatchGetCompWorkType({
          companyCode: this.state.companyList[e.detail.value].companyCode,
          accessToken:  (this.props.userInfo.userToken && this.props.userInfo.userToken.accessToken) || accessToken
        });
      }
    });
  };

  handleClickCatogory = () => {

  };

  save = () => {

  };

  bindCompanyRole = () => {
    fetch({url: API_USER_BIND_COMPANY_ROLE + `?companyId=${companyId}&roleId=${roleId}`})
      .then((res) => {})
      .catch(() => {});
  };

  handleClickWorkType = (typeRecId) => {
    const {compWorkTypes} = this.state;
    const newCompWorkType = compWorkTypes.slice();
    newCompWorkType.forEach((item) => {
      if (item.typeRecId === typeRecId) {
        item.checked = !item.checked;
      } else {
        item.checked = false;
      }
      this.setState({
        compWorkTypes: newCompWorkType,
      });
    });
  };

  render() {
    return (
      <View className='user-information'>
          <AtForm className='form'>
            <Picker
              mode='selector'
              range={this.state.companyList}
              rangeKey='companyName'
              onChange={this.onChangeCompany}
              value={0}
            >
              <AtList className='at-list-company'>
                <AtListItem
                  className='at-list-item'
                  title='所属公司'
                  extraText={this.state.checkedCompany}
                />
              </AtList>
            </Picker>
            <View>
              <AtInput
                className='margin-to-padding'
                title='工种'
                type='text'
                editable={false}
                border={false}
                value=''
                onClick={() => {
                  if (this.props.compWorkType.length === 0) {
                    Taro.showToast({
                      title: '该公司无任何工种信息',
                      icon: 'none',
                    });
                    return;
                  }
                  this.setState({
                    isOpened: true,
                  });
                }}
              />
              <AtModal isOpened={this.state.isOpened} closeOnClickOverlay={false}>
                <AtModalHeader>请选择工种</AtModalHeader>
                <AtModalContent>
                  <View className='tag-wrapper'>
                    {
                      this.state.compWorkTypes.map((item) => {
                        return (
                          <AtTag
                            key={item.typeRecId}
                            className={classnames('tag', item.checked && 'tag-active')}
                            active={item.checked}
                            type='primary'
                            onClick={() => this.handleClickWorkType(item.typeRecId, item.roleId)}
                          >
                            {item.workTypeName}
                          </AtTag>
                        );
                      })
                    }
                  </View>
                </AtModalContent>
                <AtModalAction>
                  <Button onClick={() => {
                    this.setState({isOpened: false});
                  }}
                  >
                    取消
                  </Button>
                  <Button onClick={() => {
                    this.setState({isOpened: false});
                  }}
                  >
                    保存
                  </Button>
                </AtModalAction>
              </AtModal>
            </View>
          </AtForm>
          {
            true && (
              <View>
              <AtForm className='form'>
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
              <Button className='button' onClick={this.save}>
                保存
              </Button>
            </View>
            )
          }
        </View>
    );
  }
}

export default UserInfomation;
