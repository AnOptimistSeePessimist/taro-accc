import Taro, {Component} from '@tarojs/taro';
import {View, Text, Image, ScrollView, Button} from '@tarojs/components';
import {connect} from '@tarojs/redux'
import {drawerShowHide} from '../../actions/home'
import {AtDrawer} from 'taro-ui'
import Menu from './menu'
import './index.scss';

function listImgSrc(){
  return `https://picsum.photos/seed/${Math.ceil(Math.random() * 100)}/110/70`
}


@connect(({ home }) => ({
  home
}), (dispatch) => ({
  drawerShowHides(data) {
    dispatch(drawerShowHide(data))
  }
}))
class Home extends Component {
  config = {
    navigationBarTitleText: '空运帮'
  }

  todrawerShowHide = (e) => {
    this.props.drawerShowHides(true)
 }

 constructor(props){
  super(props);
  this.state = {
    dataList: [{
      id: 1,
      date: '2020-06-23',
      startTime: '08: 00',
      endTime: '12:00',
      time: '4',
      station: '上海国际机场货站',
      dollar: '100',
      workerType: '装卸工人',
      workerNum: '2',
      imgSrc: listImgSrc(),
      listImg: [
        {img: listImgSrc()},
        {img: listImgSrc()},
      ]
    }, {
      id: 2,
      date: '2020-06-23',
      startTime: '08: 00',
      endTime: '16:00',
      time: '8',
      station: '上海浦东国际机场货站',
      dollar: '60',
      workerType: '叉车工',
      workerNum: '5',
      imgSrc: listImgSrc(),
      listImg: [
        {img: listImgSrc()},
        {img: listImgSrc()},
      ]
    }, {
      id: 3,
      date: '2020-06-23',
      startTime: '08: 00',
      endTime: '16:00',
      time: '8',
      station: '测试地点测试地点测试地点测试地点测试地点测试地点测试地点测试地点',
      dollar: '120',
      workerType: '组板工',
      workerNum: '50',
      imgSrc: listImgSrc(),
      listImg: [
        {img: listImgSrc()},
        {img: listImgSrc()},
      ]
    }, {
      id: 4,
      date: '2020-06-23',
      startTime: '08: 00',
      endTime: '16:00',
      time: '8',
      station: '上海国际机场货站测试地点测试地点',
      dollar: '10',
      workerType: '杂工',
      workerNum: '100',
      imgSrc: listImgSrc(),
      listImg: [
        {img: listImgSrc()},
        {img: listImgSrc()},
      ]
    }, {
      id: 5,
      date: '2020-06-23',
      startTime: '08: 00',
      endTime: '16:00',
      time: '8',
      station: '上海国际机场货站测试地点测试地点测试地点测试地点测试地点测试地点',
      dollar: '2244',
      workerType: '装卸工人',
      workerNum: '12',
      imgSrc: listImgSrc(),
      listImg: [
        {img: listImgSrc()},
        {img: listImgSrc()},
      ]
    }, {
      id: 6,
      date: '2020-06-23',
      startTime: '08: 00',
      endTime: '16:00',
      time: '8',
      station: '上海国际机场货站测试地点测试地点测试地点测试地点测试地点测试地点测试地点',
      dollar: '1',
      workerType: '杂工',
      workerNum: '1',
      imgSrc: listImgSrc(),
      listImg: [
        {img: listImgSrc()},
        {img: listImgSrc()},
      ]
    }, {
      id: 7,
      date: '2020-06-23',
      startTime: '08: 00',
      endTime: '16:00',
      time: '8',
      station: '上海国际机场货站测试地点',
      dollar: '60',
      workerType: '叉车工',
      workerNum: '5',
      imgSrc: listImgSrc(),
      listImg: [
        {img: listImgSrc()},
        {img: listImgSrc()},
      ]
    }]
  }
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
							const {id, date, startTime, endTime, time, station, dollar, workerType, workerNum, imgSrc} = item
							if (evenNum) {
								return (
									<Menu listImg={item} key={id}/>
								)
							}
						})}
					</View>

					<View className='data-list'>
						{this.state.dataList.map((item, index) => {
							const evenNum = index % 2 === 1
							const {id, date, startTime, endTime, time, station, dollar, workerType, workerNum, imgSrc} = item
							if (evenNum) {
								return (
									<Menu listImg={item} key={id}/>
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