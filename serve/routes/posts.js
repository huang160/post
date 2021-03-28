var express = require('express');
var router = express.Router();
const filter = {__v:0} //指定过滤的属性

const {PositionModel, UserModel, IdentityModel} = require('../db/models')

/* GET assets listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// 职位发布
router.post('/postAdd', function (req, res) {
  // 从cookies获取boss的_id
  const {userid} = req.cookies //boss关联id
  IdentityModel.findOne({pid: userid}, function (error, ide) {
    if (ide) {
      const {status} = ide
      if (status === 1) {
        const data = req.body
        Object.assign(data, {pid: userid})
        new PositionModel(data).save(function () {
          // 返回包含identity的json数据
          res.send({code: 0, msg: '职位发布成功~'})
        })
      } else {
        res.send({code: 1, msg: '未实名~'})
      }
    } else {
      res.send({code: 1, msg: '未实名~'})
    }
  })
})

// 职位列表获取
router.get('/position', function (req, res) {
  // 从cookies获取boss的_id
  const {userid} = req.cookies //boss关联id
  PositionModel.find({pid: userid}, filter, function (err, position) {
    if (position){
      res.send({code: 0, data: position})
    }else {
      res.send({code: 1, msg: '还未添加职位'})
    }
  }).sort({create_time: -1})
})

// 职位信息获取
router.get('/postmsg' ,function (req, res){
  const {_id} = req.query
  PositionModel.findOne({_id}, filter, function (err, postMsg){
    if (postMsg){
      res.send({code: 0, data: postMsg})
    }else {
      res.send({code: 1, msg: '找不到该职位相关信息'})
    }
  })
})

// 职位修改
router.post('/updatepost', function (req, res) {
  // 从cookies获取boss的_id
  const {userid} = req.cookies //boss关联id
  IdentityModel.findOne({pid: userid}, function (error, ide) {
    if (ide) {
      const {status} = ide
      if (status === 1) {
        const data = req.body // 浏览器传过来的值
        Object.assign(data, {create_time: Date.now()})
        const {_id} = data // 获取对应职位_id
        PositionModel.findByIdAndUpdate({_id}, data, {fields: filter, new: true},function (err, postMsg){
          if (!_id){
            res.send({code:1, msg: '找不到该职位相关信息'})
          }else {
            res.send({code:0, data: postMsg})
          }
        })
      }
    } else {
      res.send({code: 1, msg: '未实名~'})
    }
  })
})

// 获取boss信息跟其对应的职位信息
router.get('/postlist', function (req, res) {
  const {postName} = req.query
  UserModel.aggregate([
    {$match: {type: 'Boss'}}, // 过滤筛选出boss的用户
    {$project: {name : 1 , company : 1 , job: 1, header: 1}}, // 只显示其字段
    // 连表查询, form:子级集合 ,localField：父级id匹配foreignField：子级pid
    {
      $lookup: {
        from: 'positions',
        localField: '_id',
        foreignField: 'pid',
        as: 'postLists'    // 返回json数据的对象名
      }
    }
  ]).then((data) =>  {
    let list = []
    data.forEach(val => {
      if (val.postLists.length !== 0){
        list.push(val)
        list.forEach((value, index) => {
          for (let i = value.postLists.length -1; i >= 0; i--){
            if (value.postLists[i].post !== postName || value.postLists[i].status !== 1){
              list[index].postLists.splice(i, 1)
            }
          }
          if (list[index].postLists.length === 0){
            list.splice(index, 1)
          }
        })
      }
    })
    res.send({code:0, data: list})
  }).catch(() => {
    res.send({code:1, msg: '未找到相关数据'})
  })
})

module.exports = router;