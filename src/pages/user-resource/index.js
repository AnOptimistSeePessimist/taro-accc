import Taro, {Component} from '@tarojs/taro';
import {View, Text, Button} from '@tarojs/components';
import {connect} from '@tarojs/redux';
import {API_HRES_LIST} from '@constants/api';
import fetch from '@utils/request';

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

  renderResource = () => {
    const {resource} = this.state;
  
    return resource.map((resourceItem) => {
      const {hresRecid, name, worktypeRecid, isverify, sex} = resourceItem;
      return (
        <View className='resource-item' key={hresRecid}>
          <View className='left-details'>
            <View><Text className='name-label'>姓名:</Text>{name}</View>
            <View><Text className='sex-label'>性别:</Text> {sexList.find(sexItem => sexItem.code === sex).name}</View>
            <View><Text className='work-type-label'>工种:</Text> {worktypeRecid}</View>
            <View><Text className='verify-label'>是否验证:</Text> {isverify === 'Y' ? '是' : '否'}</View>
          </View>
          <View>
            {isverify !== 'Y' && (
              <View >
                <Button type='primary'>点击验证</Button>
              </View>
            )}
          </View>
        </View>
      );
    });
  
  };

  render() {
    return (
      <View className='user-resource'>
        {this.renderResource()}
      </View>
    );
  }
}

export default UserResource;
