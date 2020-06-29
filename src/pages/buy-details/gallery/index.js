import Taro, { Component } from '@tarojs/taro'
import { View, Text, Swiper, SwiperItem, Image } from '@tarojs/components'
import './index.scss'

export default class Gallery extends Component {
  static defaultProps = {
    list: []
  }

  state = {
    current: 0
  }

  handleChange = (e) => {
    const { current } = e.detail
    this.setState({ current })
  }

  render () {
		const { list } = this.props
		console.log('传递数据', list)
    const { current } = this.state
    return (
      <View className='item-gallery'>
        <Swiper
          className='item-gallery-swiper'
          current={current}
          onChange={this.handleChange}
        >
          {
            <SwiperItem
              className='item-gallery-swiper-item'
            >
              <Image
                className='item-gallery-swiper-item-img'
                src={list.imgSrc}
              />
            </SwiperItem>
          }
        </Swiper>
        <View className='item-gallery-indicator'>
          <Text className='item-gallery-indicator-txt'>
            {`${current + 1}`}
          </Text>
        </View>
      </View>
    )
  }
}
