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
  API_USER_USERDETAIL,
  API_CARGOSTATION_LIST
} from '@constants/api';
import classnames from 'classnames';
import {
  compWorkType,
  dispatchCompWorkType
} from '@actions/compWorkType';
import {dispatchLogin} from '@actions/user';

import './index.scss';

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
      companyList: [], // 公司列表
      checkedCompany: '', // 选中的公司名
      checkedCompanyId: -1, // 选中的公司索引
      isOpened: false, // 是否打开职位选择modal
      compWorkTypes: [], // 职位列表(包括了是否选中的标志)
      passareaList: [], // 通行证适用区域列表
      checkedPassarea: '',
      name: '', // 姓名
      nickName: '', // 昵称
      sexName: '', // 性别
      sexId: -1, // 性别 ID
      idCard: '', // 身份证号
      isOpenedPassarea: false, // 是否显示通行证选择列表
    };
  }

  // 得到通行证适用区域列表
  fetchPassareaList = () => {
    fetch({
      url: API_CARGOSTATION_LIST,
      accessToken: this.props.userInfo.userToken && this.props.userInfo.userToken.accessToken
    })
      .then((res) => {
        const {data: passareaList, statusCode} = res;
        console.log('通行证适用区域列表: ', res);

        if (statusCode === 200) {
          const {stationArea} = this.props.userInfo;

          console.log('stationArea: ', stationArea);
          if (stationArea) {
            Object.keys(stationArea).forEach((currentStation) => {
              const currentStationIdx = passareaList.findIndex((passarea) => {
                return passarea.stationcode === currentStation;
              });

              stationArea[currentStation].forEach((currentArea) => {
                passareaList[currentStationIdx].passareaDtoList.forEach((area) => {
                  if (currentArea === area.areaCode) {
                    area.checked = true;
                  } else {
                    if (!area.checked) {
                      area.checked = false;
                    }
                  }
                });
              });
            });
          }

          console.log('passareaList: ', passareaList);

          this.setState({
            passareaList,
          });
        }
      })
      .catch(() => {});
  };

  componentDidMount() {
    this.retrieveAllCompany();
    this.fetchPassareaList();
  }

  retrieveAllCompany = () => {
    const {userInfo} = this.props;
    Taro.showLoading({
      title: '获取公司数据中',
      mask: true,
    });

    fetch({
      url: API_COMPANY_ALL,
      accessToken: this.props.userInfo.userToken && this.props.userInfo.userToken.accessToken
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
      accessToken: this.props.userInfo.userToken && this.props.userInfo.userToken.accessToken
    }, (workTypeList) => {
      console.log('workTypeList: ', workTypeList);
      // 将工种列表缓存
      try {
        Taro.setStorageSync('workType', workTypeList);
      } catch (e) {

      }
      const {userInfo} = this.props;

      const workTypeRecId =  userInfo.hresDto && userInfo.hresDto.worktypeRecid;
      const userCompanyCode = userInfo.hresDto && userInfo.hresDto.companyCode;
      console.log('用户默认的工种: ', workTypeRecId);

      if (workTypeRecId != null && userCompanyCode === companyCode) {
        const workTypeRecIdList = [workTypeRecId];

        workTypeRecIdList.forEach((workTypeItem) => {
          const workTypeIndex = workTypeList.findIndex(workTypeItem2 => workTypeItem === workTypeItem2.typeRecId);
          workTypeList[workTypeIndex].checked = true;
        });

        this.setState({
          compWorkTypes: workTypeList,
        });
      } else {
        this.setState({compWorkTypes: workTypeList});
      }
    });
  };

  handleClickCatogory = () => {

  };


  // 请求订阅消息权限
  requestSubscribeMessage = () => {
    Taro.requestSubscribeMessage({
      tmplIds: ['u46Ky51R7RK9QLTjoH84oDZh4qOCf9IIl9-GnDioIhg'],
      complete: (res) => {
        console.log('requestSubscribeMessage: ', res);
        this.save();
      }
    });
  };


  // 保存用户信息
  save = () => {
    const {
      idCard,
      name,
      checkedCompanyId,
      companyList,
      sexId,
      passareaList,
      nickName,
      compWorkTypes,
    } = this.state;

    console.log('选中的公司: ', companyList[checkedCompanyId]);

    if (companyList[checkedCompanyId] == null) {
      Taro.showToast({
        icon: 'none',
        title: '请选择所属公司',
      });
      return;
    }

    const filterCompWorkTypes = compWorkTypes.filter(item => item.checked === true);

    if (filterCompWorkTypes.length === 0) {
      Taro.showToast({
        icon: 'none',
        title: '请选择职位',
      });
      return;
    }

    if (name === '') {
      Taro.showToast({
        icon: 'none',
        title: '请输入真实姓名'
      });
      return;
    }

    const hresareaDtoList = [];

    if (passareaList.length !== 0) {
      passareaList.forEach(station => {
        const {passareaDtoList} = station;
        passareaDtoList.forEach(area => {
          if (area.checked) {
            hresareaDtoList.push({
              areaCode: area.areaCode, // 区域代码
              stationcode: station.stationcode, // 货站
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
        sex: sexList[sexId] && sexList[sexId].code, // 性别
        status: 1, // 在职状态
        usrRecId: this.props.userInfo.auth.id, // 用户ID
        worktypeRecid: compWorkTypes.reduce((accumulator, item) => {
          if (item.checked === true) {
            accumulator.push(item.typeRecId);
          }
          return accumulator;
        }, [])[0] // 工种ID
      },
      userDetailDto: {
        identityCard: idCard,
        nickName: nickName || name,
        phoneno: this.props.userInfo.auth.mobilePhone,
        usrDetailRecId: usrDetailRecId,
        // "usrIcon": "string",
        usrRecId: id
      }
    };

    console.log('保存用户信息的数据: ', payload);

    Taro.showLoading({
      title: '保存用户信息中',
    });

    fetch({
      url: API_USER_USERDETAIL,
      payload,
      method: 'POST',
      accessToken: this.props.userInfo.userToken && this.props.userInfo.userToken.accessToken
    })
      .then((res) => {
        Taro.hideLoading();
        console.log('保存用户基本信息: ', res);
        const {data: {status, message, code}} = res;

        if (status === 200) {
          this.props.dispatch(dispatchLogin(res.data.data));
          Taro.navigateBack({
            delta: 2,
          });
        } else {
          Taro.showToast({
            icon: 'none',
            title: `${message}`,
          });
        }
      })
      .catch(() => {
        Taro.hideLoading();
      });
  };

  // 选择工种, 工种可多选。
  handleClickWorkType = (typeRecId) => {
    const newCompWorkType = [...this.state.compWorkTypes];

    const findIdx = newCompWorkType.findIndex(item => item.typeRecId === typeRecId);
    const findItem = newCompWorkType[findIdx];

    newCompWorkType[findIdx] = {...findItem, checked: !findItem.checked};

    console.log('newCompWorkType: ', newCompWorkType);

    this.setState({
      compWorkTypes: newCompWorkType,
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
    console.log('handlePassareaChange: ', e);
    const stationId = e.target.dataset.stationId;
    const areaId = e.target.dataset.areaId;
    const stationIndex = e.target.dataset.stationIndex;
    const areaIndex = e.target.dataset.areaIndex;
    const {passareaList} = this.state;
    const newPassareaList = passareaList.slice();

    const areaChecked = newPassareaList[stationIndex].passareaDtoList[areaIndex].checked;

    newPassareaList[stationIndex].passareaDtoList[areaIndex].checked = !areaChecked;

    this.setState({
      passareaList: newPassareaList,
    });
  };

  renderPassarea = () => {
    const {passareaList} = this.state;
    return passareaList.map((stationItem, stationIndex) => {
      const {recid: stationId, stationcode, stationdsc, passareaDtoList} = stationItem;
      return (
        <View className='station' key={stationId}>
          <View className='station-item'>
            <Text>{stationdsc}</Text>
          </View>
          <View className='area'>
            {
              passareaDtoList.map((areaItem, areaIndex) => {
                const {recId, areaCode, checked} = areaItem;
                return (
                  <View className='area-item' key={recId}>
                    <CheckboxGroup
                      data-station-index={stationIndex}
                      data-area-index={areaIndex}
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
    const {compWorkTypes} = this.state;
    const systemInfo = Taro.getSystemInfoSync();
    const paddingBottom = systemInfo.safeArea == undefined ? 0 : systemInfo.screenHeight - systemInfo.safeArea.bottom;

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
                value={compWorkTypes.filter(item => item.checked === true).map(item => item.workTypeName).join('、')}
                onClick={() => {
                  console.log('onClick - 公司工种信息: ', this.props.compWorkType);

                  if (this.state.checkedCompany === '') {
                    Taro.showToast({
                      icon: 'none',
                      title: '请先选择所属公司',
                    });
                    return;
                  }

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
              <AtModal
                isOpened={this.state.isOpened}
                closeOnClickOverlay={true}
                onClose={() => {
                  this.setState({
                    isOpened: false,
                  });
                }}
                >
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
                  <Button
                    onClick={() => {
                      this.setState({isOpened: false});
                    }}
                  >
                    确定
                  </Button>
                </AtModalAction>
              </AtModal>
            </View>
          </AtForm>
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
                  this.state.passareaList.length !== 0 &&
                  this.state.passareaList.map((passarea) => {
                    const areaCheckedIdx = passarea.passareaDtoList.findIndex((area) => {
                      return area.checked === true;
                    });

                    if (areaCheckedIdx !== -1) {
                      return (
                        <View key={passarea.recid}>
                          {passarea.stationdsc + '...'}
                        </View>
                      );
                    }
                    return (
                      <Text />
                    );
                  })
                }
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
          <Button
            className='button'
            onClick={() => {
              // 先请求订阅消息权限，然后保存用户数据
              this.requestSubscribeMessage();
            }}
            disabled={false}
          >
            保存
          </Button>
        </View>
    );
  }
}

export default UserInfomation;
