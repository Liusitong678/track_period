// src/api/index.js
import Taro from '@tarojs/taro'

/**
 * 调用云函数通用方法
 * @param {string} name 云函数名称
 * @param {object} data 传递给云函数的数据
 * @returns {Promise} 返回 Promise 对象
 */
export const callCloudFunction = (name, data = {}) => {
  return new Promise((resolve, reject) => {
    wx.cloud.callFunction({
      name,
      data,
      success: (res) => {
        resolve(res.result)
      },
      fail: (err) => {
        console.error(`[CloudFunction: ${name}] failed:`, err)
        reject(err)
      }
    })
  })
}

/**
 * 添加记录（示例：添加月经记录）
 */
export const addRecord = (recordData) => {
  return callCloudFunction('addRecord', recordData)
}
// 获取经期信息
export const getPeriodInfo = () => {
    return wx.cloud.callFunction({
      name: 'getPeriodInfo'
    }).then(res => {
      console.log('[云函数 getPeriodInfo 返回]', res)  // 🧠 重点查看这个日志
      return res.result
    })
  }

// 你可以继续添加其他 API 方法，如 getRecords, deleteRecord 等
