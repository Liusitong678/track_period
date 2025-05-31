// src/components/MonthCard/MonthCard.jsx
import React from 'react'
import { View, Text, Image } from '@tarojs/components'
import logo from '@/assets/logo.png'
import './MonthCard.scss'

export default function MonthCard({ year, monthEn, monthCn }) {
  return (
    <View className='month_module'>
      <View className="logo-bar">
        <Image src={logo} mode="aspectFit" className='logo' />
        <Text className="title">月潮period</Text>
      </View>

      <View className="history_month">
        <View className="year-box">
          <Text className="year-top">{year}</Text>
        </View>
        <View className="month-box">
          <Text className="month-en">{monthEn}</Text>
          <Text className="month-cn">{monthCn}</Text>
        </View>
      </View>
    </View>
  )
}
