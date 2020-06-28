import Taro, {Component} from '@tarojs/taro'
import {View, Text, Swiper, SwiperItem, ScrollView} from '@tarojs/components'
import Gallery from './gallery'
import InfoBase from './infoBase'
import InfoParam from './infoParam'
import Footer from './footer'
import { getWindowHeight } from '@utils/style'

export default class BuyDetails extends Component {
	constructor(props){
		super(props);
		this.state={
			loaded: false,
			selected: {},
			dataImg: {}
		}
	}

	config = {
		navigationBarTitleText: '商品详情'
	}

	componentWillMount() {
		const {item } = this.$router.params
		this.setState({
			dataImg: JSON.parse(item)
		})
	}

	toggleVisible = () => {
    this.setState({
      visible: !this.state.visible,
      selected: {}
    })
  }

	handleSelect = (selected) => {
    this.setState({ selected })
  }

	handleAdd = () => {
    // 添加购物车是先从 skuSpecValueList 中选择规格，再去 skuMap 中找 skuId，多个规格时用 ; 组合
    const { itemInfo } = this.props
    const { skuSpecList = [] } = itemInfo
    const { visible, selected } = this.state
    const isSelected = visible && !!selected.id && itemInfo.skuMap[selected.id]
    const isSingleSpec = skuSpecList.every(spec => spec.skuSpecValueList.length === 1)

    if (isSelected || isSingleSpec) {
      const selectedItem = isSelected ? selected : {
        id: skuSpecList.map(spec => spec.skuSpecValueList[0].id).join(';'),
        cnt: 1
      }
      const skuItem = itemInfo.skuMap[selectedItem.id] || {}
      const payload = {
        skuId: skuItem.id,
        cnt: selectedItem.cnt
      }
      this.props.dispatchAdd(payload).then(() => {
        Taro.showToast({
          title: '加入购物车成功',
          icon: 'none'
        })
      })
      if (isSelected) {
        this.toggleVisible()
      }
      return
    }

    if (!visible) {
      this.setState({ visible: true })
    } else {
      // XXX 加购物车逻辑不一定准确
      Taro.showToast({
        title: '请选择规格（或换个商品测试）',
        icon: 'none'
      })
    }
  }

	render(){
		const height = '480px'
		const {dataImg} = this.state
		console.log('屏幕高度', height)
		return(
			<View className='buy-details'>
				<ScrollView
					scrollY
					className='item-warp'
					style={{height}}
				>
					<Gallery list={dataImg}/>
					<InfoBase />
					<InfoParam />
					<Text>图片展示</Text>
				</ScrollView>

        <View className='item-footer'>
          <Footer onAdd={this.handleAdd} />
        </View>
			</View>
		)
	}

}