<template>
  <div id="register">
    <van-nav-bar
      left-arrow
      left-text="登录"
      :fixed=true
      @click-left="onClickLeft"
    />
    <van-form>
      <img src="~/assets/img/1.jpg" height="180px" alt=""/>
      <van-field
        v-model="username"
        clearable
        name="username"
        left-icon="user-o"
        placeholder="请填写用户名"
        style="font-size: 16px"
        :rules="[{ required: true }]"
      />
      <van-field
        v-model="password"
        clearable
        type="password"
        name="password"
        placeholder="请填写密码"
        style="font-size: 16px"
        :left-icon="passwordIcon"
        :rules="[{ required: true }]"
      />
      <van-field name="radio" label="身份">
        <template #input>
          <van-radio-group v-model="type" direction="horizontal">
            <van-radio name="牛人">牛人</van-radio>
            <van-radio name="Boss">Boss</van-radio>
          </van-radio-group>
        </template>
      </van-field>
      <div style="margin: 16px;">
        <van-button block :disabled="checked" type="primary" native-type="button" @click="onSubmit">
          注册
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import Vue from 'vue';
import {NavBar, Form, Field, RadioGroup, Radio, Button, Toast} from 'vant';

Vue.use(NavBar)
Vue.use(Form)
Vue.use(Field)
Vue.use(RadioGroup)
Vue.use(Radio)
Vue.use(Button)
Vue.use(Toast)

const passwordIcon = require('@/assets/img/password.png')

export default {
  name: "Register",
  data() {
    return {
      username: '',
      password: '',
      passwordIcon,
      type: '牛人',
      checked: ''
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
        password: this.password,
        type: this.type,
      }
      this.$store.dispatch('register', user).then(res => {
        if(res.data.code === 0){
          Toast.success('注册成功')
        }else {
          Toast.fail(res.data.msg)
        }
      }).catch(() => {
        Toast.fail('网络出错')
      })
    },
    onClickLeft() {
      this.$router.push('/login')
    }
  },
  updated() {
    this.checked = !(this.password && this.username);
  }
}
</script>

<style scoped>
#register{
  padding: 60px 20px 0;
}
</style>
