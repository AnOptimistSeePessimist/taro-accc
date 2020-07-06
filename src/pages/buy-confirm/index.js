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
			listData: {}
		}
	}
	

	componentWillMount(){
		console.log(JSON.parse(this.$router.params.data))
		this.setState({
			listData: JSON.parse(this.$router.params.data)
		})
	}

	render(){
		const height = getWindowHeight(false)
		const listData = this.state.listData
		return(
			<View className='buy-comfirm'>

			 <ScrollView
					scrollY
					className='item-warp'
					style={{height}}
				>
				  <Address />
					<Information listData={listData} />
				</ScrollView>
				<View className='item-footer'>
						<Footer />
				</View>
			</View>
		)
	}
} 
