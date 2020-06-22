import Taro, {Component} from '@tarojs/taro';
import {View, Text, Input, Button} from '@tarojs/components';
import {connect} from '@tarojs/redux';
import {dispatchLogin} from '@actions/user';

import './index.scss';

@connect(state => state.user, (dispatch) => ({
  login(payload) {
    dispatch(dispatchLogin(payload));
  },
}))
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mobile: '', // 手机号
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
    const {sending, mobile} = this.state;
    if (sending === 1) {
      return;
    }

    if (mobile == '' || mobile.length != 11) {
      this.showToast('请输入有效的手机号！');
      return;
    }

    this.showToast('正在发送验证码');
  };

  showToast(title) {
    Taro.showToast({
      title,
      icon: 'none',
    });
  }


  getMobile = (e) => {
    this.setState({
      mobile: e.target.value,
    });
  };

  getCode = (e) => {
    this.setState({
      code: e.target.value,
    });
  }

  login = async () => {
    const {mobile, code} = this.state;
    if (
      mobile == '' ||
      mobile.length != 11 ||
      code == '' ||
      code.length != 6
    ) {
      this.showToast('请输入有效的手机号或输入有效验证码！');
      return;
    }

    Taro.showLoading({
      title: '正在登陆中',
      mask: true,
    });

    this.props.login({username: mobile, password: code});

    Taro.hideLoading();
    Taro.navigateBack();
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
                type='number'
                name='mobile'
                maxLength='11'
                placeholder='请输入手机号'
                value={mobile}
                onInput={this.getMobile}
              />
            </View>
            <View className='validate-number'>
              <Input
                type='number'
                name='code'
                maxLength='6'
                placeholder='请输入验证码'
                value={code}
                onInput={this.getCode}
              />
              <View className='fetch-button' onClick={this.sendSms}>
                {sending === 0 ? '获取验证码' : sending === 1 ? `${smsTime}秒后重发` : '重新获取'}
              </View>
            </View>
            <Button className='button' onClick={this.login}>
              登录
            </Button>
          </View>
        </View>
      </View>
    );
  }
}

export default Login;
