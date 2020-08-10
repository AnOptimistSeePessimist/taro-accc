import Taro, {Component} from '@tarojs/taro';
import {View, Text, Button, ScrollView} from '@tarojs/components';
import {connect} from '@tarojs/redux';
import {API_HRES_LIST, API_HRES_VERIFY} from '@constants/api';
import fetch from '@utils/request';
import {
  AtModal,
  AtModalHeader,
  AtModalContent,
  AtModalAction,
} from 'taro-ui';
import { getWindowHeight } from '@utils/style';

import './index.scss';

const sexList = [
  {name: '女', code: 'F'},
  {name: '男', code: 'M'}
];

@connect(state => ({userInfo: state.user.userInfo}), {})
class UserResource extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resource: [],
      isOpened: false,
      hresRecId: '',
    };
  }

  config = {
    navigationBarTitleText: '我的资源',
  };

  componentDidMount() {
    console.log('UserResource: ', this.props.userInfo);
    this.fetchManpower();
  }

  fetchManpower = () => {
    Taro.showLoading({title: '正在获取我的资源'});
    const {hresDto: {companyCode}, userToken: {accessToken}} = this.props.userInfo;
    fetch({url: API_HRES_LIST + `?companyCode=${companyCode}`, accessToken})
      .then((res) => {
        setTimeout(Taro.hideLoading, 1000);
        const {data: {status, data: {list: resource}}} = res;
        console.log('获取人力资源: ', res);

        if (status === 200) {
          this.setState({
            resource,
          });
        }


      })
      .catch(() => {});
  };

  validate = (hresRecId) => {
    this.setState({
      isOpened: true,
      hresRecId: hresRecId,
    });
  };

  renderResource = () => {
    const {resource} = this.state;

    return resource.map((resourceItem) => {
      const {hresRecid, name, worktypeRecid, isverify, sex, workTypeDesc} = resourceItem;
      return (
        <View className='resource-item' key={hresRecid}>
          <View className='left-details'>
            <View>{name}({sexList.find(sexItem => sexItem.code === sex).name}, {workTypeDesc})</View>
          </View>
          <View>
          <View>
            <Button
              className='validate-button'
              disabled={isverify === 'Y'}
              onClick={() => this.validate(hresRecid)}
            >
              {isverify === 'Y' ? '已审核' : '待审核'}
            </Button>
          </View>
          </View>
        </View>
      );
    });
  };

  handleCancel = () => {
    this.setState({
      isOpened: false,
      hresRecId: '',
    });
  };

  handleConfirm = () => {
    this.setState({
      isOpened: false,
    }, () => {
      Taro.showLoading({title: '正在审核资源中'});
      const {hresRecId} = this.state;
      const {userToken: {accessToken}} = this.props.userInfo;
      fetch({url: API_HRES_VERIFY + `/${hresRecId}`, accessToken})
        .then((res) => {
          const {data: {status}} = res;
          console.log('handleConfirm: ', res);

          if (status === 200) {
            const {resource} = this.state;
            const newResource = resource.map((resourceItem) => {
              if (resourceItem.hresRecid === hresRecId) {
                resourceItem.isverify = 'Y';
                return resourceItem;
              }
              return resourceItem;
            });
            this.setState({
              resource: newResource
            }, () => {
              Taro.hideLoading();
            });
          }
        })
        .catch(() => {
          Taro.hideLoading();
        });
    });
  };

  render() {
    return (
      <View className='user-resource'>
        <ScrollView
          className='scroll-view'
          scrollY
          enableFlex={true}
          style={{height: getWindowHeight(false)}}
        >
          {this.renderResource()}
        </ScrollView>
        <AtModal
            className='is-check-user'
            isOpened={this.state.isOpened}
            title='是否审核该用户'
            cancelText='取消'
            confirmText='确认'
            onCancel={ this.handleCancel }
            onConfirm={ this.handleConfirm }
            content=''
            closeOnClickOverlay={false}
          />
      </View>
    );
  }
}

export default UserResource;
