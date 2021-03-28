<template>
  <div id="login">
    <van-nav-bar
      right-text="注册新账号"
      :fixed=true
      @click-right="onClickRight"
    />
    <van-form>
      <img src="~/assets/img/1.jpg" width="216px" height="180px" alt=""/>
      <van-field
        v-model="username"
        clearable
        name="用户名"
        left-icon="user-o"
        placeholder="请填写用户名"
        style="font-size: 16px"
        :rules="[{ required: true }]"
      />
      <van-field
        v-model="password"
        clearable
        type="password"
        name="密码"
        placeholder="请填写密码"
        style="font-size: 16px"
        :left-icon="passwordIcon"
        :rules="[{ required: true }]"
      />
      <div style="margin: 16px;">
        <van-button block :disabled="checked" type="primary" native-type="button" @click="onSubmit">
          登录
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import Vue from 'vue';
import {NavBar, Form, Field, Button, Toast} from 'vant';

Vue.use(NavBar)
Vue.use(Form)
Vue.use(Field)
Vue.use(Button)
Vue.use(Toast)

const passwordIcon = require('@/assets/img/password.png')

export default {
  name: "Login",
  data() {
    return {
      username: '',
      password: '',
      passwordIcon,
      checked: true
    };
  },
  computed: {
    redirect(){ // 监听异步state里路由路径值的变化
      let {redirectTo} = this.$store.state.user
      return redirectTo
    }
  },
  watch: {
    redirect(path){ // 监听到computed里redirect函数返回值变化后做出路由跳转
      this.$router.replace(path)
    }
  },
  methods: {
    onSubmit() {
      let user = {
        username: this.username,
        password: this.password
      }
      this.$store.dispatch('login', user).then(res => {
       if(res.data.code === 0){
         Toast.success('登录成功')
       }else {
         Toast.fail(res.data.msg)
       }
      }).catch(() => {
        Toast.fail('网络出错')
      })
    },
    onClickRight() {
      this.$router.push('/register')
    }
  },
  updated() {
    this.checked = !(this.password && this.username);
  },

}
</script>

<style scoped>
  #login{
    padding: 60px 20px 0;
  }
</style>
