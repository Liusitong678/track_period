import zh from './zh'
import en from './en'
import Taro from '@tarojs/taro'


const langMap = { zh, en }

function getSystemLang() {
  const lang = Taro.getSystemInfoSync().language
  return lang.startsWith('zh') ? 'zh' : 'en'
}

let currentLang = Taro.getStorageSync('lang') || getSystemLang()

export function t(key) {
  return langMap[currentLang][key] || key
}

export function setLang(lang) {
  currentLang = lang
  Taro.setStorageSync('lang', lang)
}
