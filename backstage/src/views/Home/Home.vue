<template>
  <el-row class="home" :gutter="20">
    <el-col :span="8">
      <el-card shadow="hover">
        <div class="user">
          <img :src="userImg" alt="" />
          <div class="userinfo">
            <p class="name">{{ msg.username }}</p>
            <p class="access">
              {{ msg.username === 'admin' ? '超级管理员' : '管理员' }}
            </p>
          </div>
        </div>
        <div class="login-info">
          <p>
            登录时间：<span>{{ msg.time }}</span>
          </p>
          <p>
            登录地点：<span>{{ address }}</span>
          </p>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import Vue from 'vue'
import { VueJsonp } from 'vue-jsonp'
import { adminMsg } from '../../network/admin'
import { dateFormat } from '../../utils'

Vue.use(VueJsonp)

export default {
  data() {
    return {
      userImg: require('../../assets/image/user.jpg'),
      countData: [
        {
          name: '今日支付订单',
          value: '1234',
          icon: 'success',
          color: '#2ec7c9'
        }
      ],
      msg: {},
      address: ''
    }
  },
  methods: {
    BMap() {
      const ak = 'MBZMd8x62ipirNXCtvGrm0PDr3j4WXH2'
      this.$jsonp(
        `http://api.map.baidu.com/location/ip?ak=${ak}&coor=bd09ll`
      ).then(res => {
        this.address = res.content.address
      })
    }
  },
  created() {
    this.BMap()
    adminMsg().then(res => {
      const result = res.data
      if (result.code === 0) {
        this.msg = result.data
        this.$set(this.msg, 'time', dateFormat(Date.now()))
      }
    })
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/home';
</style>
