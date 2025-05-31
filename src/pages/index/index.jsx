import React from 'react'
import { View, Image, Text } from '@tarojs/components'
import PeriodCard from '@/components/PeriodCard/PeriodCard'
import CalendarSection from '@/components/CalendarSection/CalendarSection'
import logo from '@/assets/logo.png' // 使用 alias 或相对路径
import './index.scss'

export default function Index() {
  return (
    <View className="homepage">
      <View className="logo-bar">
        <Image src={logo} mode="aspectFit" className='logo' />
        <Text className="title">月潮period</Text>
      </View>

      {/* 顶部周期显示模块 */}
      <PeriodCard />

      {/* 后续模块可继续添加 */}
      <CalendarSection />
      {/* <MoodCard /> */}
      {/* <SymptomCard /> */}
    </View>
  )
}
