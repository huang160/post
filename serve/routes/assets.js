var express = require('express');
var router = express.Router();

const md5 = require('blueimp-md5')
const {menu, setToken, verToken} =  require('../utils')
const {PostModel, AdminModel} = require('../db/assets')
const {IdentityModel, PositionModel} = require('../db/models')
const filter = {password: 0,__v:0} //指定过滤的属性

/* GET assets listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//管理员注册
router.post('/register', function (req, res) {
  let token = req.headers['authorization'] //获取请求头参数
  if(!token) res.send({code: 4000, msg: '请先登录~'})
  verToken(token).then(data => {
    const {code, obj} = data
    if (code === 2000 && obj.username === 'admin') {
      //获取前端提交的参数
      const {username, password, addr, tel, sex} = req.body
      //处理,判断用户是否已经存在,如果存在,返回提示错误的信息，如果不存在,保存
      //查询（根据username）
      AdminModel.findOne({_id: obj._id, username}, function (err, admin) {
        //如果user有值(已存在)
        if (admin){
          res.send({code:1, msg: '管理员已存在'})
        }else {
          new AdminModel({username, password:md5(password), addr, tel, sex})
            .save(function (error, admin){
              //返回包含user的json数据
              const data = {username, _id: admin._id, addr, tel, sex}
              res.send({code:0, data})
            })
        }
      })
    } else {
      res.send({code, msg: '无权限或用户登录凭证已过期~'})
    }
  })
})

//管理员登录
router.post('/login', function (req, res){
  const {username, password} = req.body
  //根据username和password查询数据库users,如果没有,返回提示错误的信息, 如果有, 返回登陆成功信息
  AdminModel.findOne({username, password:md5(password)}, filter,function (err, admin) {
    if (admin){ //登录成功
      //返回登录成功信息(包含user)
      setToken(username, admin._id).then( token => {
        const data = {token, menu: menu(username, password)}
        res.send({code: 0, msg: '登录成功，欢迎使用~', data})
      })
    }else {//登录失败
      res.send({code: 1, msg: '用户名或密码不正确!' })
    }
  })
})

//管理员信息更改
router.post('/update', function (req, res) {
  let token = req.headers['authorization'] //获取请求头参数
  const msg = req.body
  if(!token) res.send({code: 4000, msg: '请先登录~'})
  verToken(token).then(data => {
    const {code} = data
    if(code === 2000) {
      AdminModel.findOneAndUpdate({_id: msg._id}, msg, {fields: filter}, function (err, admin){
        if (!admin) {
          res.send({code: 1, msg: '无此用户或已销户~'})
        } else {
          res.send({code: 0, msg: '编辑已成功'})
        }
      })
    } else {
      res.send({code, msg: '请先登录~'})
    }
  })
})

//管理员删除
router.post('/del', function (req, res){
  const {_id} = req.body
  let token = req.headers['authorization'] //获取请求头参数
  if(!token) res.send({code: 4000, msg: '请先登录~'})
  verToken(token).then(data => {
    const {code} = data
    if(code === 2000) {
      AdminModel.deleteOne({_id}, function (err) {
        if (err) {
          res.send({code: 1, msg: err})
        } else {
          res.send({code: 0, msg: '删除成功！'})
        }
      })
    }else {
      res.send({code, msg: '请先登录~'})
    }
  })
})

//管理员信息获取
router.get('/adminmsg', function (req, res){
  let token = req.headers['authorization'] //获取请求头参数
  if(!token) res.send({code: 4000, msg: '请先登录~'})
  verToken(token).then(data => {
    const {code, obj} = data
    if(code === 2000) {
      AdminModel.findOne({_id: obj._id}, filter, function (err, admin){
        res.send({code: 0, data: admin})
      })
    } else {
      res.send({code, msg: '请先登录~'})
    }
  })
})

//管理员列表获取
router.get('/adminList', function (req, res){
  let token = req.headers['authorization'] //获取请求头参数
  const { page = 1, username, limit = 20, str = '' } = req.query
  if(!token) res.send({code: 4000, msg: '请先登录~'})
  verToken(token).then(data => {
    const {code} = data
    if(code === 2000) {
      let query
      if (str === '') {
        query = {}
      } else {
        query = {username: eval('/' + str + '/i')}
      }
      AdminModel.find(query, filter).limit(limit).skip((page - 1) * limit).exec(function (err, rs) {
        if (err) {
          res.send({code: 1, msg: err})
        } else {
          const admin =  rs.filter(user => {
            return user.username.indexOf(username) === -1 && user.username !== 'admin'
          })
          res.send({code: 0, count: admin.length, data: admin})
        }
      })
    } else {
      res.send({code, msg: '请先登录~'})
    }
  })
})

//身份认证信息获取
router.get('/idemsg', function (req, res){
  let token = req.headers['authorization'] //获取请求头参数
  const { page = 1, limit = 20, str = '' } = req.query
  if(!token) res.send({code: 4000, msg: '请先登录~'})
  verToken(token).then(data => {
    let query
    if (str === '') {
      query = {status: 2}
    } else {
      query = {status: 2, name: eval('/' + str + '/i')}
    }
    const {code} = data
    if (code === 2000) {
        IdentityModel.find(query, filter).sort({create_time: -1}).limit(limit).skip((page - 1) * limit).exec(function (err, ide ) {
        res.send({code: 0, count: ide.length, data: ide})
      })
    } else {
      res.send({code, msg: '请先登录~'})
    }
  })
})

// 身份证图片获取
router.get( '/identityImgs/*', function (req, res){
  let token = req.headers['authorization'] //获取请求头参数
  if(!token) res.send({code: 4000, msg: '请先登录~'})
  verToken(token).then(data => {
    const {code} = data
    if (code === 2000) {
      res.sendFile(req.url);
    }
  })
})

// 身份认证状态修改
router.post( '/status', function (req, res){
  let token = req.headers['authorization'] //获取请求头参数
  if(!token) res.send({code: 4000, msg: '请先登录~'})
  verToken(token).then(data => {
    const {code, obj} = data
    if (code === 2000) {
      AdminModel.findOne({_id: obj._id, username: obj.username}, function (error, admin) {
        if (admin) {
          const {_id, status, remark} = req.body
          IdentityModel.findByIdAndUpdate({_id}, {status, remark}, function (err, ide) {
            if (!ide){
              res.send({code: 1, msg: '未找到相关信息~'})
            } else {
              res.send({code: 0, msg: '操作成功~'})
            }
          })
        } else {
          res.send({code, msg: '请先登录~'})
        }
      })
    } else {
      res.send({code, msg: '请先登录~'})
    }
  })
})

// 获取职位及boss相关信息
router.get('/postmsg', function (req, res) {
  let token = req.headers['authorization'] //获取请求头参数
  const { page = 1, limit = 20, str = '' } = req.query
  if(!token) res.send({code: 4000, msg: '请先登录~'})
  verToken(token).then(data => {
    const {code} = data
    if (code === 2000) {
      let query
      if (str === '') {
        query = {status: 2}
      } else {
        query = {status: 2, name: eval('/' + str + '/i')}
      }
      PositionModel.find(query, filter).sort( {create_time: -1}).skip((page - 1) * limit).limit(limit).exec(function (err, post){
        if (post) {
          res.send({code: 0, count: post.length, data: post})
        }
      })
    }else {
      res.send({code, msg: '请先登录~'})
    }
  })
})

//更改职位状态信息
router.post('/postStatus', function (req, res) {
  let token = req.headers['authorization'] //获取请求头参数
  if(!token) res.send({code: 4000, msg: '请先登录~'})
  verToken(token).then(data => {
    const {code, obj} = data
    if (code === 2000) {
      AdminModel.findOne({_id: obj._id, username: obj.username}, function (error, admin){
        if (admin) {
          const {_id, status, remark} = req.body
          PositionModel.findByIdAndUpdate({_id}, {status, remark}, function (err, msg) {
            if (msg) {
              res.send({code: 0, msg: '操作成功~'})
            } else {
              res.send({code: 1, msg: '操作失败~'})
            }
          })
        } else {
          res.send({code, msg: '请先登录~'})
        }
      })
    }else {
      res.send({code, msg: '请先登录~'})
    }
  })
})

//获取二级联动职位列表
router.get('/trade', function (req, res){
  PostModel.aggregate([{
    // 连表查询, form:子级列表 ,localField：父级id匹配foreignField：子级depid
    $lookup: {
      from: 'post_deps',
      localField: 'id',
      foreignField: 'depid',
      as: 'trade_list'    // 返回json数据的对象名
    }
  }]).then(data => res.send({code: 0, data}))  //返回一个异步操作(连表查询内也可写一个回调函数)
})

// 获取省市区三级联动json数据
router.get( '/jsons/pca-code.json', function (req, res){
  res.sendFile(req.path);
})


module.exports = router;
