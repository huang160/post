<template>
  <div style="text-align: left;padding-top: 60px;">
    <van-nav-bar
      title="完善资料"
      :fixed=true
      @click-left="onClickRight"
    />
    <van-cell title="填写基本信息" title-style="font-size: 20px;" :border="false"  label="向Boss介绍一下自已吧" />
    <van-cell title="头像" label="上传求职照片被Boss回复的几率翻倍">
      <template #default>
        <van-uploader :after-read="afterRead">
          <van-image width="65" height="65" round :src="headImage" />
        </van-uploader>
      </template>
    </van-cell>
    <van-cell center title="性别">
      <template #default>
        <van-tag type="success" style="padding: 5px 26px" color="#22c47c" :plain="boy" @click="changeBoy">男</van-tag>
        <van-tag type="success" style="margin-left: -2px;padding: 5px 26px" color="#22c47c" :plain="girl" @click="changeGirl">女</van-tag>
      </template>
    </van-cell>
    <van-cell center title="求职身份" :label="titleMessage">
      <template #default>
        <van-tag type="success" style="padding: 5px 14px" color="#22c47c" :plain="worker" @click="changeWorker">职场人</van-tag>
        <van-tag type="success" style="margin-left: -2px;padding: 5px 20px" color="#22c47c" :plain="student" @click="changeStudent">学生</van-tag>
      </template>
    </van-cell>
    <van-cell center title="姓名">
      <template #label>
        <van-field style="font-size: 16px;padding: 0;" v-model="name" placeholder="请填写姓名"/>
      </template>
    </van-cell>
    <van-cell center title="出生年月" :label="birthDate" is-link arrow-direction="down" @click="show = true"/>
    <van-popup position="bottom" v-model="show">
      <van-datetime-picker
        v-model="currentDate"
        type="year-month"
        title="选择年月"
        :min-date="minDate"
        :max-date="maxDate"
        :formatter="formatter"
        @confirm="changTime"
        @cancel="show=false"
      />
    </van-popup>
    <van-button
      :disabled="checked"
      @click="updateUser"
      type="primary"
      size="large"
      style="position:fixed; bottom:0;"
    >
      完成
    </van-button>
  </div>
</template>

<script>
import Vue from 'vue'
import {
  NavBar,
  Cell,
  Image,
  Uploader,
  Tag,
  Field,
  Popup,
  DatetimePicker,
  Button, Toast
} from 'vant'

Vue.use(NavBar)
Vue.use(Cell)
Vue.use(Image)
Vue.use(Uploader)
Vue.use(Tag)
Vue.use(Field)
Vue.use(Popup)
Vue.use(DatetimePicker)
Vue.use(Button)

export default {
  name: "ApplicantInfo",
  data(){
    return {
      headImage: require('@/assets/img/2.png'),
      boy: false,
      girl: true,
      sex: '男',
      titleMessage: '有正式工作经历',
      worker: false,
      student: true,
      person: '职场人',
      name: '',
      minDate: new Date(1951, 0, 1),
      maxDate: new Date(2005, 11, 1),
      currentDate: new Date(),
      show: false,
      birthDate: '请选择',
      checked: ''
    }
  },
  methods: {
    onClickRight() {

    },
    //动态获取上传图片地址
    afterRead(file){
      this.headImage = file.content
    },
    //动态改变性别按钮颜色
    changeBoy() {
      this.boy = !this.boy
      this.girl = !this.girl
      this.sex = '男'
    },
    changeGirl() {
      this.girl = !this.girl
      this.boy = !this.boy
      this.sex = '女'
    },
    //动态改变身份按钮颜色
    changeWorker() {
      this.worker = !this.worker
      this.student = !this.student
      this.titleMessage = '有正式工作经历'
      this.person = '职场人'
    },
    changeStudent() {
      this.student = !this.student
      this.worker = !this.worker
      this.titleMessage = '在校/应届/往届'
      this.person = '学生'
    },
    //获取年月列表
    formatter(type, val) {
      if (type === 'year') {
        return `${val}`;
      } else if (type === 'month') {
        return `${val}`;
      }
      return val;
    },
    //获取出生年月
    changTime(val) {
      let dateTime = new Date(val)
      let month = dateTime.getMonth()+1
      if (month < 10){
        month = '0' + month
      }
      this.birthDate  = dateTime.getFullYear()+'.'+ month
      this.show = false
    },

    // 更新牛人信息按钮事件
    updateUser(){
      let user = {
        header: this.headImage.replace(/^data:image\/\w+;base64,/, ''),
        sex: this.sex,
        person: this.person,
        name: this.name,
        birthDate: this.birthDate
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
    }
  },
  created() {
    const getRedirectTo = this.$store.state.user.redirectTo ? this.$store.state.user.redirectTo : ''
    const path = this.$route.path
    if (path !== getRedirectTo){
      this.$router.replace(getRedirectTo)
    }
  },
  updated() {
    this.checked = !(this.name && this.birthDate);
  }
}
</script>

<style scoped>
  span{
    font-weight: bold;
  }
</style>
