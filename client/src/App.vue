<template>
  <div id="app">
    <router-view />   <!-- 默认路由（登录/注册）-->
    <router-view :name="linkToInfo"/>   <!-- 信息完善页-->
    <router-view :name="linkTo" />   <!-- 首页 -->
    <router-view :name="linkToInformation" /> <!-- 个人信息 -->
    <router-view :name="linkToService" /> <!-- 客服 -->
    <router-view :name="linkToPurpose" /> <!-- 求职意向（牛人） -->
    <router-view :name="linkToResume" /> <!-- 在线简历（牛人） -->
    <router-view :name="linkToExperience" /> <!-- 工作/项目经历（牛人） -->
    <router-view :name="linkToIdentity" /> <!--身份认证（boss） -->
    <router-view :name="linkToRelease" /> <!--职位发布(boss) -->
    <router-view :name="linkToManagement" /> <!--职位管理(boss)-->
  </div>
</template>

<script>
import Vue from 'vue';
import {mapState} from 'vuex'
import { Tabbar, TabbarItem, Toast } from 'vant';
import Cookies from 'js-cookie';
import {getRedirectTo} from './utils'

Vue.use(Tabbar);
Vue.use(TabbarItem);
Vue.use(Toast)

export default {
  name: 'app',
  data(){
    return {
      linkTo: '',
      linkToInfo: '',
      linkToPurpose: '',
      linkToService: '',
      linkToInformation: '',
      linkToResume: '',
      linkToExperience: '',
      linkToIdentity: '',
      linkToRelease: '',
      linkToManagement: ''
    }
  },
  computed: {
    ...mapState(['user']),
    redirect() {
      return this.user
    }
  },
  watch:{
    redirect(user) {
      if (user._id){
        let {type} = user
        if(type === '牛人'){
          type = 'applicant'
        }else {
          type = 'boss'
        }
        this.linkToInfo = type + 'Info'
        this.linkTo = type
        this.linkToPurpose = type + 'Purpose'
        this.linkToService = type + 'Service'
        this.linkToInformation = type + 'Information'
        this.linkToResume = type + 'Resume'
        this.linkToExperience = type + 'Experience'
        this.linkToIdentity = type + 'Identity'
        this.linkToRelease = type + 'Release'
        this.linkToManagement = type + 'Management'
      }
    }
  },
  created() {
    //判断浏览器缓存Cookies中是否有userid，没有就跳到登录页
    let userid = Cookies.get('userid')
    if (!userid && !this.user._id){  //没有uid
      this.$router.replace('/login')
    }
  },
  updated() {
     let userid = Cookies.get('userid')
     if (userid && !this.user._id) {  //有uid
      //发送异步请求, 获取user
     this.$store.dispatch('getUser').then(res => {
       if(res.data.code === 0){
         let {type, header} = res.data.data
         const path = getRedirectTo(type, header)
         if (path !== '/'){
           this.$router.replace(path)
         }
       }else {
         Toast.fail(res.data.msg)
       }
     }).catch(() => {
       Toast.fail('网络出错')
     })
    }
  }
}
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
