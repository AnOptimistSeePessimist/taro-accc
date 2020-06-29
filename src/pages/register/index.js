import Taro, {Component} from '@tarojs/taro';
import {View, Text, Input, Button} from '@tarojs/components';
import fetch from '@utils/request';
import {API_USER_CODE} from '@constants/api';

import './index.scss';

class Register extends Component {
  constructor(props) {
    super(props);
    console.log('Register - props: ', props);
    this.state = {
      mobile: '12345678901', // 手机号
      code: '', // 验证码
      sending: 0, // 0 == 获取验证码 1 == 多少秒后重新发送验证码   2 == 重新获取验证码
      smsTime: 60, // 默认为 60s 再次重新获取验证码 
    };
  }

  config = {
    navigationBarTitleText: '注册',
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

    Taro.showLoading({
      title: '正在发送验证码'
    });

    fetch({url: API_USER_CODE + `/${12345678901}`})
      .then((res) => {
        Taro.hideLoading();
        this.setState({code: res.data.data});
      }).catch((e) => {

      });
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
    // this.setState({
    //   code: e.target.value,
    // });
  }

  register = async () => {
    const {mobile, code} = this.state;
    if (
      mobile == '' ||
      mobile.length != 11 ||
      code == ''
    ) {
      this.showToast('请输入有效的手机号或输入有效验证码！');
      return;
    }

    Taro.showLoading({
      title: '正在登陆中',
      mask: true,
    });

    this.props.login({mobilePhone: '12345678901', password: code});

    Taro.hideLoading();
    Taro.navigateBack();
  };

  render() {
    const {sending, smsTime} = this.state;
    return (
      <View className='login'>
        <Text className='title'>您好，请注册</Text>

        <View className='form-top-wrapper'>
          <View className='login-wrapper'>
            <View className='mobile'>
              <Input
                type='number'
                name='mobile'
                maxLength='11'
                placeholder='请输入手机号'
                value={this.state.mobile}
                onInput={this.getMobile}
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
              <View className='fetch-button' onClick={this.sendSms}>
                {sending === 0 ? '获取验证码' : sending === 1 ? `${smsTime}秒后重发` : '重新获取'}
              </View>
            </View>
            <Button className='button' onClick={this.register}>
              注册
            </Button>
          </View>
        </View>
      </View>
    );
  }
}

export default Register;
