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
} from './mutations-types'

import {getRedirectTo} from "../utils";

export default {
  // user相关
  [AUTH_SUCCESS]:(state, data) => {
    let {type, header} = data
    data.redirectTo = getRedirectTo(type, header)
    return state.user = data
  },
  [ERROR_MSG]:(state, msg) => {
    return state.user = {...state.msg, msg}
  },
  [RECEIVE_USER]: (state, data) =>{
    let {type, header} = data
    data.redirectTo = getRedirectTo(type, header)
    return state.user = data
  },
  [RESET_USER]: (state, msg) => {
    return state.user = {...state.msg, msg}
  },
  // boss实名认证相关
  [RECEIVE_IDENTITY]: (state, data) => {
    const {pros, cons, status, remark} = data
    return state.identity = {pros, cons, status, remark}
  },
  [IDENTITY_MSG]: (state, msg) => {
    return state.identity = msg
  },
  // post相关
  [RECEIVE_POST_LIST]: (state, data) => {
    return state.postList = data
  },
  // userList相关
  [RECEIVE_USER_LIST]: (state, data) => {
    return state.userList = data
  },
  // chat相关
  [RECEIVE_MSG_LIST]: (state, data) => {
    const {users, chatMsgs, userid} = data
    return state.chat = {
      users,
      chatMsgs,
      unReadCount: chatMsgs.reduce((preToal, msg) => preToal +(!msg.read&&msg.to===userid?1:0),0)
    }
  },
  [RECEIVE_MSG]: (state, data) => {
    const {chatMsg} = data
    return state.chat = {
      users: state.chat.users,
      chatMsgs: [...state.chat.chatMsgs, chatMsg],  // 插入数据
      unReadCount: state.chat.unReadCount + (!chatMsg.read&&chatMsg.to===data.userid?1:0)
    }
  },
  [MSG_READ]: (state, data) => {
    const {from, to, count} = data
    return state.chat = {
      users: state.chat.users,
      chatMsgs: state.chat.chatMsgs ? state.chat.chatMsgs.map(msg => {
        if (msg.from===from && msg.to===to && !msg.read){ // 需要更新
          return {...msg, read: true}
        } else { //不需要
          return msg
        }
      }) : '',
      unReadCount: state.chat.unReadCount-count
    }
  }
}
