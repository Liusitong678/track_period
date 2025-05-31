let lastClickTime = 0

export function preventRapidClick(threshold = 1000) {
  const now = Date.now()
  if (now - lastClickTime < threshold) {
    return false // ❌ 阻止重复点击
  }
  lastClickTime = now
  return true // ✅ 允许点击
}
