import Taro, {Component} from '@tarojs/taro';
import {View, Text, Input, Button} from '@tarojs/components';
import {connect} from '@tarojs/redux';
import {login as loginFunc, dispatchSendSms as dispatchSendSmsFunc} from '@actions/user';
import fetch from '@utils/request';
import {API_USER_CODE} from '@constants/api';

import './index.scss';

let setIntervalTime = null;

@connect(state => state.user, (dispatch) => ({
  dispatchLogin(payload) {
    dispatch(loginFunc(payload));
  },
  dispatchSendSms(payload) {
    dispatch(dispatchSendSmsFunc(payload));
  }
}))
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mobilePhone: '15060170315', // 手机号 15837621762 18350863236
      code: '', // 验证码
      // sending: 0, // 0 == 获取验证码 1 == 多少秒后重新发送验证码   2 == 重新获取验证码
      // smsTime: 60, // 默认为 60s 再次重新获取验证码
    };
  }

  config = {
    navigationBarTitleText: '登录',
  };

  componentWillUnmount() {
    setIntervalTime && clearInterval(setIntervalTime);
  }

  componentDidMount() {
    if (this.props.sending === 1) {
      this.setIntervalTime(200);
    }
  }

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
      title: '正在发送验证码',
      mask: true,
    });

    fetch({url: API_USER_CODE + `/${this.state.mobilePhone}`})
      .then((res) => {
        console.log('返送验证码是否成功的响应: ', res);
        const {data: {status, data: code}} = res;
        this.setIntervalTime(status);
        setTimeout(Taro.hideLoading, 1000);

        if (status === 200) {
          this.setState({code: code.toString()});
        }
      }).catch((e) => {

      });
  };

  setIntervalTime = (status) => {
    setIntervalTime && clearInterval(setIntervalTime);
    let {smsTime} = this.props;
    setIntervalTime = setInterval(() => {
      smsTime--;

      this.props.dispatchSendSms({
        sending: 1,
        smsTime: smsTime,
      });

      if (smsTime == 0 || status != 200) {
        setIntervalTime && clearInterval(setIntervalTime);

        this.props.dispatchSendSms({
          sending: 0,
          smsTime: 60,
        });
      }
    }, 1000);
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

  // 微信登录
  wxLogin = () => {
    const {mobilePhone, code} = this.state;
    if (
      mobilePhone == '' ||
      mobilePhone.length != 11 ||
      code == ''
    ) {
      Taro.showToast({
        icon: 'none',
        title: '请输入有效的手机号或输入有效验证码！',
        mask: true,
      });
      return;
    }

    Taro.login({
      complete: (res) => {
        console.log('res.code: ', res.code);
        this.login(res.code);
      }
    });
  };

  // 用户登录
  login = async (wxCode) => {
    const {mobilePhone, code} = this.state;
    if (
      mobilePhone == '' ||
      mobilePhone.length != 11 ||
      code == ''
    ) {
      Taro.showToast({
        icon: 'none',
        title: '请输入有效的手机号或输入有效验证码！',
        mask: true,
      });
      return;
    }

    this.props.dispatchLogin({mobilePhone, securityCode: code, wxCode: wxCode});
  };

  handleRegister = () => {
    Taro.navigateTo({url: '/user/pages/user-register/index'});
  };

  render() {
    console.log('Login - render');
    const {sending, smsTime} = this.props;
    console.log('sending - smsTime: ', sending, smsTime);
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
              <View
                className='fetch-button'
                onClick={this.sendSms}
                style={{opacity: sending === 0 ? 1 : 0.5}}
              >
                {sending == 0 ? '获取验证码' : `${smsTime}s后重发`}
              </View>
            </View>
            <Button className='button' onClick={() => this.wxLogin()}>
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
