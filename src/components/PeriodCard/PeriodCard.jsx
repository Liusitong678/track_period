import React, { useState, useEffect } from 'react'
import { View, Text, Input, Button, Picker } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './PeriodCard.scss'
import { getPeriodInfo } from '@/api'
import { formatDateToChinese, formatDateToChineseWithoutYear } from '@/utils/formatDate'
import { preventRapidClick } from '@/utils/preventClick'

export default function PeriodCard() {

  const [status, setStatus] = useState('') // 状态：normal、period、ovulation、first
  const [day, setDay] = useState(1)
  const [currentDate, setCurrentDate] = useState('')

  // 日期和周期相关
  const [lastStartDate, setLastStartDate] = useState('')
  const [lastEndDate, setLastEndDate] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [nextExpectedStart, setNextExpectedStart] = useState('')
  const [cycleLength, setCycleLength] = useState('')
  const [periodLength, setPeriodLength] = useState('')
  const [cycleInput, setCycleInput] = useState('') // 用户首次输入的周期值

  const hasPeriodData = startDate 


  // 当前日期（圆圈）
  useEffect(() => {

    // const now = new Date()
    // test
    const now = new Date('2025-04-14') 
    const day = now.getDate().toString().padStart(2, '0')
    console.log("day",day);
    
    setCurrentDate(`${day}`)
  }, [])

  // 获取周期信息
  useEffect(() => {
    getPeriodInfo().then(data => {
      console.log('页面收到的数据:', data)
      if (!data.success) {
        Taro.showToast({ title: '加载失败', icon: 'error' })
        return
      }

      if (data.firstTime) {
        // setStatus('first')
        setStatus(data.status)
      } else {
        setStatus(data.status)
        setLastStartDate(data.lastStartDate)
        setLastEndDate(data.lastEndDate)
        setStartDate(data.startDate)
        setEndDate(data.endDate)
        setNextExpectedStart(data.nextExpectedStart)
        setPeriodLength(data.periodLength)
        setCycleLength(data.cycleLength)
        setDay(data.currentDay)
      }
    }).catch(() => {
      Taro.showToast({ title: '加载失败', icon: 'error' })
    })
  }, [])

  // 用户点击月经开始/结束按钮
  const handlePeriodClick = async () => {
    if (!preventRapidClick()) return
    const action = status === 'period' ? 'end' : 'start'
    try {
      const res = await Taro.cloud.callFunction({
        name: 'updatePeriod',
        data: { 
          action,
          testDate: '2025-04-14' // 👈 仅开发测试时使用 testttttt
         },
        
      })
      const result = res.result
      if (result.success) {
        Taro.showToast({ title: result.message, icon: 'success' })
  
        // ✅ 关键：再次调用获取最新信息
        const refreshed = await getPeriodInfo()
        if (refreshed.success) {
          setStatus(refreshed.status)
          setLastStartDate(refreshed.lastStartDate)
          setLastEndDate(refreshed.lastEndDate)
          setStartDate(refreshed.startDate)
          setEndDate(refreshed.endDate)
          setNextExpectedStart(refreshed.nextExpectedStart)
          setPeriodLength(refreshed.periodLength)
          setCycleLength(refreshed.cycleLength)
          setDay(refreshed.currentDay)
        }
      } else {
        Taro.showToast({ title: result.message || '操作失败', icon: 'none' })
      }
    } catch (err) {
      console.error('调用云函数失败:', err)
      Taro.showToast({ title: '操作失败', icon: 'error' })
    }
  }
  

  const goToSettings = () => {
    Taro.navigateTo({ url: '/pages/settings/index' })
  }

  return (
    <View>

<View className="period-card">
        <View className="header">
          <Text className="subtitle">月经周期</Text>
          <View className="setting" onClick={goToSettings}>设置</View>
        </View>

        <View className={`circle ${status}`}>
          <Text className="day">{currentDate} 日</Text>
          <Text className="status-text">
            {status === 'period' ? '月经中' : status === 'ovulation' ? '排卵期' : '平常日'}
          </Text>
        </View>

        <View className="start-btn" onClick={handlePeriodClick}>
          {status === 'period' ? '月经结束' : '月经开始'}
        </View>
      </View>
      {hasPeriodData && (
        <View className="info_card">
          <View className="info">
            <View className='start_period'>
              {lastStartDate && lastEndDate && (
                <Text>上月：{formatDateToChineseWithoutYear(lastStartDate)} - {formatDateToChineseWithoutYear(lastEndDate)}</Text>
              )}
              {cycleLength&&<Text>月经周期：{cycleLength} 天</Text>}             
              {startDate && <Text>本月月经开始时间：{formatDateToChinese(startDate)}</Text>}
              {endDate && <Text>本月月经结束时间：{formatDateToChinese(endDate)}</Text>}
              {periodLength &&<Text>经期天数：{periodLength} 天</Text>}
              {nextExpectedStart && <Text>下月月经开始时间：{formatDateToChinese(nextExpectedStart)}</Text>}
            </View>
          </View>
        </View>
      )}


    </View>
  )
}
