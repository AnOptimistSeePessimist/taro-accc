import Taro, { Component } from '@tarojs/taro';
import { View, Text, Image, ScrollView, Button, Picker } from '@tarojs/components';
import { connect } from '@tarojs/redux'
import {dataPageList } from '../../actions/home'
import { AtDrawer, AtList, AtListItem, AtTag } from 'taro-ui'
import classnames from 'classnames';
import { API_RSPUBLISH_LIST, API_COMP_WORK_TYPE } from '@constants/api';
import fetch from '@utils/request';
import Menu from './menu'
import './index.scss';
import {formatTimeStampToTime} from '@utils/common';
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
      date: formatTimeStampToTime(Date.now()),
      // outOfdate: formatTimeStampToTime(Date.now()),
      workTypeList: (new Array(8).fill)({})

    }
  }

  componentDidMount() {
    this.pageListData();
    this.workType();
  }

  pageListData = () => {
    this.setState({
      refresherTriggered: true,
      pageNum: 1
    }, () => {
      fetch({
        url: API_RSPUBLISH_LIST + `?pageNum=${this.state.pageNum}&pageSize=${3}`,
      }).then((res) => {
        console.log('分页返回参数', res)
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

  workType = () => {
    fetch({
      url: API_COMP_WORK_TYPE + `/AC`,
    })
      .then((res) => {
        const {data: {data}} = res;
        console.log('compWorkType: ', res);
        const workTypeList = data.map((item) => {
          item.checked = false;
          return item;
        });
        this.setState({
          workTypeList,
        });
      })
      .catch(() => {});
  }

  handleClickWorkType = (typeRecId) => {
    const {workTypeList} = this.state;
    const newList = workTypeList.slice();
    let date;
    if(typeRecId === -1){
      date = formatTimeStampToTime(Date.now())
      this.setState({
        date
      })
    }
    newList.forEach((item) => {
      item.checked = false;
      if (item.typeRecId === typeRecId) {
        item.checked = true;
      }
    });

    this.setState({
      workTypeList: newList,
    });
  };

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
      url: API_RSPUBLISH_LIST + `?pageNum=${pageNum + 1}&pageSize=${3}`
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

  onDateChange = e => {
    this.setState({
      date: e.detail.value
    });
  };

  // onOutOfDateChang = e => {
  //   this.setState({
  //     outOfdate: e.detail.value
  //   });
  // }

  render() {
    console.log('workTypeList: ', this.state.workTypeList);
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
          onClose={this.onClose}
        >
          <View>
            <Picker
              className='date'
              mode='date'
              onChange={this.onDateChange}
              start={formatTimeStampToTime(Date.now())}
            >
              <AtList className='date-at-list'>
                <AtListItem className='item' title='请选择日期' extraText={this.state.date} />
              </AtList>
            </Picker>
            <View className='category'>
              <View className='at-article__h3 title'>工种</View>
                <View className='tag-wrapper'>
                  {
                    this.state.workTypeList.filter((item) => {
                      return item.workTypeName !== "销售员";
                    })
                    .map((item) => {
                      return (
                        <AtTag
                          key={item.typeRecId}
                          className={classnames('tag', item.checked && 'tag-active')}
                          active={item.checked}
                          type='primary'
                          onClick={() => this.handleClickWorkType(item.typeRecId)}
                        >
                          {item.workTypeName}
                        </AtTag>
                      );
                    })
                  }
                </View>
            </View>
            <View className='screeningReset'>
              <View className='reset screeningResetText' onClick={() => this.handleClickWorkType(-1)}>重置</View>
              <View className='screening screeningResetText'>完成</View>
            </View>
            {/* <Picker
              className='date'
              mode='date'
              onChange={this.onOutOfDateChang}
              start={formatTimeStampToTime(Date.now())}
            >
              <AtList className='date-at-list'>
                <AtListItem className='item' title='请选择结束日期' extraText={this.state.outOfdate} />
              </AtList>
            </Picker> */}
          </View>
        </AtDrawer>
      </View>
    );
  }
}

export default Home;
