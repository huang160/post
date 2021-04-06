const jwt = require('jsonwebtoken')

/*
返回对应的时间
 */
exports.current = function () {
  let d = new Date(), str = '';
  str += '_' + d.getFullYear(); //获取当前年份
  if ((d.getMonth() + 1) < 10){
    str += '0'+ (d.getMonth() + 1) ; //获取当前月份（0——11）
  }else{
    str += d.getMonth() + 1 ;
  }
  str += d.getDate() ;
  str += d.getHours() ;
  str += d.getMinutes() ;
  str += d.getSeconds() ;
  return str;
}

/*
字符串保留首尾两位，中间字符串由*星号替换
 */

// str代表需要处理的字符串

exports.parseStringToStar = function  (str) {
  if (str.length === 2){
    return str[0] + '*'
  } else {
    let new_str = ''
    // 首尾保留，所以从下标1开始，长度-1
    for (let i = 1; i<str.length - 1; i++){
      new_str += '*'
    }
    return str[0] + new_str + str[1]
  }
}

/*
返回对应的路由表
 */
exports.menu = function (username, password) {
  if (username === 'admin' && password === 'admin') {
    return [{
        path: '/index',
        name: 'home',
        label: '首页',
        icon: 'el-icon-s-home',
        url: 'Home/Home'
      },
      {
        path: '/user',
        name: 'user',
        label: '用户管理',
        icon: 'el-icon-user-solid',
        url: 'UserManage/UserManage'
      },
      {
        path: '/identity',
        name: 'identity',
        label: '身份认证',
        icon: 'el-icon-message-solid',
        url: 'Identity/Identity'
      },
      {
        path: '/post',
        name: 'post',
        label: '职位管理',
        icon: 'el-icon-suitcase',
        url: 'Post/Post'
      }]
  } else {
    return [{
        path: '/index',
        name: 'home',
        label: '首页',
        icon: 'el-icon-s-home',
        url: 'Home/Home'
      },
      {
        path: '/identity',
        name: 'identity',
        label: '身份认证',
        icon: 'el-icon-message-solid',
        url: 'Identity/Identity'
      },
      {
        path: '/post',
        name: 'post',
        label: '职位管理',
        icon: 'el-icon-suitcase',
        url: 'Post/Post'
      }]
  }
}

/*
token相关封装
1.私钥、过期时间
2.生成token
3.token解密、验证
 */
const signKey = 'cyssafaioiafha' // 私钥

// 生成
exports.setToken = function(username,userId){
  return new Promise((resolve,reject)=>{
    const token = jwt.sign({
      username:username,
      _id:userId
    }, signKey,{expiresIn: 3600*24});
    resolve(token);
  })
}

// 解密及认证
exports.verToken = function(token){
  return new Promise((resolve,reject)=>{
    const info = jwt.verify(token, signKey ,(error,res) => {
      const data={} //
      if(error){
        data.code = 4000;
        data.obj = error;
      }else{
        data.code = 2000;
        data.obj = res;
      }
      return data
    });
    resolve(info);
  })
}
