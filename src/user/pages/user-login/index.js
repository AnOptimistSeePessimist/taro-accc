import Taro, {Component} from '@tarojs/taro';
import {View, Text, Input, Button} from '@tarojs/components';
import {connect} from '@tarojs/redux';
import {login as loginFunc} from '@actions/user';
import fetch from '@utils/request';
import {API_USER_CODE} from '@constants/api';

import './index.scss';

@connect(state => state.user, (dispatch) => ({
  dispatchLogin(payload) {
    dispatch(loginFunc(payload));
  },
}))
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mobilePhone: '18350863236', // 手机号15837621762 18350863236
      code: '', // 验证码
      sending: 0, // 0 == 获取验证码 1 == 多少秒后重新发送验证码   2 == 重新获取验证码
      smsTime: 60, // 默认为 60s 再次重新获取验证码
    };
  }

  config = {
    navigationBarTitleText: '登录',
  };

  // 发送验证码
  sendSms = () => {
    const {sending, mobilePhone} = this.state;
    if (sending === 1) {
      return;
    }

    if (mobilePhone == '' || mobilePhone.length != 11) {
      this.showToast('请输入有效的手机号！');
      return;
    }

    Taro.showLoading({
      title: '正在发送验证码'
    });

    fetch({url: API_USER_CODE + `/${this.state.mobilePhone}`})
      .then((res) => {
        Taro.hideLoading();
        this.setState({code: res.data.data.toString()});
      }).catch((e) => {

      });
  };

  showToast(title) {
    Taro.showToast({
      title,
      icon: 'none',
    });
  }

  getMobilePhone = (e) => {
    this.setState({
      mobilePhone: e.target.value,
    });
  };

  getCode = (e) => {
    this.setState({
      code: e.target.value,
    });
  }

  login = async () => {
    const {mobilePhone, code} = this.state;
    if (
      mobilePhone == '' ||
      mobilePhone.length != 11 ||
      code == ''
    ) {
      this.showToast('请输入有效的手机号或输入有效验证码！');
      return;
    }

    this.props.dispatchLogin({mobilePhone, securityCode: code});
  };

  handleRegister = () => {
    Taro.navigateTo({url: '/user/pages/user-register/index'});
  };

  render() {
    const {sending, smsTime} = this.state;
    return (
      <View className='login'>
        <Text className='title'>您好，请登录</Text>

        <View className='form-top-wrapper'>
          <View className='login-wrapper'>
            <View className='mobile'>
              <Input
                focus
                type='number'
                name='mobile'
                maxLength='11'
                placeholder='请输入手机号'
                value={this.state.mobilePhone}
                onInput={this.getMobilePhone}
              />
            </View>
            <View className='validate-number'>
              <Input
                type='number'
                name='code'
                // maxLength='4'
                placeholder='请输入验证码'
                value={this.state.code}
                onInput={this.getCode}
              />
              <View className='fetch-button' onClick={this.sendSms}>
                {sending === 0 ? '获取验证码' : sending === 1 ? `${smsTime}秒后重发` : '重新获取'}
              </View>
            </View>
            <Button className='button' onClick={this.login}>
              登录
            </Button>
            <View className='register-btn' onClick={this.handleRegister}>注册</View>
          </View>
        </View>
      </View>
    );
  }
}

export default Login;
