import ajax from "./ajax";

// 注册接口
export const reqRegister = (user) => ajax('/register', user, 'POST')
// 登录接口
export const reqLogin = ({username, password}) => ajax('/login',{username,password},'POST')
//更新用户个人信息接口
export const reqUpdateUser = (user) => ajax('/update', user, 'POST')
//保存牛人工作/项目经历接口
export const reqExp = (exp) => ajax('/exp', exp, 'POST')
//修改牛人工作/项目经历接口
export const reqUpdateExp = (exp) => ajax('/updateExp', exp, 'POST')
//获取牛人所有经历接口
export const reqExpList = () => ajax('/explist')
//获取牛人经历接口
export const reqGetExp = (_id) => ajax('/getexp', _id)
//boss身份认证接口
export const reqIdentity = ({name, idNo, pros, cons}) => ajax('/identity', {name, idNo, pros, cons}, 'POST')
//boss身份认证信息更改
export const reqUpdateIde = (data) => ajax('/ideStatus', data, 'POST')
//获取boss身份认证接口
export const reqIdentityMsg = () => ajax('/identitymsg')
//获取用户信息
export const reqUser = () => ajax('/user')
//获取用户列表
export const reqUserList = (type) => ajax('/userlist', {type})
//获取boss对应职位信息列表
export const reqBossList = (postName) => ajax('/posts/postlist', postName)
// 获取当前用户的聊天消息列表
export const reqChatMsgList = () => ajax('/msglist')
//修改指定消息为已读
export const reqReadMsg = (from) => ajax('/readmsg', {from}, 'POST')

/*公共接口*/
// 获取职位列表
export const postList = () => ajax('/assets/trade')
// 省市区三级联动(静态资源.json文本)
export const cityList = () => ajax('/jsons/pca-code.json')
// 获取百度地图接口地点输入提示信息
export const reqAddrTip = (data) => ajax('/addr', data, 'POST')
// 获取百度地图接口逆地理编码
export const reqAddrCode = (address) => ajax('/geocoding', address, 'POST')
