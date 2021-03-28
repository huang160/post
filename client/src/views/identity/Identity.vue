<template>
  <div id="identity" style="text-align: left;">
    <van-nav-bar
      title="身份认证"
      fixed
      left-arrow
      @click-left="$router.back()"
    />
    <div id="container" style="margin: 46px 0 48px 0">
      <van-notice-bar
        left-icon="volume-o"
        text="温馨提示：您应确保此账号为本人注册并使用。如您代他人进行认证并通过，后续产生的法律责任将由您和账号实际使用者承担。"
      />
      <van-cell
        title="请进行身份资料认证操作"
        :border="false"
        title-style="font-size: 16px;font-weight: bold"
      />
      <div style="padding: 0 16px;font-size: 13px">
        需要身份证件照片采集来验证你的本人身份, 你的个人信息将得到绝对保护, 仅限用于招聘使用
      </div>
      <div class="shenFen">
        <div class="box">
          <van-uploader :disabled="identity.remark && identity.remark !== '认证失败'" :after-read="pros">
            <img
              :src="identity.pros ? 'http://localhost:4000/identityImgs/' + identity.pros : shenFen_01"
              width="250"
              height="90"
              alt="300*300"
            >
          </van-uploader>
        </div>
        <div class="text">
          BOSS须知：此张为身份证
          <span style="color: #ff0000">正面照（头像在上）示例，点击图片即可上传</span>，
          <u style="color: #22c47c">遮挡、反光、不清晰、照片太小、倾斜等</u>
          将导致无法辨认，
          <span style="color: #ff0000;">正反面上传错误将导致认证失败！</span>
        </div>
      </div>
      <div class="shenFen">
        <div class="box">
          <van-uploader :disabled="identity.remark && identity.remark !== '认证失败'" :after-read="cons">
            <img
              :src="identity.pros ? 'http://localhost:4000/identityImgs/' + identity.cons : shenFen_02 "
              width="250"
              height="90"
              alt="300*300"
            >
          </van-uploader>
        </div>
        <div class="text">
          BOSS须知：此张为身份证
          <span style="color: #ff0000">反面照（国徽在上）示例，点击图片即可上传</span>，
          <u style="color: #22c47c">遮挡、反光、不清晰、照片太小、倾斜等</u>
          将导致无法辨认，
          <span style="color: #ff0000;">正反面上传错误将导致认证失败！</span>
        </div>
      </div>
    </div>
    <footer>
      <van-button
        v-if="!identity.remark"
        :disabled="verification"
        type="primary"
        size="large"
        @click="onSubmit"
      >
        确认上传
      </van-button>
      <van-button
        v-else
        type="primary"
        size="large"
        :disabled = "identity.remark !== '认证失败'"
        @click="onSubmit"
      >
        {{identity.remark === '认证失败' ? identity.remark + '，请重新上传' : identity.remark + '....'}}
      </van-button>
    </footer>
  </div>
</template>

<script>
import Vue from 'vue'
import {mapState} from "vuex";
import {NavBar, Cell, Uploader, Button, NoticeBar, Toast, Dialog} from 'vant'

const shenFen_01 = require('@/assets/img/shenfen0813_01.jpg')
const shenFen_02 = require('@/assets/img/shenfen0813_02.jpg')

Vue.use(NavBar)
Vue.use(Cell)
Vue.use(Uploader)
Vue.use(Button)
Vue.use(NoticeBar)
Vue.use(Toast)
Vue.use(Dialog)

export default {
  name: "Identity",
  data() {
    return {
      shenFen_01,
      shenFen_02,
      verification: true,
      onDisabled: false
    };
  },
  computed: {
    ...mapState(['identity', 'user']),
  },
  methods: {
    pros(file) {
      // 此时可以自行将文件上传至服务器
      this.shenFen_01 = file.content
    },
    cons(file){
      this.shenFen_02 = file.content
    },
    onSubmit(){
      Dialog.confirm({
        title: '温馨提示',
        message: '确定上传吗？',
        beforeClose: (action, done) =>{
          if (action === 'confirm') {
            const data = {
              name: this.user.name,
              pros: this.shenFen_01.replace(/^data:image\/\w+;base64,/, ''),
              cons: this.shenFen_02.replace(/^data:image\/\w+;base64,/, '')
            }
            this.$store.dispatch('identity', data).then(res => {
              if (res.data.code === 0){
                done()
                const result = res.data.data  // 界面上图片保持着上传时的状态，不需要从服务端获取去更新
                if (result.remark && result.remark !== '认证失败'){
                  this.onDisabled = true
                }
                Toast.success('上传成功！')
              }else {
                done()
                Toast.fail(res.data.msg)
              }
            }).catch(() => {
              Toast.fail('网络错误!')
            })
          }else {
            done()
          }
        }
      })
    }
  },
  updated() {
    if (this.shenFen_01 !== '/img/shenfen0813_01.05a781c1.jpg' &&
      this.shenFen_02 !== '/img/shenfen0813_02.b46a8d87.jpg')
    {
     this.verification = false
    }
  }
}
</script>

<style scoped>
.shenFen{
  text-align: center;
  padding: 10px 16px;
}
.box{
  border: 1px solid #a8a6a6;
}
.text{
  font-size: 12px;
  text-align: left;
  font-weight: bold;
}
footer{
  position: fixed;
  bottom: 0;
  width: 100%;
}
</style>
