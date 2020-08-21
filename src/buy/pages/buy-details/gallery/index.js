import Taro, { Component } from '@tarojs/taro'
import { View, Text, Swiper, SwiperItem, Image } from '@tarojs/components'
import { IMAGE_PREFIX } from '@constants/api';
import './index.scss'

export default class Gallery extends Component {
  static defaultProps = {
    Img: ''
  }

  state = {
    current: 0
  }

  handleChange = (e) => {
    const { current } = e.detail
    this.setState({ current })
  }

  render () {
		const { Img } = this.props
    const { current } = this.state
    return (
      <View className='item-gallery'>
        <Swiper
          className='item-gallery-swiper'
          current={current}
          onChange={this.handleChange}
        >
            <SwiperItem
              className='item-gallery-swiper-item'
            >
              <Image
                className='item-gallery-swiper-item-img'
                src={IMAGE_PREFIX + Img}
              />
            </SwiperItem>
        </Swiper>
        <View className='item-gallery-indicator'>
          <Text className='item-gallery-indicator-txt'>
            {`${current + 1}/${1}`}
          </Text>
        </View>
      </View>
    )
  }
}
