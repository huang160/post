<template>
  <div>
    <van-nav-bar
      :title="fullName"
      :border=false
      fixed
    >
    </van-nav-bar>
    <header style="padding: 60px 0 35px 0;background-color: #22c47c">
      <van-image
        round
        width="4rem"
        height="4rem"
        fit="scale-down"
        :src=this.header
        style="border: 1px solid #eee;cursor: pointer"
        @click="$router.push('/information')"
      />
    </header>
    <div class="container" style="text-align: left">
      <van-cell
        title="Boss认证"
        :icon="identityImg"
        :value="identity === '未认证' ? identity : identity.remark"
        is-link
        to="/identity"
      />
      <van-cell
        title="职位管理"
        icon="bars"
        is-link
        @click="bars"
      />
      <van-cell
        title="我的客服"
        icon="service"
        is-link
        to="/service"
      />
      <van-cell
        title="关于"
        icon="info-o"
        is-link
        @click="about"
      />
      <van-cell
        title="退出"
        :icon="signOut"
        is-link
        @click="out"
      />
    </div>
    <footer>
      <span>客服电话 400-065-5799</span>
      <span style="margin-left: 15px">工作时间 9:30-18:30</span>
    </footer>
  </div>
</template>

<script>
import Vue from 'vue'
import {mapState} from "vuex"
import {NavBar, Icon, Col, Row, Image, Cell, Toast, Dialog} from 'vant'
import Cookies from "js-cookie";
import {RESET_USER} from "../../store/mutations-types";

const identityImg = require('@/assets/img/identity.png')
const signOut = require('@/assets/img/sign_out.png')

Vue.use(Col)
Vue.use(Row)
Vue.use(NavBar)
Vue.use(Icon)
Vue.use(Image)
Vue.use(Cell)
Vue.use(Toast)

export default {
  name: "BossProfile",
  data() {
    return {
      fullName: this.$store.state.user.name,
      header: `http://localhost:4000/images/${this.$store.state.user.header}`,
      identityImg,
      signOut
    }
  },
  computed: {
    ...mapState(['identity'])
  },
  methods:{
    bars(){
      if (this.identity.remark === '认证成功') {
        this.$router.push('/management')
      }else {
        Toast('账号未实名，请先完成认证！')
      }
    },
    about(){
      Dialog.alert({
        title: '用户使用须知',
        message: '平台解释权归本平台所有\n主体人：hzq',
        confirmButtonColor: '#22c47c'
      }).then(() => {
        // on close
      });
    },
    out(){
      Dialog.confirm({
        title: '温馨提示',
        message: '确定要退出登录吗？',
        confirmButtonColor: '#22c47c'
      })
        .then(() => {
          Cookies.remove('userid')
          this.$store.commit(RESET_USER,  '请登录')
          this.$router.replace('/login')
        })
        .catch(() => {
          // on cancel
        });
    }
  },
  mounted() {
    if (!this.$store.state.user.header){
      this.$router.replace('/info')
    }
  }
}
</script>

<style scoped>
footer{
  text-align: center;
  font-size: 12px;
  color: #969799;
  padding-top: 20px;
  margin-bottom: 50px;
}
</style>
