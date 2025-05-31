// utils/formatDate.js

export function formatDateToChinese(dateStr) {
if (typeof dateStr !== 'string') {
    return ''
}

const [year, month, day] = dateStr.split('-')
return `${year}年${month}月${day}日`
}
  

export function formatDateToChineseWithoutYear(date) {
    if (!date) return ''
  
    let dateStr = ''
    if (typeof date === 'string') {
      dateStr = date
    } else if (date instanceof Date) {
      dateStr = date.toISOString().split('T')[0]
    } else {
      return ''
    }
  
    const [_, month, day] = dateStr.split('-')
    return `${parseInt(month)}月${parseInt(day)}日`
  }
  