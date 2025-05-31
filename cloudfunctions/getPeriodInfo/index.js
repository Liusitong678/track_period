// 云函数 getPeriodInfo.js

const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const OPENID = wxContext.OPENID || 'test-openid'
  const monthKey = event.monthKey || getMonthKey(new Date()) // 可选传入月份

  try {
    const res = await db.collection('period_info')
      .where({
        userId: OPENID,
        monthKey: monthKey
      })
      .limit(1)
      .get()

    if (!res.data.length) {
      return {
        success: true,
        firstTime: true
      }
    }

    const data = res.data[0]
    const {
      lastStartDate,
      lastEndDate,
      startDate,
      endDate,
      cycleLength,
      periodLength = 7,
      nextExpectedStart
    } = data

    const today = new Date()
    let currentDay = 1
    let status = 'normal'
    let ovulation1Start = null
    let ovulation1End = null
    let ovulation2Start = null
    let ovulation2End = null

    if (startDate && cycleLength) {
      const start = new Date(startDate)
      const nextStart = new Date(start)
      nextStart.setDate(start.getDate() + cycleLength)

      const diffDay = Math.floor((today - start) / (1000 * 60 * 60 * 24))
      currentDay = (diffDay % cycleLength + cycleLength) % cycleLength + 1

      const end = new Date(start)
      end.setDate(start.getDate() + periodLength - 1)

      // 排卵期计算
      const ovulation1 = new Date(nextStart)
      ovulation1.setDate(ovulation1.getDate() - 14)
      ovulation1Start = formatDate(new Date(ovulation1.getTime() - 2 * 86400000))
      ovulation1End = formatDate(new Date(ovulation1.getTime() + 2 * 86400000))

      const ovulation2 = new Date(nextStart)
      ovulation2.setDate(nextStart.getDate() + cycleLength - 14)
      ovulation2Start = formatDate(new Date(ovulation2.getTime() - 2 * 86400000))
      ovulation2End = formatDate(new Date(ovulation2.getTime() + 2 * 86400000))

      // 状态判断
      if (today >= new Date(start) && today <= end) {
        status = 'period'
      } else if (
        (today >= new Date(ovulation1Start) && today <= new Date(ovulation1End)) ||
        (today >= new Date(ovulation2Start) && today <= new Date(ovulation2End))
      ) {
        status = 'ovulation'
      }
    }

    return {
      success: true,
      firstTime: false,
      status,
      currentDay,
      lastStartDate: lastStartDate ? formatDate(lastStartDate) : null,
      lastEndDate: lastEndDate ? formatDate(lastEndDate) : null,
      startDate: startDate ? formatDate(startDate) : null,
      endDate: endDate ? formatDate(endDate) : null,
      nextExpectedStart: nextExpectedStart ? formatDate(nextExpectedStart) : null,
      ovulation1Start,
      ovulation1End,
      ovulation2Start,
      ovulation2End,
      cycleLength: cycleLength || null,
      periodLength
    }

  } catch (e) {
    console.error('getPeriodInfo error:', e)
    return {
      success: false,
      message: '服务异常'
    }
  }
}

// 工具函数
function formatDate(date) {
  const d = new Date(date)
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

function getMonthKey(date) {
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}
