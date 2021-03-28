/*
包含n个工具函数的模块
 */

/*
用户主界面路由
 dashen: /dashen
 laoban: /laoban
用户信息完善界面路由
 dashen: /dasheninfo
 laoban: /laobaninfo
 判断是否已经完善信息？ user.header是否有值
 判断用户类型： user.type
 */

/*
返回对应的路由路径
*/
export function getRedirectTo(type, header) {
  let path = ''
  //type
  if (type==='Boss' || type ==='牛人'){
    path = '/'
  }
  //header
  if (!header){ //没有值，返回信息完善界面的path
    path = '/info'
  }

  return path
}

/*
字符串保留首尾两位，中间字符串由*星号替换
 */

// str代表需要处理的字符串，num为超过多少字符时执行此操作

export function parseStringToStar (str, num) {
  const reg =  /^(..).+(..)$/g;
  return str.length > num ?  str.replace(reg, "$1...$2") : str
}

//
export function getNewName(name, num) {
  let len = 0;
  let reallen = 0;
  for (let j = 0; j < name.length; j++) {
    if (name.charCodeAt(j) > 127 || name.charCodeAt(j) === 94) {
      len += 2;
    } else {
      len++;
    }
    if (len < num + 1) {
      reallen++;
    }
  }
  if (len > num) {
    name = name.substr(0, reallen) + '...';
  }
  return name;
}

export function dateFormat(val) {
  let d = new Date(),time;
  const year = new Date(val).getFullYear(); //获取当前年份
  const month = new Date(val).getMonth() + 1; //获取当前月份（0——11）
  const date = new Date(val).getDate();
  let hours = new Date(val).getHours();
  let minutes = new Date(val).getMinutes();
  if (hours >=0  && hours < 6){
    hours = '凌晨' + (hours < 10 ? '0'+ hours : hours);
  }else if (hours >= 6 && hours < 12){
    hours = '早上' + hours;
  }else if (hours >= 12 && hours < 13){
    hours = '中午' + hours;
  }else if (hours >= 13 && hours < 18){
    hours = '下午' + hours;
  }else {
    hours = '晚上' + hours;
  }
  if (minutes < 10){
    minutes = '0' + minutes
  }

  // 同年非同天显示月日时分，同年同月且同日则显示时分，否则显示年月日时分
  if (d.getFullYear()  === year  && d.getDate() !== date){
    time = month + '月' + date + '日' + '\n' + hours + ':' + minutes
  }else if (d.getFullYear() + (d.getMonth() + 1) + d.getDate() === year + month + date){
    time = hours + ':' + minutes
  }else {
    time = year + '年' + month + '月' + date + '日' + '\n' + hours + ':' + minutes
  }
  return time
}
// 计算生日
export function birthDate(date){
  let d = new Date(),time
  let arr =  date.split('.')
  time = d.getFullYear() - arr[0]
  if ((d.getMonth() + 1 - arr[1]) < 0 ){
   time -= 1
  }

  return time
}
