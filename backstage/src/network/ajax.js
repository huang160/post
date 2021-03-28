import axios from 'axios'
import Cookie from 'js-cookie'
import store from '../store'

//创建一个axios实例
const instance = axios.create({
  timeout: 5000,
  withCredentials: true,
  headers: {
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache'
  }
})
//http request 拦截器(请求)
instance.interceptors.request.use(
  config => {
    const token = Cookie.get('token')
    if (token) {
      // 判断是否存在token，如果存在的话，则每个http header都加上token
      //请求头加上token
      config.headers.authorization = token
    }
    return config
  },
  err => {
    return Promise.reject(err)
  }
)
// http response 拦截器（响应）
instance.interceptors.response.use(
  response => {
    //拦截响应，做统一处理
    if (response.data.code) {
      switch (response.data.code) {
        case 4000:
          store.commit('clearToken')
          store.commit('clearMenu')
          location.reload()
      }
    }
    return response
  },
  //接口错误状态处理，也就是说无响应时的处理
  error => {
    return Promise.reject(error) // 返回接口返回的错误信息
  }
)
export default function ajax(url, data = {}, type = 'GET') {
  if (type === 'GET') {
    //拼请求参数字符串(query传参)
    //data:{username: tom,password: 123}
    // paramStr:username=tom&password=123
    let paramStr = ''
    Object.keys(data).forEach(key => {
      paramStr += key + '=' + data[key] + '&'
    })
    if (paramStr) {
      paramStr = paramStr.substring(0, paramStr.length - 1)
    }
    return instance({ method: 'get', url: '/api' + url + '?' + paramStr })
  } else {
    //发送POST请求
    // 使用axios发post请求
    return instance({ method: 'post', url: `/api${url}`, data })
  }
}
