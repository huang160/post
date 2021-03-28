export function dateFormat(val) {
  let d = new Date(),
    time
  const year = new Date(val).getFullYear() //获取当前年份
  const month = new Date(val).getMonth() + 1 //获取当前月份（0——11）
  const date = new Date(val).getDate()
  let hours = new Date(val).getHours()
  let minutes = new Date(val).getMinutes()
  if (hours >= 0 && hours < 6) {
    hours = '凌晨 ' + (hours < 10 ? '0' + hours : hours)
  } else if (hours >= 6 && hours < 12) {
    hours = '早上 ' + hours
  } else if (hours >= 12 && hours < 13) {
    hours = '中午 ' + hours
  } else if (hours >= 13 && hours < 18) {
    hours = '下午 ' + hours
  } else {
    hours = '晚上 ' + hours
  }
  if (minutes < 10) {
    minutes = '0' + minutes
  }

  // 同年非同天显示月日时分，同年同月且同日则显示时分，否则显示年月日时分
  if (d.getFullYear() === year && d.getDate() !== date) {
    time = month + '月' + date + '日' + '\n' + hours + ':' + minutes
  } else if (
    d.getFullYear() + (d.getMonth() + 1) + d.getDate() ===
    year + month + date
  ) {
    time = hours + ':' + minutes
  } else {
    time =
      year + '年' + month + '月' + date + '日' + '\n' + hours + ':' + minutes
  }
  return time
}
