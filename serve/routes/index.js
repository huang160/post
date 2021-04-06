var express = require('express');
var router = express.Router();
var fs = require('fs');
var request = require('request')

const md5 = require('blueimp-md5')
const {current, parseStringToStar} =  require('../utils')
const {UserModel,ChatModel,IdentityModel,ExpModel} = require('../db/models')
const filter = {password: 0,__v:0} //指定过滤的属性

/* GET home page. */
router.get('/',  function(req, res) {
  res.render('index', { title: 'Express' });
});

// 用户注册
router.post('/register',  async (req, res) => {
  //读取请求参数数据
  const {username, password, type} = req.body
  //处理,判断用户是否已经存在,如果存在,返回提升错误的信息，如果不存在,保存
  //查询（根据username）
  UserModel.findOne({username}, function (err, user) {
    //如果user有值(已存在)
    if (user){
      res.send({code:1, msg: '此用户已存在'})
    }else {
        new UserModel({username, password:md5(password), type}).save(function (error, user){
          //生成一个cookie(userid: user._id),并交给浏览器保存
          res.cookie('userid',user._id,{maxAge: 1000*60*60*24})
          //返回包含user的json数据
          const data = {username, type, _id: user._id}
          res.send({code:0, data})
      })
    }
  })
})

//登录路由
router.post('/login', async (req,res) => {
  const {username,password} = req.body
  //根据username和password查询数据库users,如果没有,返回提示错误的信息, 如果有, 返回登陆成功信息
  UserModel.findOne({username,password:md5(password)},filter,function (err,user) {
    if (user){ //登录成功
      //生成一个cookie(userid: user._id),并交给浏览器保存
      res.cookie('userid',user._id,{maxAge: 1000*60*60*24})
      //返回登录成功信息(包含user)
      res.send({code: 0, data: user})
    }else {//登录失败
      res.send({code: 1, msg: '用户名或密码不正确!' })
    }
  })
})

//更新用户信息的路由
router.post('/update',function (req, res) {
  //从请求的cookie得到userid
  const {userid} = req.cookies
  //如果不存在，直接返回一个提示信息
  if (!userid){
    return  res.send({code: 1, msg: '请先登录'})
  }
  //存在， 根据userid更新对应的user文档数据
  //得到提交的用户数据
  const user = req.body  // 没有_id
  const {header} = user  // 获取头部base64码
  // 判断头像是否上传成功
  if (header && header.indexOf('.png') !== -1){
      user.header = header
  }else if (header) {
    const headerImg = Buffer.from(header, 'base64')
    fs.writeFile(`public/images/${current() + userid}.png`, headerImg ,function (err) {
      if (err){
        return err
      }
    })
    user.header = `${current() + userid}.png`
  }

  UserModel.findByIdAndUpdate({_id: userid}, user, {fields: filter, new: true}, function (error, data) {
    if (!userid){
      // 通知浏览器删除userid cookie
      res.clearCookie('userid')
      // 返回一个提示信息
      res.send({code: 1, msg: '请先登录'})
    }else {
      //返回更新后的user新数据
      res.send({code: 0 ,data})
    }
  })
})

router.post('/exp',  function (req, res) {
  //从请求的cookie得到userid
  const {userid} = req.cookies
  //如果不存在，直接返回一个提示信息
  if (!userid){
    return  res.send({code: 1, msg: '请先登录'})
  }
  //读取请求参数数据
  const data =  req.body
  //处理,判断经历是否已经存在,如果存在,返回提示错误的信息，如果不存在,保存
  //查询
  ExpModel.findOne(data.pid, function (err, ex) {
    if (!data.pid) {
      // 通知浏览器删除userid cookie
      res.clearCookie('userid')
      // 返回一个提示信息
      res.send({code: 1, msg: '请先登录'})
    }
    //经历存在，不保存
    if (ex){
      res.send({code:1, msg: '此经历已存在'})
    }else {
      new ExpModel(data).save(function (error, exp){
        //返回包含experience的json数据
        res.send({code:0, data: exp})
      })
    }
  })
})

router.post('/updateExp', function (req, res) {
  const {_id, name, post, time, describe, result, trade, link} = req.body
  ExpModel.findByIdAndUpdate({_id}, {name, post, time, describe, result, trade, link}, {fields: filter, new: true}, function (err, data) {
    if (!data){
      res.send({code: 1, msg: '经历不存在'})
    }else {
      res.send({code: 0, data})
    }
  })
})

router.get('/explist', function (req, res) {
  const {userid} = req.cookies
  //查找用户所有经历
  ExpModel.find({pid: userid}, filter,function (err, exp) {
    //无经历，不保存
    if (!exp){
      res.send({code: 1, msg: '填写经历更能获得Boss青睐哦~'})
    }else {
      res.send({code: 0, data: exp})
    }
  })
})

router.get('/getexp', function (req, res) {
  const {_id} = req.query
  //查找有无指定经历
  ExpModel.findOne({_id}, function (err, exp) {
    //经历存在
    if (!exp){
      res.send({code:1, msg: '经历不存在'})
    }else {
      res.send({code: 0, data: exp})
    }
  })
})

// 获取用户信息的路由
router.get('/user', function (req, res){
  //从请求的cookie得到userid
  const {userid} = req.cookies
  //如果不存在，直接返回一个提示信息
  if (!userid){
    return res.send({code: 1, msg: '请先登录'})
  }
  //根据userid查询对应的user
  UserModel.findOne({_id: userid}, filter, function (error, user) {
    if (!user){
      // 通知浏览器删除userid cookie
      res.clearCookie('userid')
      // 返回一个提示信息
      return res.send({code: 1, msg: '请先登录'})
    }
    res.send({code: 0, data: user})
  })
})

// 获取头像的路由
router.get( '/images/*', function (req, res){
  res.sendFile(req.url);
})

// 获取牛人用户列表（根据类型）
router.get('/userlist', function (req, res) {
  const {type} = req.query
  const data = {
    header: 1,
    sex: 1,
    person: 1,
    name: 1,
    birthDate: 1,
    education: 1,
    info: 1,
    city: 1,
    post_status: 1,
    job: 1,
    salary: 1,
    certificate: 1
  }
  UserModel.aggregate([
    {$match: {type}}, // 过滤筛选出牛人用户
    {$project: data}, // 只显示其字段
    // 连表查询, form:子级集合 ,localField：父级id匹配foreignField：子级pid
    {
      $lookup: {
        from: 'exps',
        localField: '_id',
        foreignField: 'pid',
        as: 'exp'    // 返回json数据的对象名
      }
    },
  ]).then(exp => {
    res.send({code: 0, data: exp})
  }).catch(() => {
    res.send({code:1, msg: '未找到相关数据'})
  })
})

// 获取当前用户所有相关聊天信息列表
router.get('/msglist', function (req, res) {
  // 获取cookie中的userid
  const userid = req.cookies.userid
  // 查询得到所有user文档数组
  UserModel.find(function (err, userDocs) {
    // 用对象存储所有user信息: key为user的_id, val为name和header组成的user对象(以下2种写法)
    //1.
    const users = {} // 对象容器
    userDocs.forEach(doc => {
      users[doc._id] = {name: doc.name,header: doc.header,company: doc.company,job:doc.job}
    })
    //2.
    /*const users = userDocs.reduce((users, user) => {
      users[user._id] = {username: user.username, header: user.header}
    },{})*/
    /*
    查询userid相关的所有聊天信息
     参数1: 查询条件
     参数2: 过滤条件
     参数3: 回调函数
     */
    ChatModel.find({'$or': [{from: userid}, {to: userid}]}, filter, function (err, chatMsgs) {
      //  返回包含所有用户和当前用户相关的所有聊天消息的数据
      res.send({code: 0, data: {users, chatMsgs}})
    })
  })
})

/*
修改指定消息为已读
 */
router.post('/readmsg', function (req, res) {
  // 得到请求中的from和to
  const from = req.body.from
  const to = req.cookies.userid
  /*
  更新数据库中的chat数据
  参数1： 查询条件
  参数2： 更新为指定的数据对象
  参数3： 是否1次更新多条， 默认只更新一条
  参数4： 更新完成的回调函数
   */
  ChatModel.update({from, to, read: false}, {read: true}, {multi: true}, function (err, doc) {
    res.send({code: 0, data: doc.nModified}) // 更新的数量
  })
})

// boss身份认证
router.post('/identity', function (req, res) {
  // 从cookies获取boss的_id
  const {userid} = req.cookies
  const {pros, cons, name, idNo} = req.body
  if(!userid) res.send({code: 1, msg: '请先登录~'})
  IdentityModel.findOne({'$or': [{pid: userid}, {name, idNo}]}, function (err, data){
    if (data){
      res.send({code: 1, msg: '用户已上传过实名认证'})
    } else {
      if (pros !== '' && cons !== ''){
        const prosImg = Buffer.from(pros, 'base64') // 正面照base64格式转换
        const consImg = Buffer.from(cons, 'base64') // 反面照base64格式转换
        fs.writeFile(`public/identityImgs/${userid}_pros.png`, prosImg ,err => err )
        fs.writeFile(`public/identityImgs/${userid}_cons.png`, consImg ,err => err )
      }
      const doc = {
        pros: userid + '_pros.png',
        cons: userid + '_cons.png',
        pid: userid,
        name,
        idNo
      }
      new IdentityModel(doc).save(function (err, identity){
        // 返回包含identity的json数据
        const {remark, status} = identity
        const data = { name: parseStringToStar(name), idNo: parseStringToStar(idNo), remark, status}
        res.send({code: 0, data})
      })
    }
  })
})

// boss身份认证信息更改
router.post('/ideStatus', function (req, res){
  // 从cookies获取boss的_id
  const {userid} = req.cookies
  const {pros, cons, name, idNo, remark, status} = req.body
  if(!userid) res.send({code: 1, msg: '请先登录~'})
  if (pros !== '' && cons !== ''){
    const prosImg = Buffer.from(pros, 'base64') // 正面照base64格式转换
    const consImg = Buffer.from(cons, 'base64') // 反面照base64格式转换
    fs.writeFile(`public/identityImgs/${userid}_pros.png`, prosImg ,err => err )
    fs.writeFile(`public/identityImgs/${userid}_cons.png`, consImg ,err => err )
  }
  const doc = {
    pros: userid + '_pros.png',
    cons: userid + '_cons.png',
    name,
    idNo,
    remark,
    status
  }
  IdentityModel.findOneAndUpdate({pid: userid}, doc, {new: true},function (err, ide){
    if (ide) {
      res.send({code: 0, data: {name: parseStringToStar(name), idNo: parseStringToStar(idNo), status, remark}})
    } else {
      res.send({code: 1, msg: '无此用户，请重新登录~'})
    }
  })
})

// 获取boss身份认证信息
router.get('/identitymsg', function (req, res){
  // 从cookies获取boss的_id
  const {userid} = req.cookies
  if (!userid) res.send({code: 1, msg: '请先登录~'})
  IdentityModel.findOne({pid: userid}, {__v:0, pros: 0, cons: 0}, function (err, identity){
    if (identity){
      const data = {
        status: identity.status,
        remark: identity.remark,
        name: parseStringToStar(identity.name),
        idNo: parseStringToStar(identity.idNo)
      }
      res.send({code: 0, data})
    }else {
      res.send({code: 1, msg: '未认证'})
    }
  })
})

// 获取boss实名认证图片的路由
router.get( '/identityImgs/*', function (req, res){
  //从请求的cookie得到userid
  const {userid} = req.cookies
  //如果不存在，直接返回一个提示信息
  if (!userid){
    return  res.send({code: 1, msg: '请先登录'})
  } else {
    res.sendFile(req.url);
  }
})

// 获取百度地图接口地点输入提示
router.post('/addr', function (req, res) {
  const {query, region} = req.body
  const ak = 'MBZMd8x62ipirNXCtvGrm0PDr3j4WXH2'
  const url = 'http://api.map.baidu.com/place/v2/suggestion'
  request(encodeURI(`${url}?query=${query}&region=${region}&city_limit=true&output=json&ak=${ak}`), {json: true}, function (err, response, body){
    if (!err && body.status === 0){
      res.send({code: 0, data: body})
    }
  })
})

// 获取百度地图接口逆地理编码
router.post('/geocoding', function (req, res) {
  const {address} = req.body
  const ak = 'MBZMd8x62ipirNXCtvGrm0PDr3j4WXH2'
  const url = 'http://api.map.baidu.com/geocoding/v3/'
  request(encodeURI(`${url}?address=${address}&output=json&ak=${ak}`), {json: true}, function (err, response, body){
    if (!err && body.status === 0){
      res.send({code: 0, data: body})
    }
  })
})


module.exports = router;
