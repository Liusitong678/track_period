import React, { useEffect, useState } from 'react'
import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import datanull from '@/assets/datanull.png'
import MonthDisplay from '@/components/MonthDisplay/MonthDisplay'
import './index.scss'

export default function HistoryPage() {
  const [year, setYear] = useState('')
  const [monthEn, setMonthEn] = useState('')
  const [monthCn, setMonthCn] = useState('')
  const [record, setRecord] = useState(null)

  useEffect(() => {
    const params = Taro.getCurrentInstance().router.params
    if (params.month) {
      const [yearStr, monthStr] = params.month.split('-')
      const month = parseInt(monthStr)
      const monthEnList = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
      const monthCnList = ['', '一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']

      setYear(yearStr)
      setMonthEn(monthEnList[month])
      setMonthCn(monthCnList[month])
      fetchRecord(params.month)
    }
  }, [])

  const fetchRecord = async (monthKey) => {
    try {
      const res = await Taro.cloud.database().collection('period_info')
        .where({ monthKey })
        .get()

      if (res.data.length) {
        setRecord(res.data[0])
      } else {
        setRecord(null)
        Taro.showToast({ title: '该月无记录', icon: 'none' })
      }
    } catch (err) {
      console.error('查询失败', err)
      Taro.showToast({ title: '查询失败', icon: 'error' })
    }
  }

  return (
    <View className="history-page">
      <MonthDisplay year={year} monthEn={monthEn} monthCn={monthCn} />

      {record ? (
        <View className="record-card">
          {record.startDate && <Text>开始日期：{record.startDate}</Text>}
          {record.endDate && <Text>结束日期：{record.endDate}</Text>}
          {record.periodLength && <Text>经期天数：{record.periodLength} 天</Text>}
          {record.cycleLength && <Text>周期长度：{record.cycleLength} 天</Text>}
          {record.nextExpectedStart && <Text>下次月经预测：{record.nextExpectedStart}</Text>}
        </View>
      ) : (
        <View className="empty">
          <Image src={datanull} className='empty_img' />
          <Text className='empty_text'>
            <Text>没有该月的数据呢～</Text>
            <Text>去查查别的月份吧小主 0.0</Text>
          </Text>
        </View>
      )}
    </View>
  )
}
