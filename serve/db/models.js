/*
包含n个操作数据库集合数据的Model模块
1.连接数据库
  1.1. 引入mongoose
  1.2. 连接指定数据库（URL只有数据库是变化的）
  1.3. 获取连接对象
  1.4. 绑定连接完成的监听（用来提示连接成功）
2.得到对应特点集合的Model
  2.1. 字义Schema（描述文档结构）
  2.2. 定义Model（与集合对应， 可以操作集合）
  2.3. 向外暴露Model
 */
const md5 = require('blueimp-md5')
/*1. 连接数据库*/
//1.1. 引入mongoose
const mongoose =  require('mongoose')
const {ObjectId} = require("bson");

// mongose时全局设置
mongoose.set('useFindAndModify', false)
//1.2. 连接指定数据库（URL只有数据库是变化的）
mongoose.connect('mongodb://localhost:27017/serve', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
//1.3. 获取连接对象
//1.4. 绑定连接完成的监听（用来提示连接成功）
mongoose.connection.on('connected', () => {
  console.log('db connect success!')
})

/*2.得到对应特点集合的Model*/
//2.1. 字义Schema（描述文档结构）
const userSchema = mongoose.Schema({// 指定文档的结构： 属性名/属性值的类型，是否是必须的，默认值
  username:{type: String, required:true},//用户名
  password:{type: String, required:true},//密码
  type:{type: String, required:true},//用户类型：dashen/laoban
  header: {type: String},//头像名称
  sex: {type: String}, //性别
  person: {type: String}, //身份
  name: {type: String}, //用户真实性名
  birthDate: {type: String},//出生日期
  education: {type: String}, //教育背景
  info: {type: String},//个人或职位简介
  company: {type: String},//公司名称
  city: {type: String}, //意向城市
  post_status: {type: String}, // 求职状态
  job: {type: String}, //意向职位
  salary: {type: String}, // 工资
  certificate: {type: String}, //证书、奖项
})
//2.2. 定义Model（与集合对应， 可以操作集合）
const UserModel = mongoose.model('user',userSchema)
//2.3. 向外暴露Model
exports.UserModel = UserModel

// 定义exp集合的文档结构 (工作/项目经历)
const ExpSchema = mongoose.Schema({
  pid: {type: ObjectId, required: true}, // 关联牛人id
  name: {type: String, required: true}, // 公司名/项目名称
  post: {type: String, required: true}, // 职务、角色
  time: {type: String, required: true}, // 工作、项目时间
  describe: {type: String, required: true}, // 描述
  result: {type: String}, // 业绩
  trade: {type: String}, // 行业
  link: {type: String} // 作品/项目链接
})

//定义能操作exp集合数据的Model
const ExpModel = mongoose.model('exp', ExpSchema) // 集合为： exps
// 向外暴露的Model
exports.ExpModel = ExpModel


// 定义chats集合的文档结构
const chatSchema = mongoose.Schema({// 指定文档的结构： 属性名/属性值的类型，是否是必须的，默认值
  from:{type: String, required:true},// 发送用户的id
  to:{type: String, required:true},// 接收用户的id
  chat_id:{type: String, required:true},// from和to组成的字符串
  content: {type: String, required:true},// 内容
  read: {type: Boolean, default: false},// 标识是否已读
  create_time: {type: Number},// 创建时间
})
//定义能操作chats集合数据的Model
const ChatModel = mongoose.model('chat',chatSchema) // 集合为： chats
// 向外暴露的Model
exports.ChatModel = ChatModel

// 定义identities集合的文档结构
const identitySchema = mongoose.Schema({
  pid: {type: ObjectId, required: true}, //关联boss的_id
  name: {type: String, required: true}, // 关联boss姓名
  idNo: {type: String, required: true}, // 身份证号码
  cons: {type: String, required: true}, // 身份证正面照
  pros: {type: String, required: true}, // 身份证反面
  status: {type: Number, default: 2}, // 实名状态参数值( 0、1、2)
  remark: {type: String, default: '认证中'},// 实名状态(0->认证失败, 1->认证成功, 2->认证中)
  create_time: {type: Number, default: Date.now()},// 创建时间
})
//定义能操作identities集合数据的Model
const IdentityModel = mongoose.model('identity', identitySchema) // 集合为： identities
// 向外暴露的Model
exports.IdentityModel = IdentityModel

//定义position集合的文档结构
const positionSchema = mongoose.Schema({
  pid: {type: ObjectId, required: true}, //关联boss的_id
  name: {type: String, required: true}, // 关联boss姓名
  postName: {type: String, required: true}, // 职位名称
  post: {type: String, required: true}, // 职位类型
  salary: {type: String, required: true}, // 薪资
  experience: {type: String, required: true}, // 经验
  education: {type: String, required: true}, // 学历
  city: {type: String, required: true}, // 工作城市
  addr: {type: String, required: true}, // 公司地址坐标
  duty: {type: String, required: true}, // 岗位职责
  requirement: {type: String, required: true}, // 任职要求
  status: {type: Number, default: 2}, // 审核状态参数:0,1,2,3
  remark: {type: String, default: '审核中'},// 审核状态值：0->审核失败，1->审核通过，2->审核中，3->停止招聘
  create_time: {type: Number, default: Date.now()},// 创建时间
})
//定义能操作positions集合数据的Model
const PositionModel = mongoose.model('position', positionSchema) // 集合为： positions
// 向外暴露的Model
exports.PositionModel = PositionModel

//module.exports = xxx //一次性暴露（唯一）

/*分别暴露,可多个*/
//exports.xxx = value
//exports.yyy = value
