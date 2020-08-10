import Taro, { Component } from '@tarojs/taro';
import { View, Text, Image, ScrollView, Button } from '@tarojs/components';
import { connect } from '@tarojs/redux'
import {dataPageList } from '../../actions/home'
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
      AtDrawer: false,
      refresherTriggered: false,
      pageNum: 1,
      pageMax: '',
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

  scrollToLower = () => {
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
    this.setState({
      AtDrawer: true
    })
  }

  onClose = () => {
    this.setState({
      AtDrawer: false
    })
  }

  render() {
    return (
      <View>
        <View className='header'>
          <Text onClick={this.todrawerShowHide}>筛选</Text>
        </View>
        <View className='height-margin'></View>
        <ScrollView
          className='home'
          style={{height: getWindowHeight(true)}}
          scrollY
          enableFlex={true}
          refresherEnabled={true}
          refresherThreshold={100}
          refresherDefaultStyle="black"
          refresherBackground="white"
          refresherTriggered={this.state.refresherTriggered}
          onRefresherRefresh={() => {
            if (this._freshing) return;
            this._freshing = true;
            this.pageListData();
          }}
          onScrollToLower={this.scrollToLower}
        > 
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
        </ScrollView>

        <AtDrawer
          show={this.state.AtDrawer}
          mask
          right
          items={['菜单1', '菜单2']}
          onClose={this.onClose}
        ></AtDrawer>
      </View>
    );
  }
}

export default Home;
