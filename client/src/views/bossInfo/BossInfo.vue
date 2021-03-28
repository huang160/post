<template>
 <div style="text-align: left;padding-top: 60px;">
   <van-nav-bar
     title="完善资料"
     :fixed=true
   />
   <van-cell title="创建Boss名片" title-style="font-size: 20px;" :border="false"  label="向牛人介绍一下自已吧" />
   <van-cell center title="头像">
     <template #default>
       <van-uploader :after-read="afterRead">
         <van-image width="60" height="60" round :src="headImage" />
       </van-uploader>
     </template>
   </van-cell>
   <van-cell center title="姓名">
     <template #label>
       <van-field style="font-size: 16px;padding: 0;" v-model="name" placeholder="请填写姓名"/>
     </template>
   </van-cell>
   <van-cell title="我的公司">
     <template #label>
       <van-field style="padding: 0;" v-model="company" class="van-multi-ellipsis--l2" placeholder="注意区分总公司和分公司"/>
     </template>
   </van-cell>
   <van-cell center title="我的职务">
     <template #label>
       <van-field style="padding: 0;" v-model="job" placeholder="真实的职务,更能赢得牛人的信任"/>
     </template>
   </van-cell>
   <van-cell>
     <template #default>
       <van-button
         :disabled="checked"
         @click="updateUser"
         type="primary"
         size="large"
         style="margin-top: 10px"
       >
         完成
       </van-button>
     </template>
   </van-cell>
 </div>
</template>

<script>
import Vue from 'vue'
import {
  NavBar,
  Cell,
  Uploader,
  Image,
  Field,
  Button,
  Toast
} from 'vant'

Vue.use(NavBar)
Vue.use(Cell)
Vue.use(Uploader)
Vue.use(Image)
Vue.use(Field)
Vue.use(Button)
Vue.use(Toast)

export default {
  name: "BossInfo",
  data(){
    return {
      headImage: require('@/assets/img/2.png'),
      name: '',
      job: '',
      company: '',
      checked: ''
    }
  },
  methods: {
    //动态获取上传图片地址
    afterRead(file){
      this.headImage = file.content
    },

    //更新老板信息按钮
    updateUser(){
      let user ={
        header: this.headImage.replace(/^data:image\/\w+;base64,/, ''),
        name: this.name,
        company: this.company,
        job: this.job
      }
      this.$store.dispatch('updateUser', user).then(res => {
        if (res.data.code === 0){
          Toast.success('信息已完善,欢迎登录')
          this.$router.replace('/index')
        }else {
          Toast.fail(res.data.msg)
        }
      }).catch(() => {
        Toast.fail('网络出错')
      })
    },
  },
  created() {
    const getRedirectTo = this.$store.state.user.redirectTo
    const path = this.$route.path
    if (path !== getRedirectTo){
      this.$router.replace(getRedirectTo)
    }
  },
  updated() {
    this.checked = !(this.name && this.company && this.job);
  }
}
</script>

<style scoped>
  span{
    font-weight: bold;
  }
</style>
