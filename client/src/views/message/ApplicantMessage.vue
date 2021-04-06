<template>
  <div style="text-align: left;">
    <footer style="position: fixed;top: 0;width: 100%;z-index: 10;">
      <van-nav-bar title="聊天互动"/>
      <div style="display: flex;flex-direction: row;padding: 8px 15px;border-bottom: 1px solid #eee;">
        <div style="width: 15%;font-size: 14px;" @click="allRead">
          <span :style="all ? `cursor: pointer;${active}` : 'cursor: pointer;'">全部</span>
        </div>
        <div style="width: 15%;font-size: 14px;" @click="Read">
          <span :style="readMsg ? `cursor: pointer;${active}` : 'cursor: pointer;'">已读</span>
        </div>
        <div style="width: 70%;text-align: right;" @click="unRead">
          <van-tag
            :color="unReadMsg ? '#22c47c' : '#888'"
            plain
            size="medium"
            style="cursor: pointer;"
          >
            极速处理
          </van-tag>
        </div>
      </div>
    </footer>
    <div class="container" style="margin-top: 83px;padding: 1px 15px;">
      <van-empty v-if="JSON.stringify(chat.chatMsgs) === '[]'" image="search" description="无消息,快去找boss聊聊吧~" />
      <div
        class="chatMsg"
        v-else
        v-for="(msg, index) in msgList === 1 ? chatMsg.lastMsgs : msgList === 2 ? chatMsg.readMsg : chatMsg.unReadMsg"
        :key="index"
        @click="() => {
          $router.push({
            path: `/chat/${msg.to === user._id ? msg.from : msg.to}`,
            query: {
              company: chat.users[msg.to === user._id ? msg.from : msg.to].company,
              name: chat.users[msg.to === user._id ? msg.from : msg.to].name,
              job: chat.users[msg.to === user._id ? msg.from : msg.to].job,
            }
          })
        }"
      >
        <div style="width: 45px;text-align: center;margin-right: 3px;">
          <van-badge :content="msg.unReadCount > 0 ? msg.unReadCount : ''" max="99">
            <van-image
              width="45"
              height="45"
              round
              :src="'http://localhost:4000/images/' + chat.users[msg.to === user._id ? msg.from : msg.to].header"
              alt="300*300"
            />
          </van-badge>
        </div>
        <div style="width: 60%;height: 45px;margin-top: 3px;">
          <div style="display: flex;flex-direction: row;">
            <div class="van-ellipsis" style="color: #000;display: flex;flex-direction: row;">
              <div style="font-size: 15px;">{{chat.users[msg.to === user._id ? msg.from : msg.to].name}}</div>
              <div class="van-ellipsis" style="width: 80%;font-size: 12px;color: #969799;margin: 3px 0 0 2px;">
                {{ chat.users[msg.to === user._id ? msg.from : msg.to].company + '·' + chat.users[msg.to === user._id ? msg.from : msg.to].job}}
              </div>
            </div>
          </div>
          <div style="width: 80%;color: #969799;margin-top: 2px;">
            <div class="van-ellipsis"  style="display: flex;flex-direction: row;font-size: 14px;">
              <div v-if="msg.to === user._id" >{{!msg.read ? '[新招呼]' : '[已读]'}}</div>
              <div v-else>{{!msg.read ? '[送达]' : '[已读]'}}</div>
              <div class="van-ellipsis" style="margin: 3px 0 0 2px;">{{ msg.content }}</div>
            </div>
          </div>
        </div>
        <div style="width: 39%;text-align: right;font-size: 12px;color: #969799;margin-top: 7px;">
          {{dateFormat(msg.create_time)}}
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import Vue from 'vue'
import {mapState} from "vuex";
import {NavBar, Tag, Image, Empty, Badge, Toast} from 'vant'
import {getNewName} from '../../utils'

Vue.use(NavBar)
Vue.use(Tag)
Vue.use(Image)
Vue.use(Empty)
Vue.use(Badge)
Vue.use(Toast)
/*
对chatMsgs按chat_id进行分组, 并得到每个组的lastMsg组成的数组
1. 找出每个聊天的lastMsg, 并用一个对象容器来保存 {chat_id, lastMsg}
2. 得到所有lastMsg的数组
3. 对数组进行排序(按create_time降序)
 */
function getLastMsgs(chatMsgs, userid){
  // 1. 找出每个聊天的lastMsg, 并用一个对象容器来保存 {chat_id, lastMsg}
  const lastMsgObjs = {}
  chatMsgs.forEach(msg => {

    // 对msg进行个体的统计
    if (msg.to === userid && !msg.read){
      msg.unReadCount = 1
    }else {
      msg.unReadCount = 0
    }

    // 得到msg的聊天标识id
    const chatId = msg.chat_id
    // 获取已保存的当前组件的lastMsg
    const lastMsg = lastMsgObjs[chatId]
    // 没有
    if (!lastMsg){ // 当前msg就是所在组的lastMsg
      lastMsgObjs[chatId] = msg
    }else { // 有
      // 累加unReadCount = 已经统计 + 当前msg的
      const unReadCount = lastMsg.unReadCount
      // 如果msg比lastMsg晚, 就将msg保存为lastMsg
      if (msg.create_time > lastMsg.create_time){
        lastMsgObjs[chatId] = msg
      }
      // 将unReadCount并保存在最新的lastMsg上
      lastMsgObjs[chatId].unReadCount = unReadCount + msg.unReadCount
    }
  })
  // 2. 得到所有lastMsg的数组
  const lastMsgs = Object.values(lastMsgObjs)
  // 3. 对数组进行排序(按create_time降序)
  lastMsgs.sort(function (m1, m2) { // 如果结果<0， 将m1放在前面，结果为0，不变，如果结果>0,m2在前
    return m2.create_time - m1.create_time
  })
  return lastMsgs
}

export default {
  name: "ApplicantMessage",
  data(){
    return {
      all: true,
      readMsg: false,
      unReadMsg : false,
      active: 'font-size: 15px;font-weight: 600;',
      msgList: 1
    }
  },
  computed: {
    ...mapState(['user', 'chat']),
    chatMsg(){
      const {chatMsgs} = this.chat
      // 对chatMsgs按chat_id进行分组
      let lastMsgs = []
      let readMsg = []
      let unReadMsg = []
      if (chatMsgs){
        lastMsgs = getLastMsgs(chatMsgs, this.user._id)
        lastMsgs.forEach(val => {
          if (val.from === this.user._id && val.read){
            readMsg.push(val) // 已读（对方已读消息, 不包含对方发过来已查看的消息）
          }
          if (val.to === this.user._id && !val.read){
            unReadMsg.push(val) // 未读(对方未读消息, 不包含已方发过去的未读消息)
          }
        })
      }
      return {lastMsgs, readMsg, unReadMsg}
    }
  },
  methods: {
    // 时间转换
    dateFormat(val) {
      let d = new Date(),time;
      const year = new Date(val).getFullYear(); //获取当前年份
      const month = new Date(val).getMonth() + 1; //获取当前月份（0——11）
      const date = new Date(val).getDate();
      let hours = new Date(val).getHours();
      let minutes = new Date(val).getMinutes();
      if (hours < 10){
        hours = '0' + hours;
      }
      if (minutes < 10){
        minutes = '0' + minutes
      }

      // 非同年显示年月日，同年且同天则显示时、秒，否则显示月日
      if (d.getFullYear() !== year){
        time = year + '年' + (month < 10 ? '0' + month : month) + '月' + (date < 10 ? '0' + date : date) + '日'
      }else if (d.getFullYear() + (d.getMonth() + 1) + d.getDate() === year + month + date){
        time = hours + ':' + minutes
      }else {
        time = month + '月' + date + '日'
      }
      return time
    },
    allRead(){
      this.msgList = 1
      this.all = true
      this.readMsg = false
      this.unReadMsg = false
    },
    Read(){
      if (this.chatMsg.readMsg.length > 0){
        this.msgList = 2
        this.readMsg = true
        this.all = false
        this.unReadMsg = false
      }else {
        Toast({
          message: '当前没有已读消息，快去找boss聊聊吧~',
          position: 'bottom'
        })
      }
    },
    unRead(){
      if (this.chatMsg.unReadMsg.length > 0){
        this.msgList = 3
        this.readMsg = false
        this.unReadMsg = true
        this.all = false
      }else {
        Toast({
          message: '当前没有需要处理的未读消息哦~',
          position: 'bottom'
        })
      }
    },
    contentNum(name, num){
      return getNewName(name, num)
    }
  },
  created() {
    if (!this.$store.state.user.header){
      this.$router.replace('/info')
    }
  },
}
</script>

<style scoped>
.dot{
  position: relative;
  left: 35px;
  top: -50px;
  width: 13px;
  height: 13px;
  font-size: 12px;
  text-align: center;
  color: #fff;
  background-color: red;
  border-radius: 50%;
}
.chatMsg {
  width: 100%;
  height: 45px;
  display: flex;
  flex-direction: row;
  margin: 10px 0;
  cursor: pointer;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}
</style>
