const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const OPENID = wxContext.OPENID
  const action = event.action // 'start' | 'end'
   // var now = new Date()
  var now = event.testDate ? new Date(event.testDate) : new Date()
  const todayStr = formatDate(now)
  const monthKey = todayStr.slice(0, 7) // e.g., '2025-04'
  try {
    // 获取用户当前记录
    const res = await db.collection('period_info')
      .where({ userId: OPENID })
      .orderBy('createdAt', 'desc')
      .limit(1)
      .get()

    let updateData = {
      userId: OPENID,
      updatedAt: new Date(),
      monthKey
    }

    let existing = res.data[0]

    if (action === 'start') {
      updateData.startDate = todayStr
      updateData.status = 'period'
      updateData.endDate = null // ✅ 清空本月月经结束时间
      // if (existing?.startDate) {
      //   //自动计算月经周期
      //   const prev = new Date(existing.startDate)
      //   // const now = new Date(todayStr)
      //   const calcCycle = Math.floor((now - prev) / (1000 * 60 * 60 * 24))
      //   if (calcCycle >= 15 && calcCycle <= 60) {
      //     updateData.cycleLength = calcCycle
      //   } else {
      //     console.warn(`跳过周期计算，值为 ${calcCycle}，不在合理范围`)
      //   }
      // }
      
      // 如果上一条月经记录存在（不一定是当月）
      const lastRes = await db.collection('period_info')
        .where({ userId: OPENID })
        .orderBy('startDate', 'desc')
        .limit(1)
        .get()

      const prev = lastRes.data[0]
      if (prev?.startDate && prev.startDate !== todayStr) {
        const prevStart = new Date(prev.startDate)
        const diff = Math.floor((now - prevStart) / (1000 * 60 * 60 * 24))
        if (diff >= 15 && diff <= 60) {
          updateData.cycleLength = diff
        }
      }
    } else if (action === 'end') {
      if (!existing || !existing.startDate) {
        return {
          success: false,
          message: '请先点击“月经开始”'
        }
      }

      const start = new Date(existing.startDate)
      const periodLength = Math.max(1, Math.floor((now - start) / (1000 * 60 * 60 * 24)) + 1)

      updateData.endDate = todayStr
      updateData.periodLength = periodLength
      updateData.status = 'normal'

      // 如果有上次的 start/end，填为上月数据
      updateData.lastStartDate = existing.startDate
      updateData.lastEndDate = todayStr

      // 预测下次开始时间（前提是已知周期）
      if (existing.cycleLength) {
        const next = new Date(start)
        next.setDate(start.getDate() + existing.cycleLength)
        updateData.nextExpectedStart = formatDate(next)
      } 
    }

    if (existing) {
      // ✅ 更新旧记录
      await db.collection('period_info').doc(existing._id).update({
        data: updateData
      })
    } else {
      // ✅ 创建新记录
      updateData.createdAt = new Date()
      updateData.status = updateData.status || 'period'
      await db.collection('period_info').add({
        data: updateData
      })
    }

    return {
      success: true,
      message: action === 'start' ? '已记录开始' : '已记录结束',
      ...updateData
    }

  } catch (e) {
    console.error('updatePeriod error:', e)
    return {
      success: false,
      message: '更新失败'
    }
  }
}

function formatDate(date) {
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}
