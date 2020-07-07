import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import rightArrow from './assets/right-arrow.png'
import './index.scss'

export default class InfoBase extends Component {
  static defaultProps = {
    data: {}
  }

  render() {
    const { data } = this.props
    console.log('infoBase', data)

    return (
      <View className='item-info-base'>
        <View className='item-info-base-header'>
          <View className='item-info-base-header-wrap'>
            <Text className='item-info-base-header-name'>人力出租（{data.workerType}）</Text>
            <Text className='item-info-base-header-desc'>{data.station}</Text>
          </View>
          <View className='item-info-base-header-star'>
            <Text className='item-info-base-header-star-txt'>
              {/* {`${parseFloat(itemStar.goodCmtRate) || 0}%`} */}
							99.8%
            </Text>
            <Text className='item-info-base-header-star-link'>{'好评率>'}</Text>
          </View>
        </View>

        <View className='item-info-base-price'>
          <Text className='item-info-base-price-symbol'>¥</Text>
          <Text className='item-info-base-price-txt'>
            {/* {data.activityPrice || data.retailPrice} */}
						{data.dollar}
          </Text>
          {/* <Text className='item-info-base-price-origin'>
            ¥80
          </Text> */}

        </View>
      </View>
    )
  }
}
