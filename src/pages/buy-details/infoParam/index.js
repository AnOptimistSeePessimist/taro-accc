import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.scss'

export default class InfoParam extends Component {
  static defaultProps = {
    list: [1,2,3,4,5]
  }

  render () {
    const { list } = this.props
    return (
      <View className='item-info-param'>
        <View className='item-info-param-title'>
          <Text className='item-info-param-title-txt'>工人信息</Text>
        </View>
        {list.map((item, index) => (
          <View key={index} className='item-info-param-item'>
            <Text className='item-info-param-item-name'>姓名</Text>
            <Text className='item-info-param-item-value'>张三</Text>
          </View>
        ))}
      </View>
    )
  }
}
