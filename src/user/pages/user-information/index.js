import Taro, {Component} from '@tarojs/taro';
import {connect} from '@tarojs/redux';
import {
  View,
  Text,
  Picker,
  Button,
  ScrollView,
  CheckboxGroup,
  Checkbox,
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
  AtTag,
  AtFloatLayout
} from 'taro-ui';
import fetch from '@utils/request';
import {
  API_COMPANY_ALL,
  API_USER_BIND_COMPANY_ROLE,
  API_PASSAREA_ALL,
  API_USER_USERDETAIL,
  API_CARGOSTATION_LIST
} from '@constants/api';
import classnames from 'classnames';
import {
  compWorkType,
  dispatchCompWorkType
} from '@actions/compWorkType';
import {dispatchLogin} from '@actions/user';
import cloneDeep from 'lodash.clonedeep';

import './index.scss';

const accessToken = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxODM1MDg2MzIzNiIsImV4cCI6MTU5Mzg1NTc0NX0.hbeBbBTa0gWZ9wNi052wHKQYx62RhISQvj0BQiV4t30';

const sexList = [
  {name: '女', code: 'F'},
  {name: '男', code: 'M'}
];

@connect(state => ({
  userInfo: state.user.userInfo,
  compWorkType: state.compWorkType
}), (dispatch) => ({
  dispatchGetCompWorkType(payload, callback) {
    dispatch(compWorkType(payload, callback));
  },
  dispatchCompWorkTypeProp() {
    dispatch(dispatchCompWorkType([]));
  }
}))
class UserInfomation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      companyList: [],
      checkedCompany: '',
      checkedCompanyId: 0,
      isOpened: false,
      compWorkTypes: [],
      checkedItem: {},
      passarea: [], // 通行证列表
      passareaList: [], // 通行证适用区域列表
      displayCheckedPassareaList: cloneDeep(props.userInfo.stationArea), // 显示在界面上的通行证适用区域
      // stationList: [], // 站点列表
      // areaList: [], // 区域列表
      checkedPassarea: '',
      checkedPassareaId: 0,
      name: '', // 姓名
      nickName: '', // 昵称
      sexName: '', // 性别
      sexId: 0, // 性别 ID
      idCard: '', // 身份证号
      isBound: false, // 是否已绑定工种
      disabled: true, // 是否禁用保存按钮
      isOpenedPassarea: false, // 是否显示通行证选择列表
    };
  }

  // static getDerivedStateFromProps(props, state) {
  //   if (state.compWorkTypes !== props.compWorkType) {
  //     return {
  //       compWorkTypes: props.compWorkType,
  //     };
  //   }

  //   return null;
  // }

  fetchPassareaList = () => {
    fetch({
      url: API_CARGOSTATION_LIST, 
      accessToken: (this.props.userInfo.userToken && this.props.userInfo.userToken.accessToken) || accessToken})
      .then((res) => {
        const {data: passareaList, statusCode} = res;
        console.log('区域位置: ', res);
    
        if (statusCode === 200) {
          const newPassareaList = passareaList.map(station => {
            const {passareaDtoList: areas} = station;
            const newAreas = areas.map(area => {
              area.checked = false;
              return area;
            });
            station.passareaDtoList = newAreas;
            return station;
          });
          console.log('newPassareaList: ', newPassareaList);
  
          this.setState({
            passareaList: newPassareaList,
          }); 
        }
      })
      .catch(() => {});
  };

  componentDidMount() {
    this.retrieveAllCompany();
    setTimeout(this.fetchPassareaList, 2000);
  }

  retrieveAllCompany = () => {
    const {userInfo} = this.props;
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
        const hresDto = userInfo.hresDto;
        const userInfoDto = userInfo.userInfoDto;
        const userCompanyCode = hresDto && userInfo.hresDto.companyCode;
        const username = hresDto && userInfo.hresDto.name;
        const nickName = userInfoDto && userInfo.userInfoDto.userDetailDto.nickName;
        const idCard = hresDto && userInfo.hresDto.idcard;
        const sex = hresDto && userInfo.hresDto.sex;
        console.log('userCompanyCode: ', userCompanyCode);

        if (sex != null) {
          const userSexId = sexList.findIndex((item) => {
            return item.code === sex;
          });

          const userSexName = sexList[userSexId].name;

          this.setState({
            sexName: userSexName, // 性别
            sexId: userSexId, // 性别 ID
          });
        }

        if (userCompanyCode != null) {
          const userCheckedCompanyId = data.findIndex((item) => {
            return item.companyCode === userCompanyCode;
          });
          const userCheckedCompany = data[userCheckedCompanyId].companyName;

          this.setState({
            checkedCompany: userCheckedCompany,
            checkedCompanyId: userCheckedCompanyId,
            companyList: data,
            name: username || '',
            idCard: idCard || '',
            nickName: nickName || '',
          }, () => {
            this.fetchWorkType(userCompanyCode);
          });
        } else {
          this.setState({
            companyList: data,
          })
        }
      });
  };


  config = {
    navigationBarTitleText: '个人信息'
  }
  
  // 选择所属公司
  onChangeCompany = e => {
    const companyName = this.state.companyList[e.detail.value].companyName;
    this.setState({
      checkedCompany: companyName,
      checkedCompanyId: e.detail.value,
    }, () => {
      const companyCode = this.state.companyList[e.detail.value].companyCode;
      console.log('onChangeCompany: ', companyCode);
      this.fetchWorkType(companyCode);
    });
  };

  // 取得对应公司下的工种
  fetchWorkType = (companyCode) => {
    this.props.dispatchGetCompWorkType({
      companyCode: companyCode,
      accessToken:  (this.props.userInfo.userToken && this.props.userInfo.userToken.accessToken) || accessToken
    }, (workTypeList) => {
      // 将工种列表缓存
      try {
        Taro.setStorageSync('workType', workTypeList);
      } catch (e) {

      }
      // console.log('workTypeList: ', workTypeList);
      const {userInfo} = this.props;

      const workTypeRecId =  userInfo.hresDto && userInfo.hresDto.worktypeRecid; 
      console.log('workTypeRecId: ', workTypeRecId);

      if (workTypeRecId != null) {
        const checkedItemIndex = workTypeList.findIndex((item) => {
          return item.typeRecId === workTypeRecId;
        });
        
        const checkedItem = workTypeList[checkedItemIndex];
        checkedItem.checked = true;
        console.log('checkedItem: ', checkedItem);
        this.setState({
          compWorkTypes: workTypeList,
          checkedItem,
          isBound: true,
          disabled: false,
        });
      } else {
        this.setState({compWorkTypes: workTypeList});
      }
    });
  };



  // 通行证适用区域
  // fetchPassarea = (companyCode) => {
  //   fetch({
  //     url: API_PASSAREA_ALL + `/${companyCode}`,
  //     accessToken:  (this.props.userInfo.userToken && this.props.userInfo.userToken.accessToken) || accessToken
  //   })
  //     .then((res) => {
  //       const {data: {data}} = res;
  //       console.log('通行证适用区域: ', res);

  //       const {userInfo} = this.props;

  //       const passareaRecId =  userInfo.hresDto && userInfo.hresDto.passareaRecid; 
  //       console.log('passareaRecId: ', passareaRecId);
  
  //       if (passareaRecId != null) {
  //         const checkedPassareaId = data.findIndex((item) => {
  //           return item.recId === passareaRecId;
  //         });
  //         const userAreaName = data[checkedPassareaId].areaName;
  //         console.log('userAreaName: ', userAreaName);
  //         this.setState({
  //           passarea: data,
  //           checkedPassarea: userAreaName,
  //           checkedPassareaId,
  //         })
  //       } else {
  //         this.setState({
  //           passarea: data,
  //         })
  //       }
  //     })
  //     .catch(() => {

  //     });
  // };

  handleClickCatogory = () => {

  };

  save = () => {
    const {
      idCard, 
      name, 
      checkedCompanyId, 
      companyList, 
      sexId, 
      passarea, 
      checkedPassareaId,
      passareaList,
      nickName,
    } = this.state;

    const hresareaDtoList = [];

    if (passareaList.length !== 0) {
      passareaList.forEach(station => {
        const {passareaDtoList} = station;
        passareaDtoList.forEach(area => {
          if (area.checked) {
            hresareaDtoList.push({
              areaCode: area.areaCode, // 区域代码 
              stationcode: station.stationcode, // 货站
              usrRecId: this.props.userInfo.auth.id // 用户id
            });
          }
        });
      });
    }

    const id = this.props.userInfo.auth.id;
    const usrDetailRecId = this.props.userInfo.userInfoDto.userDetailDto.usrDetailRecId;
    const hresRecId = this.props.userInfo.hresDto == null ? null : this.props.userInfo.hresDto.hresRecid;

    const payload = {
      hresDto: {
        companyCode: companyList[checkedCompanyId].companyCode, // 公司代码
        hresRecid: hresRecId,
        hresareaDtoList,
        idcard: idCard, // 身份证号
        // isverify: "N", // 是否已审核
        name,
        sex: sexList[sexId].code, // 性别
        status: 1, // 在职状态
        usrRecId: this.props.userInfo.auth.id, // 用户ID
        worktypeRecid: this.state.checkedItem.typeRecId // 工种ID
      },
      userDetailDto: {
        identityCard: idCard,
        nickName: nickName,
        phoneno: this.props.userInfo.auth.mobilePhone,
        usrDetailRecId: usrDetailRecId,
        // "usrIcon": "string",
        usrRecId: id
      }
    };

    console.log('payload: ', payload);

    Taro.showLoading({
      title: '保存用户信息中',
    });

    fetch({
      url: API_USER_USERDETAIL,
      payload,
      method: 'POST',
      accessToken: (this.props.userInfo.userToken && this.props.userInfo.userToken.accessToken) || accessToken
    })
      .then((res) => {
        Taro.hideLoading();
        console.log('保存用户基本信息: ', res);
        this.props.dispatch(dispatchLogin(res.data.data));
        Taro.navigateBack({
          delta: 2,
        });
      })
      .catch(() => {
        Taro.hideLoading();
      });
  };

  bindCompanyRole = () => {
    const companyId = this.state.companyList[this.state.checkedCompanyId].companyId;
    const roleId = this.state.checkedItem.roleId;
    console.log('companyId - roleId: ', companyId, roleId);
    console.log('token: ', this.props.userInfo.userToken.accessToken);
    Taro.showLoading({
      title: '正在绑定工种中',
    });
    fetch({
      url: API_USER_BIND_COMPANY_ROLE + `?companyId=${companyId}&roleId=${roleId}`,
      method: 'POST',
      accessToken:  (this.props.userInfo.userToken && this.props.userInfo.userToken.accessToken) || accessToken
    })
      .then((res) => {
        Taro.hideLoading();
        this.setState({
          isBound: true,
          disabled: false,
        });
        console.log('绑定公司和工种: ', res);
      })
      .catch(() => {
        this.setState({
          isBound: false,
          disabled: true,
        });
      });
  };

  handleClickWorkType = (typeRecId) => {
    const {compWorkTypes} = this.state;
    const newCompWorkType = compWorkTypes.slice();
    let checkedItem = {};
    newCompWorkType.forEach((item) => {
      if (item.typeRecId === typeRecId) {
        item.checked = true;
        if (item.checked === true) {
          checkedItem = item;
        } else {
          checkedItem = {};
        }
      } else {
        item.checked = false;
        // if (typeRecId === '') {
        //   checkedItem = {};
        // }
      }
      this.setState({
        compWorkTypes: newCompWorkType,
        checkedItem
      }, () => {
        this.setState({isOpened: false});
        this.bindCompanyRole();
      });
    });
  };

  onChangePassarea = (e) => {
    console.log('passarea: ', e.detail.value);
    const passareaName = this.state.passarea[e.detail.value].areaName;

    this.setState({
      checkedPassarea: passareaName,
      checkedPassareaId: e.detail.value,
    });
  };

  onChangeSex = (e) => {
    const sexName = sexList[e.detail.value].name;

    this.setState({
      sexName,
      sexId: e.detail.value,
    });
  };

  handleClosePassarea = () => {
    this.setState({
      isOpenedPassarea: false,
    })
  };

  handlePassareaChange = (e) => {
    const {passareaList, displayCheckedPassareaList: displayCheckedPassarea} = this.state;
    const stationId = e.target.dataset.stationId;
    const areaId = e.target.dataset.areaId;
    console.log('handlePassareaChange: ', e);
    const newPassareaList = passareaList.slice();
    try {
      newPassareaList.forEach((station) => {
        const {recid, stationcode, stationdsc, passareaDtoList} = station;
        if (recid === stationId) {
          passareaDtoList.forEach(area => {
            if (area.recId === areaId) {
              if (!!!displayCheckedPassarea[stationcode]) {
                displayCheckedPassarea[stationcode] = [];
              }
              area.checked = !area.checked;
              if (area.checked) {
                displayCheckedPassarea[stationcode].push(area.areaCode);
              } else {
                displayCheckedPassarea[stationcode].forEach((areaCode1, index) => {
                  if (areaCode1 === area.areaCode) {
                    displayCheckedPassarea[stationcode].splice(index, 1);
                  }
                });
                displayCheckedPassarea[stationcode].splice();
                if (displayCheckedPassarea[stationcode].length === 0) {
                  delete displayCheckedPassarea[stationcode];
                }
              }
              throw new Error('完成更新');
            }
          });
        }
      });
    } catch (e) {

    }
    console.log('选中后的区域列表: ',  newPassareaList);
    this.setState({
      passareaList: newPassareaList,
      displayCheckedPassareaList: displayCheckedPassarea,
    });
  };

  renderPassarea = () => {
    const {passareaList, displayCheckedPassareaList: displayCheckedPassarea} = this.state;
    return passareaList.map((stationItem) => {
      const {recid: stationId, stationcode, stationdsc, passareaDtoList} = stationItem;
      return (
        <View className='station' key={stationId}>
          <View className='station-item'>
            <Text>{stationdsc}</Text>
          </View>
          <View className='area'>
            {
              passareaDtoList.map((areaItem) => {
                // console.log('stationItem: ', stationItem);
                const {recId, areaCode, checked} = areaItem;

                Object.keys(displayCheckedPassarea).forEach((passareaItem) => {
                  if (stationItem.stationcode === passareaItem) {
                    displayCheckedPassarea[passareaItem].forEach((areaVal) => {
                      if (areaCode === areaVal) {
                        areaItem.checked = true;
                      }
                    });
                  }
                });


                return (
                  <View className='area-item' key={recId}>
                    <CheckboxGroup 
                      data-station-id={stationItem.recid}  
                      data-area-id={recId} 
                      onChange={this.handlePassareaChange}
                    >
                      <Checkbox 
                        className='area-checkbox' 
                        value="还未给" 
                        checked={checked}
                      >
                        {areaCode}
                      </Checkbox>
                    </CheckboxGroup>
                  </View>
                );
              })
            }
          </View>
        </View>
      );
    });
  };

  render() {
    const systemInfo = Taro.getSystemInfoSync();
    const paddingBottom = systemInfo.safeArea == undefined ? 0 : systemInfo.screenHeight - systemInfo.safeArea.bottom;

    console.log('stationcode: ', this.props.userInfo.stationArea);

    return (
      <View className='user-information'>
          <AtForm className='form'>
            <Picker
              mode='selector'
              range={this.state.companyList}
              rangeKey='companyName'
              onChange={this.onChangeCompany}
              value={this.state.checkedCompanyId}
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
                className='margin-to-padding work-type'
                title='职位'
                type='text'
                editable={false}
                border={false}
                value={this.state.checkedItem.workTypeName}
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
              <AtModal isOpened={this.state.isOpened} closeOnClickOverlay={true}>
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
                {/* <AtModalAction>
                  <Button onClick={() => {
                    this.setState({isOpened: false});
                    // this.handleClickWorkType('');
                  }}
                  >
                    取消
                  </Button>
                  <Button onClick={() => {
                    this.setState({isOpened: false});
                    this.bindCompanyRole();
                  }}
                  >
                    保存
                  </Button> 
                </AtModalAction>*/}
              </AtModal>
            </View>
          </AtForm>
          {
            this.state.isBound && (
              <View>
                <AtForm className='form'>
                  <AtInput
                    className='margin-to-padding username'
                    title='真实姓名'
                    type='text'
                    border={false}
                    placeholder='姓名'
                    value={this.state.name}
                    onChange={(name) => {
                      this.setState({
                        name
                      });
                    }}
                  />
                  <AtInput
                    className='margin-to-padding nickname'
                    title='昵称'
                    type='text'
                    border={false}
                    placeholder='昵称'
                    value={this.state.nickName}
                    onChange={(nickName) => {
                      this.setState({
                        nickName
                      });
                    }}
                  />
                  <AtInput
                    className='margin-to-padding id'
                    title='身份证号'
                    type='text'
                    placeholder='身份证号'
                    value={this.state.idCard}
                    onChange={(idCard) => {
                      this.setState({
                        idCard,
                      });
                    }}
                  />
                  <Picker
                    mode='selector'
                    range={sexList}
                    rangeKey='name'
                    onChange={this.onChangeSex}
                    value={this.state.sexId}
                  >
                    <AtList className='at-list-sex'>
                      <AtListItem
                        className='at-list-sex-item'
                        title='性别'
                        extraText={this.state.sexName}
                      />
                    </AtList>
                  </Picker>
                  {/* <Picker
                    mode='selector'
                    range={this.state.passarea}
                    rangeKey='areaName'
                    onChange={this.onChangePassarea}
                    value={this.state.checkedPassareaId}
                  >
                  <AtList className='at-list-passarea'>
                    <AtListItem
                      className='at-list-passarea-item'
                      title='通行证适用区域'
                      extraText={this.state.checkedPassarea}
                    />
                  </AtList>
                </Picker> */}
                <View 
                  className='passarea'
                  onClick={() => {
                    this.setState({
                      isOpenedPassarea: true,
                    });
                  }}
                >
                  <Text className='passarea-title'>通行证{'\n'}适用区域</Text>
                  <View className='passarea-value'>
                    {
                      this.state.passareaList.length !== 0 && Object.keys(this.state.displayCheckedPassareaList).map(passarea => {
                        let desc = '';
                        this.state.passareaList.forEach((passareaItem) => {
                          if (passarea === passareaItem.stationcode) {
                            desc = passareaItem.stationdsc;
                          }
                        });
                      return (
                        <View key={passarea}>
                          {desc + '...'}
                        </View>
                      );
                    })}
                  </View>
                </View>
                <AtFloatLayout
                  className='at-float-layout-container'
                  scrollY={true}
                  isOpened={this.state.isOpenedPassarea} 
                  title="选择通行证适用区域" 
                  onClose={this.handleClosePassarea}
                >
                  <ScrollView
                    enableFlex={true}
                    style={{'padding-bottom': Taro.pxTransform(paddingBottom)}} 
                    className='passarea-wrapper'
                  > 
                    {this.renderPassarea()}
                  </ScrollView>
                </AtFloatLayout>
                </AtForm>
              </View>
            )
          }
          <Button 
            className='button' 
            onClick={this.save}
            disabled={this.state.disabled}
          >
            保存
          </Button>
        </View>
    );
  }
}

export default UserInfomation;
