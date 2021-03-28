import axios from 'axios'
export default function ajax(url, data={}, type='GET') {
  if (type==='GET'){
    //拼请求参数字符串
    //data:{username: tom,password: 123}
    // paramStr:username=tom&password=123
    let paramStr = ''
    Object.keys(data).forEach(key => {
      paramStr += key + '=' + data[key] + '&'
    })
    if (paramStr){
      paramStr =  paramStr.substring(0, paramStr.length-1)
    }
    //使用axios发get请求
    return  axios.get('/api' + url + '?' + paramStr)
  } else {//发送POST请求
    // 使用axios发post请求
    return  axios.post('/api' + url, data)
  }
}
