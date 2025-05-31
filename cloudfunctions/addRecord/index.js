// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const { date, endDate, cycleLength, mood, symptoms, note } = event

  try {
    await db.collection('records').add({
      data: {
        date,
        endDate,
        cycleLength,
        mood,
        symptoms,
        note,
        createTime: new Date()
      }
    })
    return { code: 0, msg: '添加成功' }
  } catch (err) {
    console.error('添加失败：', err)
    return { code: 1, msg: '添加失败', err }
  }
}
