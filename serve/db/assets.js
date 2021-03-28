/*1. 连接数据库*/
//1.1. 引入mongoose
const mongoose =  require('mongoose')

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

/*
管理员集合
 */
const AdminSchema = mongoose.Schema({
  username: {type: String, require: true},
  password: {type: String, require: true},
  tel: {type: String, require: true},
  sex: {type: String},
  addr: {type: String}
})

const AdminModel = mongoose.model('admin', AdminSchema)
exports.AdminModel = AdminModel

/*
行业,职位集合
 */
const PostSchema = mongoose.Schema({
  id: {type: String, require: true},
  name: {type: String, require: true}
})

const PostModel = mongoose.model('post', PostSchema)
exports.PostModel = PostModel

const PostDepSchema = mongoose.Schema({
  _name: {type: String, require: true},
  depid: {type: String, require: true}
})

const PostDepModel = mongoose.model('post_dep', PostDepSchema)
exports.PostDepModel = PostDepModel

