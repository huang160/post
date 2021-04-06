import io from "socket.io-client"
import {
  reqRegister,
  reqLogin,
  reqUpdateUser,
  reqIdentity,
  reqUpdateIde,
  reqIdentityMsg,
  reqUser,
  reqUserList,
  reqExp,
  reqUpdateExp,
  reqExpList,
  reqGetExp,
  reqBossList,
  reqChatMsgList,
  reqReadMsg,
  postList,
  cityList,
  reqAddrTip,
  reqAddrCode
} from '../network/index'

import {
  reqPosition,
  reqPositionMsg,
  reqPostMsg,
  reqUpdatePost
} from '../network/posts'

import {
  AUTH_SUCCESS,
  ERROR_MSG,
  RECEIVE_USER,
  RESET_USER,
  RECEIVE_IDENTITY,
  IDENTITY_MSG,
  RECEIVE_POST_LIST,
  RECEIVE_USER_LIST,
  RECEIVE_MSG_LIST,
  RECEIVE_MSG,
  MSG_READ
} from "./mutations-types";

/*
单例对象
1. 创建对象之前：判断对象是否已经存在, 只有不存在才去创建
2. 创建对象之后：保存对象
*/

function initIO(context, userid) {
  // 1. 创建对象之前：判断对象是否已经存在, 只有不存在才去创建
  if (!io.socket) {
    //连接服务器， 得到代表连接的socket对象
    io.socket = io('ws://localhost:4000') // 2. 创建对象之后：保存对象
  }
  //绑定'receiveMessage'的监听, 来接收服务器发送的消息
  io.socket.on('receiveMsg', function (chatMsg) {
    console.log('客户端接收服务器发送的消息',chatMsg)
    // 只有当chatmsg是与当前用户相关的消息, 才去分发同步的action
    if (userid===chatMsg.from || userid===chatMsg.to){
      context.commit(RECEIVE_MSG, {chatMsg, userid})
    }
  })
}

// 异步获取消息列表数据
function getMsgList(context,userid) {
  initIO(context, userid)
  reqChatMsgList().then(res => {
    if(res.data.code===0) {
      const {users, chatMsgs} = res.data.data
      // 分发同步action
      context.commit(RECEIVE_MSG_LIST, {users, chatMsgs, userid})
    }
  })
}

//异步获取boss实名认证信息
function getIdentity(context, type){
  if (type === 'Boss'){
    reqIdentityMsg().then(res => {
      if (res.data.code === 0){
        context.commit(RECEIVE_IDENTITY, res.data.data)
      }else {
        context.commit(IDENTITY_MSG, res.data.msg)
      }
    })
  }
}

//异步获取boss相关的所有职位信息
function getPostListMsg(context, type){
  if (type === 'Boss'){
    reqPositionMsg().then(res => {
      if (res.data.code === 0){
        context.commit(RECEIVE_POST_LIST, res.data.data)
      }
    })
  }
}

export default {
  // 用户注册action
  register: function (context, user) {
    return reqRegister(user).then(res => {
      if (res.data.code === 0) { // 成功
        getMsgList(context, res.data.data._id)
        getIdentity(context, res.data.data.type)
        getPostListMsg(context, res.data.data.type)
        context.commit(AUTH_SUCCESS, res.data.data)
        return res
      } else { // 失败
        context.commit(ERROR_MSG, res.data.msg)
        return res
      }
    })
  },

  // 登录异步action
  login(context, user){
    return reqLogin(user).then(res => {
      if(res.data.code === 0){
        getMsgList(context, res.data.data._id)
        getIdentity(context, res.data.data.type)
        getPostListMsg(context, res.data.data.type)
        context.commit(AUTH_SUCCESS, res.data.data)
        return res
      }else {
        context.commit(ERROR_MSG, res.data.msg)
        return res
      }
    })
  },

  // 更新用户个人信息异步action
  updateUser(context, user) {
    return reqUpdateUser(user).then(res => {
      if (res.data.code === 0){
        context.commit(RECEIVE_USER, res.data.data)
        return res
      }else {
        context.commit(ERROR_MSG, res.data.msg)
        return res
      }
    })
  },

  //保存牛人经历异步action
  exp(context, exp){
    return reqExp(exp)
  },

  //更改牛人经历异步action
  updateExp(content, exp){
    return reqUpdateExp(exp)
  },

  //获取牛人经历异步action
  getExp(content, _id){
    return reqGetExp(_id)
  },

  //获取牛人经历异步action
  getExpList(){
    return reqExpList()
  },

  //boss实名认证异步action
  identity(context, data) {
    return reqIdentity(data).then(res => {
      if (res.data.code === 0){
        context.commit(RECEIVE_IDENTITY, res.data.data)
        return res
      }else {
        context.commit(IDENTITY_MSG, res.data.msg)
        return res
      }
    })
  },

  //异步更新boss实名认证信息
  updateIde(context, data) {
    return reqUpdateIde(data).then(res => {
      if (res.data.code === 0){
        context.commit(RECEIVE_IDENTITY, res.data.data)
        return res
      }else {
        context.commit(IDENTITY_MSG, res.data.msg)
        return res
      }
    })
  },

  // 职位发布异步action
  position(context, data){
    return reqPosition(data).then(res => {
      if (res.data.code === 0){
        getPostListMsg(context, 'Boss') // 刷新职位信息列表
        return res
      }
    })
  },

  // 获取职位信息异步action（单个职位信息）
  postMsg(context, _id){
    return reqPostMsg(_id)
  },

  // 更改职位信息异步action
  updatePost(context, data){
    return reqUpdatePost(data).then(res => {
      if (res.data.code === 0){
        getPostListMsg(context, 'Boss') // 刷新职位信息列表
        return res
      }
    })
  },

  // 获取boss职位相关信息的列表
  getBossPost(context, postName){
    return reqBossList(postName).then(res => {
      if (res.data.code === 0){
        context.commit(RECEIVE_USER_LIST, res.data.data)
        return res
      }
    })
  },

  // 获取用户异步action
  getUser(context){
   return reqUser().then(res => {
      if (res.data.code ===0 ){
        getMsgList(context, res.data.data._id)
        if (res.data.data.type === 'Boss') {
          getIdentity(context, res.data.data.type)
          getPostListMsg(context, res.data.data.type)
        }
        context.commit(RECEIVE_USER, res.data.data)
        return res
      }else {
        context.commit(RESET_USER, res.data.msg)
      }
    })
  },

  // 获取用户列表的异步action
  getUserList(context, type){
    return reqUserList(type).then(res => {
      context.commit(RECEIVE_USER_LIST, res.data.data)
      return '获取成功'
    })
  },

  // 发送消息的异步action
  sendMsg(context, {from, to, content}){
    console.log('客户端向服务器发送消息', {from, to, content})
    // 发消息
    io.socket.emit('sendMsg', {from, to, content})
  },

  // 读取消息的异步action
  readMsg(context, data) {
    return reqReadMsg(data.fromId).then(res => {
      if (res.data.code === 0){
        const count = res.data.data
        context.commit(MSG_READ, {count, from: data.fromId, to : data.toId})
      }
    })
  },

  /*
   公共接口
   */
  // 获取职位列表异步action
  getPostList(){
    return postList()
  },

  // 获取城市地理信息异步action
  getCityList(){
    return cityList()
  },

  // 获取百度地图接口地点输入提示信息
  getAddrTip(context, data) {
    return reqAddrTip(data).then(res => {
      if (res.data.code === 0){
        return res
      }
    })
  },

  // 获取百度地图接口逆地理编码
  getAddrCode(context, address) {
    return reqAddrCode(address).then(res => {
      if (res.data.code === 0){
        return res
      }
    })
  }
}
