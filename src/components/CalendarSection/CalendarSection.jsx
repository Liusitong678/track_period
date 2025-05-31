import React, { useState } from 'react'
import { View, Text, Picker, Button, Image  } from '@tarojs/components'
import { AtCalendar } from 'taro-ui'
import moon from '@/assets/moon.png'
import Taro from '@tarojs/taro'
import './CalendarSection.scss'

export default function CalendarSection() {
    const [selectedMonth, setSelectedMonth] = useState('')
    const [monthList, setMonthList] = useState(generateMonthOptions())
    const [selectedLabel, setSelectedLabel] = useState('查找往月')


    function generateMonthOptions() {
        const now = new Date()
        const list = []
        for (let i = 1; i <= 12; i++) { // 从1开始，跳过当前月
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
        const label = `${date.getFullYear()}年${String(date.getMonth() + 1).padStart(2, '0')}月`
        const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        list.push({ label, value })
        }
        return list
    }
  

    const handleMonthChange = (e) => {
        const index = e.detail.value
        const month = monthList[index]
        setSelectedMonth(month.value)
        setSelectedLabel(month.label)
      }
      

  const handleDayClick = (item) => {
    console.log('你点击了日期：', item)
  }

  const goToHistory = () => {
    if (selectedMonth) {
      Taro.navigateTo({ url: `/pages/history/index?month=${selectedMonth}` })
    } else {
      Taro.showToast({ title: '请选择月份', icon: 'none' })
    }
  }

  return (
    <View className="calendar-section">
      <View className="header">
        <View className="icon">
            <Image src={moon} />
        </View>
        <View className="history-select">
        <Picker mode="selector" range={monthList} rangeKey="label" onChange={handleMonthChange}>
            <View className="picker-btn">{selectedLabel}</View>
        </Picker>

        <View className="go-btn" size="mini" onClick={goToHistory}>前往</View>
        </View>

      </View>


      {/* 你可以在这里插入一个 <Calendar /> 组件，或根据当月数据绘制日历格子 */}
      <View className="calendar-grid">
        <View className="calendar-title">月经日历：</View>
        <AtCalendar 
            onDayClick={handleDayClick}
            isSwiper={false}
            marks={[
            { value: '2025-05-01' },
            { value: '2025-05-02' },
            { value: '2025-05-03' }
            ]}
        />


      </View>
    </View>
  )
}
