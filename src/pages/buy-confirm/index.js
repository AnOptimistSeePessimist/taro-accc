import Taro, {Component} from '@tarojs/taro'
import {View, Text, ScrollView, Button} from '@tarojs/components'
import { getWindowHeight } from '@utils/style'
import Address from './address'
import Information from './information'
import Footer from './footer'
import './index.scss'


export default class BuyConfirm extends Component{

	config = {
		navigationBarTitleText: '下单确认'
	}

	constructor(props){
		super(props)
		this.state = {
			listData: {},
			value: ''
		}
	}

	handNum = (value) => {
		this.setState({
			value
		})
	}
	

	componentDidMount(){
		console.log(JSON.parse(this.$router.params.data))
		this.setState({
			listData: JSON.parse(this.$router.params.data),
			value: this.$router.params.value
		})
	}

	render(){
		const height = getWindowHeight(false)
		const listData = this.state.listData
		const value = this.state.value
		return(
			<View className='buy-comfirm'>

			 <ScrollView
					scrollY
					className='item-warp'
					style={{height}}
				>
				  <Address />
					<Information listData={listData} value={value} onhandNum={this.handNum}/>
				</ScrollView>
				<View className='item-footer'>
						<Footer value={value} listData={listData}/>
				</View>
			</View>
		)
	}
} 
