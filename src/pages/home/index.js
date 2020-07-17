import Taro, { Component } from '@tarojs/taro';
import { View, Text, Image, ScrollView, Button } from '@tarojs/components';
import { connect } from '@tarojs/redux'
import { drawerShowHide, dataPageList } from '../../actions/home'
import { AtDrawer } from 'taro-ui'
import { API_RSPUBLISH_LIST } from '@constants/api';
import fetch from '@utils/request';
import Menu from './menu'
import './index.scss';

function listImgSrc() {
  return `https://picsum.photos/seed/${Math.ceil(Math.random() * 100)}/110/70`
}


@connect(state => ({
  userInfo: state.user.userInfo,
  home: state.home
}), (dispatch) => ({
  drawerShowHides(data) {
    dispatch(drawerShowHide(data))
  },
  dispatchPageList(payload) {
    dispatch(dataPageList(payload))
  }
}))
class Home extends Component {
  config = {
    navigationBarTitleText: '空运帮'
  }

  constructor(props) {
    super(props);
    this.state = {
      dataList: []
    }
  }

  componentDidMount() {
    this.pageListData()
  }

  pageListData = () => {
    fetch({
      url: API_RSPUBLISH_LIST,
    }).then((res) => {
      const { data: { data } } = res;
      this.setState({
        dataList: data.list
      })
    })
  }


  todrawerShowHide = (e) => {
    this.props.drawerShowHides(true)
  }

  render() {
    return (
      // <View className='home'>
      //   <Text className='title'>Home</Text>
      //   {this.props.home.showHideDrawer}
      //   <Button onClick={this.todrawerShowHide}>测试抽屉</Button>
      //   <AtDrawer
      //     show={this.props.home.showHideDrawer}
      //     mask
      //     right
      //     items={['菜单1', '菜单2']}
      //   ></AtDrawer>
      // </View>

      <ScrollView className='home'>
        {/* <View className='panel-title' style={{ backgroundColor: '#F7F7F7', paddingTop: '5px', paddingBottom: '5px' }}>人力信息</View> */}
        <View className='information-title'>
          <View className='data-list'>
            {this.state.dataList.map((item, index) => {
              const evenNum = index % 2 === 0
              
             
              const { rspublishDto, rspublishDto:{publishRecid}, hresCargostationMap } = item
              rspublishDto.imgSrc = listImgSrc()
              rspublishDto.listImg = [
                { img: listImgSrc() },
                { img: listImgSrc() }
              ]
              // console.log('返回的数据',hresCargostationMap)
              if (evenNum) {
                return (
                  <Menu listImg={rspublishDto} key={publishRecid} hresCargostationMap={hresCargostationMap} />
                )
              }
            })}
          </View>

          <View className='data-list'>
            {this.state.dataList.map((item, index) => {
              const evenNum = index % 2 === 1
              const { rspublishDto, rspublishDto:{publishRecid}, hresCargostationMap } = item
              rspublishDto.imgSrc = listImgSrc()
              rspublishDto.listImg = [
                { img: listImgSrc() },
                { img: listImgSrc() }
              ]
             
              if (evenNum) {
                return (
                  <Menu listImg={rspublishDto} key={publishRecid} hresCargostationMap={hresCargostationMap}/>
                )
              }
            })}
          </View>

        </View>
      </ScrollView>
    );
  }
}

export default Home;