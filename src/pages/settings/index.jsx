import React, { useState } from 'react'
import { View, Text, Input, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { addRecord } from '@/api'

export default function SettingsPage() {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [cycleLength, setCycleLength] = useState(28)
  const [mood, setMood] = useState('')
  const [symptoms, setSymptoms] = useState('')
  const [note, setNote] = useState('')

  const handleSubmit = async () => {
    try {
      await addRecord({
        date: startDate,
        endDate,
        cycleLength,
        mood,
        symptoms,
        note
      })
      Taro.showToast({ title: '提交成功', icon: 'success' })
      Taro.navigateBack()
    } catch (err) {
      Taro.showToast({ title: '提交失败', icon: 'error' })
    }
  }

  return (
    <View className="settings-page">
      <Text>设置页面</Text>
      <Input placeholder="开始日期" onInput={(e) => setStartDate(e.detail.value)} />
      <Input placeholder="结束日期" onInput={(e) => setEndDate(e.detail.value)} />
      <Input placeholder="周期天数" type="number" onInput={(e) => setCycleLength(Number(e.detail.value))} />
      <Input placeholder="心情" onInput={(e) => setMood(e.detail.value)} />
      <Input placeholder="症状" onInput={(e) => setSymptoms(e.detail.value)} />
      <Input placeholder="备注" onInput={(e) => setNote(e.detail.value)} />
      <Button onClick={handleSubmit}>提交</Button>
      <Button onClick={() => Taro.navigateBack()}>
  返回上一页
</Button>
    </View>
  )
}
