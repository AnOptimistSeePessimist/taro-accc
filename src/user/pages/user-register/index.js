import Taro, {Component} from '@tarojs/taro';
import {View, Text, Input, Button} from '@tarojs/components';
import fetch from '@utils/request';
import {connect} from '@tarojs/redux';
import {dispatchLogin} from '@actions/user';
import {API_USER_REGISTER, API_USER_CODE} from '@constants/api';

import './index.scss';

let setIntervalTime = null;

@connect(state => state.user, (dispatch) => ({
  login(payload) {
    dispatch(dispatchLogin(payload));
  },
}))
class Register extends Component {
  constructor(props) {
    super(props);
    console.log('Register - props', this.$router.params);
    const mobilePhone = this.$router.params.mobilePhone;
    this.state = {
      mobilePhone: mobilePhone ? mobilePhone : '', // 手机号
      code: '', // 验证码
      sending: 0, // 0 == 获取验证码 1 == 多少秒后重新发送验证码   2 == 重新获取验证码
      smsTime: 60, // 默认为 60s 再次重新获取验证码
    };
  }

  config = {
    navigationBarTitleText: '注册',
  };

  componentWillUnmount() {
    setIntervalTime && clearInterval(setIntervalTime);
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
      title: '正在发送验证码'
    });

    fetch({url: API_USER_CODE + `/${mobilePhone}`})
      .then((res) => {
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
    let numConst = 60;
    setIntervalTime = setInterval(() => {
      numConst--;

      this.setState({
        sending: 1,
        smsTime: numConst,
      });

      if (
        numConst == 0 || status != 200
      ) {
        setIntervalTime && clearInterval(setIntervalTime);
        this.setState({
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
      this.showToast('请输入有效的手机号或输入有效验证码！');
      return;
    }

    Taro.showLoading({
      title: '正在注册中',
      icon: 'none',
    });

    Taro.login({
      complete: (res) => {
        console.log('res.code: ', res.code);
        this.register(res.code);
      }
    });
  };

  register = async (wxCode) => {
    const {mobilePhone, code} = this.state;
    if (
      mobilePhone == '' ||
      mobilePhone.length != 11 ||
      code == ''
    ) {
      this.showToast('请输入有效的手机号或输入有效验证码！');
      return;
    }

    Taro.showLoading({
      title: '正在注册中',
      icon: 'none',
    });

    fetch({url: API_USER_REGISTER + `?mobilePhone=${mobilePhone}&securityCode=${code}&jscode=${wxCode}`, method: 'POST'})
    .then((res) => {
      Taro.showLoading({
        title: '正在登录中',
        icon: 'none',
      });
      console.log('注册返回数据: ', res);
      this.props.login(res.data.data);
      setTimeout(() => {
        Taro.hideLoading();
        Taro.navigateBack({
          delta: 2
        })
      }, 2000);
    }).catch((e) => {

    });
  };

  render() {
    console.log('register - render');
    const {sending, smsTime} = this.state;
    return (
      <View className='login'>
        <Text className='title'>您好，请注册</Text>

        <View className='form-top-wrapper'>
          <View className='login-wrapper'>
            <View className='mobile'>
              <Input
                focus={true}
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
                value={code}
                onInput={this.getCode}
              />
              <View
                className='fetch-button'
                onClick={this.sendSms}
                style={{opacity: sending === 0 ? 1 : 0.5}}
              >
                {sending === 0 ? '获取验证码' : `${smsTime}秒后重发`}
              </View>
            </View>
            <Button className='button' onClick={() => this.wxLogin()}>
              注册
            </Button>
          </View>
        </View>
      </View>
    );
  }
}

export default Register;
