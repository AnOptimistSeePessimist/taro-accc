import Taro, { Component } from '@tarojs/taro';
import { View, Text, ScrollView } from '@tarojs/components';
import { getWindowHeight } from '@utils/style';
import { API_RSPUBLISH_LIST } from '@constants/api';
import chunk from 'lodash.chunk';
import throttle from 'lodash.throttle';
import fetch from '@utils/request';
import Menu from './menu'
import './index.scss';

function listImgSrc() {
  return `https://picsum.photos/seed/${Math.ceil(Math.random() * 100)}/110/70`
}

class LeaseInformation extends Component {
  config = {
    navigationBarTitleText: '人力信息'
  }

  constructor(props) {
    super(props);
    this.state = {
      dataList: [],
      refresherTriggered: false,
      pageNum: 1,
      pageMax: '',
			total: -1, // 列表总数
			worktypeName: this.$router.params.worktypeName
    }
    this._pageSize = 10; // 每页数据量
  }

  componentWillMount() {
		this.refresherRefresh();
		this.fetchData(this.$router.params.item)
  }

  componentWillPreload (params) {
    return this.fetchData(params.item,)
  }

  fetchData (item) {
    //console.log('《《《《',JSON.parse(item))
    const data = JSON.parse(item)
    this.setState({
      dataList: data,
    })
  }

  
  // 获取工单
  fetchWorkOrder = (pageNum, pageSize, callback) => {
    fetch({url: API_RSPUBLISH_LIST + `?pageNum=${pageNum}&pageSize=${pageSize}&worktypeName=${this.state.worktypeName}`})
      .then((res) => {
        const {data, status} = res.data;

        if (status === 200) {
          callback(data);
        }
      })
      .catch(() => {
        this._loadMore = false;
        Taro.hideLoading();
      });
  };

 // 下拉刷新
 refresherRefresh = () => {
  this._loadMore = false;
  Taro.showLoading({
    mask: true,
    title: '正在刷新中'
  });
  this._pageNum = 1;
  this.setState({
    refresherTriggered: true,
  }, () => {
    this.fetchWorkOrder(this._pageNum, this._pageSize, (data) => {
      this.setState({
        dataList: data.list,
        refresherTriggered: false,
      }, () => {
        Taro.hideLoading();
        this._freshing = false;
      });
    });
  });
};


  scrollToLower = throttle(() => {
    console.log('onScrollToLower...');
    if (this._loadMore) return;
    this._loadMore = true;
    this.loadMore();
  }, 1000);

   // 加载更多也叫上拉刷新
   loadMore = () => {
    console.log('loadMore...');

    Taro.showLoading({
      mask: true,
      title: '正在加载更多',
    });

    this._pageNum = this._pageNum + 1;

    this.fetchWorkOrder(this._pageNum, this._pageSize, ({list, total, nextPage}) => {
      this.setState((prevState) => {
        console.log('下拉',prevState)
        const dataListLen = prevState.dataList.length;
        const matrixDataList = chunk(prevState.dataList, this._pageSize);
        const mdlLen = matrixDataList.length;
        let newestDataList;

        if (nextPage === 0) {
          this._pageNum = Math.floor(total / this._pageSize);
        }

        if (dataListLen === total) {
          matrixDataList[mdlLen - 1] = list;
          newestDataList = matrixDataList.flat();
        } else {
          if (Math.ceil(dataListLen / this._pageSize) === Math.ceil(total / this._pageSize)) {
            matrixDataList[mdlLen - 1] = list;
            newestDataList = matrixDataList.flat();
          } else {
            newestDataList = prevState.dataList.concat(list);
          }
        }

        console.log('metrixWorkOrderList: ', matrixDataList);

        return {
          dataList: newestDataList,
        };
      }, () => {
        Taro.hideLoading();
        this._loadMore = false;
      });
    });
  };

  onDateChange = e => {
    this.setState({
      date: e.detail.value
    });
  };

  render() {
    console.log('workTypeList: ', this.state.dataList);
    return (
      <View className='home'>
        <ScrollView
          className='home-scroll-view'
          scrollY
          enableFlex={true}
          style={{height: getWindowHeight(false)}}
          refresherEnabled={true}
          refresherThreshold={100}
          refresherDefaultStyle="black"
          refresherBackground="white"
          refresherTriggered={this.state.refresherTriggered}
          onRefresherRefresh={() => {
            if (this._freshing) return;
            this._freshing = true;
            this.refresherRefresh();
          }}
         
          onScrollToLower={() => this.scrollToLower()}
        > 
        <View style={{height: `${Taro.getSystemInfoSync().windowHeight + 1}px`}}>
          <View className='placeholder'>23123</View>

              <View className='data-item'>
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
          <View className='placeholder'>23123</View>
        </View>  
        </ScrollView>
      </View>
    );
  }
}

export default LeaseInformation;
