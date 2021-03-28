<template>
 <div id="chat" style="text-align: left;">
   <van-nav-bar left-arrow fixed @click-left="$router.back()">
     <template #title >
       <div style="display: flex;flex-direction: column;">
         <span style="font-weight: bold;padding-top: 5px;">{{$route.query.name}}</span>
         <span style="font-size: 12px;">{{$route.query.company ? $route.query.company + ' · ' + $route.query.job : $route.query.job }}</span>
       </div>
     </template>
     <template #right>
       <van-icon name="ellipsis" />
     </template>
   </van-nav-bar>
   <div style="clear: both;margin-top: 56px"></div>
   <div id="container"
        v-if="chat.users[chatMsg.meId] && chatMsg.msgs !== ''"
        v-for="(item, index) in chatMsg.msgs"
        :key="index"
   >
     <div style="text-align: center;font-size: 12px;clear: both;color: #969799;">{{date(item.create_time)}}</div>
     <!--对方发给我的消息-->
       <van-cell
         v-if="chatMsg.targetId === item.from"
         :border="false"
         style="width: 80%;"
       >
         <template #title>
           <div class="content_left" style="display: flex;flex-direction: row;">
             <img
               width="30"
               height="30"
               :src="chatMsg.targetIcon"
               style="border-radius: 50%; margin-right: 5px"
             />
             <van-tag
               size="large"
               color="#eee"
               text-color="#000"
               style="margin-top: 12px;padding: 10px;word-break:break-all;"
             >
               {{item.content}}
             </van-tag>
           </div>
         </template>
       </van-cell>
     <!--我发给对方的消息-->
     <van-cell v-else :border="false" style="width: 80%;float: right;">
       <template #title>
         <div class="content_right" style="display: flex;flex-direction: row;float: right">
           <van-tag
             size="large"
             color="#22c47c"
             text-color="#eee"
             style="margin-top: 12px;padding: 10px;word-break:break-all;"
           >
            {{item.content}}
           </van-tag>
           <img
             width="30"
             height="30"
             :src="'http://localhost:4000/images/' + user.header"
             style="border-radius: 50%; margin-left: 5px;"
           />
         </div>
       </template>
     </van-cell>
   </div>
   <!--占位行, 控制伸拉条大小-->
   <div class="bot" :style="isShow === false ? 'margin-bottom: 54px;' : 'margin-bottom: 318px;'"></div>
   <footer>
     <div id="input">
       <van-field
         v-model="content"
         center
         clearable
         placeholder="请输入"
         @focus="isShow = false"
       >
         <template #left-icon>
           <van-icon name="smile-o" @click="isShow = !isShow" style="cursor: pointer;margin-right: 5px"/>
         </template>
         <template #button>
           <van-button
             size="small"
             type="primary"
             :disabled="content === ''"
             @click="handleSend"
           >
             发送
           </van-button>
         </template>
       </van-field>
     </div>
     <div v-if="isShow === true" id="emojis">
       <van-grid :border="false" :column-num="8">
         <van-grid-item
           v-for="val in emojis"
           :key="val"
           @click="emojisShow(val)"
         >
           {{val}}
         </van-grid-item>
       </van-grid>
     </div>
   </footer>
 </div>
</template>

<script>
import Vue from 'vue'
import {mapState} from 'vuex'
import {NavBar, Icon, Cell, Tag, Field, Button, Grid, GridItem} from 'vant'
import {dateFormat} from "../../utils";

Vue.use(NavBar)
Vue.use(Icon)
Vue.use(Cell)
Vue.use(Tag)
Vue.use(Field)
Vue.use(Button)
Vue.use(Grid);
Vue.use(GridItem)

export default {
  name: "Chat",
  data(){
    return {
      content: '',
      isShow: false, // 表情包默认不显示
      emojis: ['😀', '😃' , '😄' , '😁' , '😆' , '😅' , '🤣' , '😂' , '🙂' , '🙃' , '😉' , '😊' , '😇' ,
        '🥰' , '😍' , '🤩' , '😘' , '😗' , '😎' , '😚' , '😙' , '😋' , '😛' , '😜' , '🤪' , '😝' , '🤑',
        '🤗' , '🤭' , '🤫' , '🤔' , '🤐' , '🤨' , '😐' , '😑' , '😶' , '😏' , '😒' , '🙄' , '😬'],
      from: 'ssss'
    }
  },
  computed: {
    ...mapState(['user', 'chat']),

    // 计算属性页面渲染时就读值, 先判断有无值, 在进行下一步操作
    chatMsg(){
      // 计算当前聊天的chatId
      const meId = this.user._id ? this.user._id : ''
      const targetId = this.$route.params.userid
      const chatId = [meId, targetId].sort().join('_')

      // 对chatMsgs进行过滤
      const msgs = this.chat.chatMsgs ? this.chat.chatMsgs.filter(msg => msg.chat_id===chatId) : ''

      // 得到目标用户的header图片对象
      const targetHeader = this.chat.users ? this.chat.users[targetId].header : '暂无头像'
      const targetIcon = 'http://localhost:4000/images/' + targetHeader

      return {meId, targetId, msgs, targetIcon}
    },

  },
  methods: {
    handleSend(){
      // 收集数据
      const from = this.user._id
      const to = this.$route.params.userid
      const content = this.content.trim() // trim()去掉两端的空格,注：中间的空格不影响
      // 发送请求(发消息)
      if(content){ // 输入框有值才能发送异步请求
        this.$store.dispatch('sendMsg', {from, to, content})
      }
      // 点击即清除输入数据(数据已发送,无论发送成不成功)
      this.content = ''
    },
    emojisShow(value){
      this.content = this.content + value
    },
    date(val){
      return dateFormat(val)
    }
  },
  mounted() {
    // 初始显示列表（滑动到底部聊天消息）
    window.scrollTo(0, document.body.scrollHeight)
  },
  updated() {
    // 更新显示列表（滑动到底部最新聊天消息）
    window.scrollTo(0, document.body.scrollHeight)
  },
  // 组件内守卫（离开时做未读消息清零操作）
  beforeRouteLeave(to,from, next) {
    // 发请求更新消息的未读状态
    const fromId = from.params.userid
    const toId = this.user._id
    if (this.chat.users[toId] && this.chatMsg.msgs !== ''){
      this.chatMsg.msgs.forEach(item => {
        if (fromId === item.from && !item.read){
          this.$store.dispatch('readMsg', {fromId, toId})
        }
      })
    }
    next()
  }
}
</script>

<style scoped>
footer{
  position: fixed;
  bottom: 0;
  width: 100%;
  height: inherit;
  border-top: 1px solid #e2e0e0;
}
.bot{
  clear: both;
}

</style>
