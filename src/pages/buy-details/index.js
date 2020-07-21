import Taro, { Component } from '@tarojs/taro'
import { View, Text, Swiper, SwiperItem, ScrollView, Button, Picker } from '@tarojs/components'
import Gallery from './gallery'
import InfoBase from './infoBase'
import InfoParam from './infoParam'
import Footer from './footer'
import classnames from 'classnames'
import { getWindowHeight } from '@utils/style'
import { AtFloatLayout, AtTag, AtInputNumber, AtButton, AtList,
  AtListItem,} from 'taro-ui'

import './index.scss'

export default class BuyDetails extends Component {
  constructor(props) {
    super(props);
    const eventChannel = this.$scope
    console.log(eventChannel)
    this.state = {
      value: '1',
      isOpeneds: false,
      loaded: false,
      selected: {},
      dataImg: {},
      dataList: '',
      textTitle: '请选择:规格',
      dollar: '',
      safety: '',
      endTime: [['a', 'b'], [['c','d','e'], ['s','r','t']]],
      list: [
        {
          id: 1,
          value: '1',
          text: '08:00-16:00 (共计8小时)',
          checked: false,
          time: 8,
        },
        {
          id: 2,
          value: '2',
          text: '08:00 - 12:00 (共计4小时) ',
          checked: false,
          time: 4,
        },
        {
          id: 3,
          value: '3',
          text: '12:00 - 16:00 (共计4小时)',
          checked: false,
          time: 4,
        },
      ]
    }

  }

  config = {
    navigationBarTitleText: '商品详情'
  }

  componentDidMount() {
    this.getSystemInfoSync()
  }

  componentWillPreload (params) {
    return this.fetchData(params.item)
  }

  fetchData (item) {
    console.log('《《《《',JSON.parse(item))
    const data = JSON.parse(item)
    this.setState({
      dataImg: data,
      dollar: data.price * 4 + '-' +data.price * 8
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

  handleOpened = () => {
    this.setState({
      isOpeneds: !this.state.isOpeneds
    })
  }

  handleClose = () => {
    this.setState({
      isOpeneds: false
    })
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

  handleBuy = () => {
    // Taro.showToast({
    //   title: '暂时只支持加入购物车',
    //   icon: 'none'
    // })
    const { dataImg } = this.state;
    console.log('传入数据', dataImg)
    Taro.navigateTo({ url: `/pages/buy-confirm/index?data=${JSON.stringify(dataImg)}&value=${this.state.value}&dollar=${this.state.dollar}&textTitle=${this.state.textTitle}` })

  }

  handleClickCatogory = (category) => {
    const {dataImg, list } = this.state;
    const newList = list.slice();
    newList.forEach((item) => {
      if (item.id === category) {
        item.checked = !item.checked;
        if(item.checked){
          this.setState({
            textTitle: `已选：${item.text}`,
            dollar: dataImg.price * item.time
          })
        } else {
          this.setState({
            textTitle: '请选择:规格',
            dollar: dataImg.price * 4 + '-' + dataImg.price * 8
          })
        }
        this.setState({
          list: newList,
        });
      } else {
        item.checked = false;
        this.setState({
          list: newList,
        });
      }
    });
  };

  handleValueChange = (value) => {
    this.setState({ value,});
  };

  getSystemInfoSync = () => {
    const res = Taro.getSystemInfoSync()
    const safety = res.screenHeight - res.safeArea.bottom
    this.setState({
      safety
    })
  }


  render() {
    const height = getWindowHeight(false)
    const { dataImg, isOpeneds, textTitle, dollar, safety } = this.state
    console.log(dataImg)
    console.log('屏幕高度', height)
    return (
      <View className='buy-details'>
        <ScrollView
          scrollY
          className='item-warp'
          style={{ height, paddingBottom: `${safety+40}px` }}
        >
          <Gallery list={dataImg.listImg} />
          <InfoBase data={dataImg}/>
          <InfoParam />
        </ScrollView>
        {/* <Float isOpened={isOpeneds}  onHandleClose={this.handleClose} data={dataImg}/> */}
        <AtFloatLayout
          isOpened={isOpeneds}
          scrollY
          onClose={this.handleClose}
        >
          <View className='float-item'>
            <View className='float-item-title'>
              <View className='float-item-title-img'>
                <Image
                  className='img'
                  src={dataImg.imgSrc}
                />
              </View>
              <View className='float-item-title-text'>
                <Text className='dollar'>￥{dollar}</Text>
                <Text>{textTitle}</Text>
              </View>
            </View>

            <View className='category'>
              <View className='at-article__h3'>规格</View>
              <View className='tag-wrapper'>
                {
                  this.state.list.map((item) => {
                    return (
                      <AtTag
                        key={item.value}
                        className={classnames('tag', item.checked && 'tag-active')}
                        active={item.checked}
                        type='primary'
                        onClick={() => this.handleClickCatogory(item.id)}
                      >
                        {item.text}
                      </AtTag>
                    );
                  })
                }
              </View>
            </View>

            <View className='setting-spec'>
              <Text>工人人数</Text>
              <AtInputNumber
                className='at-input-number'
                min={1}
                max={dataImg.rsNum}
                step={1}
                value={this.state.value}
                onChange={this.handleValueChange}
              />
            </View>

            <Picker value={0} range={this.state.endTime} className='out-of-work-time' mode='multiSelector' >
              <AtList className='end-list'>
                <AtListItem className='end' title='工作地点-' extraText={this.state.endTime} />
              </AtList>
            </Picker>
            
            <AtButton className='release' formType='submit' onClick={this.handleBuy}>确定</AtButton>
          </View>
        </AtFloatLayout>
        <View className='item-footer' style={{paddingBottom: `${safety}px`}}>
          <Footer onAdd={this.handleAdd} onIsOpened={this.handleOpened}/>
        </View>
      </View>
    )
  }

}
