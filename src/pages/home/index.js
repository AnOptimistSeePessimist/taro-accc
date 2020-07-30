import Taro, { Component } from '@tarojs/taro';
import { View, Text, Image, ScrollView, Button } from '@tarojs/components';
import { connect } from '@tarojs/redux'
import { drawerShowHide, dataPageList } from '../../actions/home'
import { AtDrawer } from 'taro-ui'
import { API_RSPUBLISH_LIST } from '@constants/api';
import fetch from '@utils/request';
import Menu from './menu'
import './index.scss';
import { getWindowHeight } from '@utils/style';

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
      dataList: [],
      refresherTriggered: false,
      pageNum: 1,
      pageMax: ''
    }
  }

  componentDidMount() {
    this.pageListData();
  }

  pageListData = () => {
    this.setState({
      refresherTriggered: true,
      pageNum: 1
    }, () => {
      fetch({
        url: API_RSPUBLISH_LIST + `?pageNum=${this.state.pageNum}`,
      }).then((res) => {
        const { data: { data } } = res;
        this.setState({
          dataList: data.list,
          pageMax: data.pages
        }, () => {
          this.setState({
            refresherTriggered: false,
          })
          this._freshing = false
        })
      })
    });
  }

  ScrollToLower() { 
    console.log('滚动到底部事件')
    const {dataList, pageMax, pageNum} = this.state
    console.log(dataList)
    if(pageNum === pageMax) {
      Taro.showToast({
        icon: "none",
        title: '已经没有了',
        duration: 2000
      })
      return;
    }
    fetch({
      url: API_RSPUBLISH_LIST + `?pageNum=${pageNum + 1}`
    })
    .then((res) => {
      console.log('分页参数',res, pageNum + 1)
      const {data: {data, status}} = res
      if(status === 200) {
        data.list.map((item) => {
          console.log('分页', item)
          dataList.push(item)
        })
        console.log('数据',dataList)
        this.setState({
          dataList,
          pageNum: pageNum + 1
        })
      }
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

      <ScrollView
        className='home'
        style={{height: getWindowHeight(true)}}
        scrollY
        refresherEnabled={true}
        refresherThreshold={100}
        refresherDefaultStyle="white"
        refresherBackground="#fe871f"
        refresherTriggered={this.state.refresherTriggered}
        onRefresherPulling={() => {
          console.log('onRefresherPulling...');
        }}
        onRefresherRefresh={() => {
          if (this._freshing) return;
          console.log('onRefresherRefresh');
          this._freshing = true;
          this.pageListData();
        }}
        onRefresherRestore={(e) => {
          console.log('onRestore:', e);
        }}
        onRefresherAbort={(e) => {
          console.log('onAbort', e);
        }}
        onScrollToLower={this.ScrollToLower}
        >
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
