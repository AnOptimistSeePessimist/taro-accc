import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import Menu from './menu'
import { API_RSPUBLISH_LIST } from '@constants/api';
import fetch from '@utils/request';
import './index.scss'

function listImgSrc(){
  return `https://picsum.photos/seed/${Math.ceil(Math.random() * 100)}/110/70`
}

class LeaseInformation extends Component {

	config = {
		navigationBarTitleText: '人力信息'
	}

	constructor(props){
		super(props);
		this.state = {
			dataList: [],
			buyData: [],
		}
	}

	componentDidMount(){
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
	
  componentWillPreload (params) {
    return this.fetchData(params.buyData)
  }

  fetchData (item) {
    console.log('《《《《',JSON.parse(item))
		const data = JSON.parse(item)
		this.setState({buyData: data})
  }

	render() {
	 console.log('测试',this.state.buyData)
		return (
			<View className='buy-manpower'>
				{/* <View className='panel-title' style={{ backgroundColor: '#F7F7F7', paddingTop: '5px', paddingBottom: '5px' }}>人力信息</View> */}
				<View className='information-title'>
					<View className='data-list'>
						{this.state.dataList.map((item, index) => {
							const evenNum = index % 2 === 0
							const {publishRecid} = item
							item.imgSrc = listImgSrc()
              item.listImg = [
                { img: listImgSrc() },
                { img: listImgSrc() }
              ]
							if (evenNum) {
								return (
									<Menu listImg={item} key={publishRecid}/>
								)
							}
						})}
					</View>

					<View className='data-list'>
						{this.state.dataList.map((item, index) => {
							const evenNum = index % 2 === 1
							const {publishRecid} = item
							item.imgSrc = listImgSrc()
              item.listImg = [
                { img: listImgSrc() },
                { img: listImgSrc() }
              ]
							if (evenNum) {
								return (
									<Menu listImg={item} key={publishRecid}/>
								)
							}
						})}
					</View>

				</View>
			</View>
		)
	}
}
export default LeaseInformation
