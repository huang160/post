<template>
  <div id="identity" style="text-align: left;">
    <van-nav-bar
      title="身份认证"
      fixed
      left-arrow
      @click-left="$router.back()"
    />
    <div id="container" style="margin: 46px 0 48px 0" v-if="identity.status !== 1">
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
        需要身份资料采集来验证你的本人身份, 你的个人信息将得到绝对保护, 仅限用于招聘使用
      </div>
      <div v-if="identity === '未认证' || identity.status === 0">
        <van-field
          v-model="fullName"
          label="真实姓名"
          label-width="70px"
          placeholder="请输入姓名"
          @blur="changeName"
        />
        <span v-if="rName" id="fullname">真实姓名有误，请重新输入~</span>
        <van-field
          v-model="number"
          label="身份证号码"
          label-width="70px"
          placeholder="请输入身份证号码"
          @blur="changeId"
        />
        <span v-if="rId" id="number">身份证号码有误，请重新输入~</span>
      </div>
      <div v-if="identity.status === 2">
        <van-cell>
          <template #title>
            <div class="cell_context">
              <div style="width: 80px">真实姓名</div>
              <div style="color: #969799">{{identity.name}}</div>
            </div>
          </template>
        </van-cell>
        <van-cell>
          <template #title>
            <div class="cell_context">
              <div style="width: 80px">身份证号码</div>
              <div style="color: #969799">{{identity.idNo}}</div>
            </div>
          </template>
        </van-cell>
      </div>
      <div class="shenFen">
        <div class="box">
          <van-uploader :disabled="identity.remark && identity.remark !== '认证失败'" :after-read="pros">
            <img
              :src="shenFen_01"
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
              :src="shenFen_02 "
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
    <div v-else>
      <div style="margin-top: 56px;padding: 18px 30px">
        <div class="box_container">
          <div class="su_title">
            <img src="../../assets/img/1.jpg" width="80" height="80" />
            <div style="font-weight: 700;color: #222">您已通过了实名认证</div>
          </div>
          <div class="info">
            <p>{{'姓名： ' + identity.name}}</p>
            <p>{{'身份证号码： ' + identity.idNo}}</p>
          </div>
        </div>
      </div>
      <div class="tip">
        <div>
          <van-icon name="warning-o" class="icon" color="#fb7299" size="18"/>
          <span>实名认证审核通过后，将不能修改认证信息。</span>
        </div>
        <p>如有特殊情况（如：改名、移民等导致原证件无效），请联系客服人员进行处理。</p>
      </div>
    </div>
    <footer v-if="identity.status !== 1">
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
        :disabled = "verification"
        @click="onAgain"
      >
        {{identity.remark === '认证失败' ? identity.remark + '，请重新上传' : identity.remark + '....'}}
      </van-button>
    </footer>
  </div>
</template>

<script>
import Vue from 'vue'
import {mapState} from "vuex";
import {NavBar, Cell, Icon, Uploader, Button, NoticeBar, Field, Toast, Dialog} from 'vant'

const shenFen_01 = require('@/assets/img/shenfen0813_01.jpg')
const shenFen_02 = require('@/assets/img/shenfen0813_02.jpg')

Vue.use(NavBar)
Vue.use(Cell)
Vue.use(Icon)
Vue.use(Uploader)
Vue.use(Button)
Vue.use(NoticeBar)
Vue.use(Field)
Vue.use(Toast)
Vue.use(Dialog)

export default {
  name: "Identity",
  data() {
    return {
      shenFen_01,
      shenFen_02,
      verification: true,
      fullName: '',
      number: '',
      rName: false,
      rId: false,
    };
  },
  computed: {
    ...mapState(['identity', 'user']),
  },
  methods: {
    changeName(){
      const regName =/^[\u4e00-\u9fa5]{2,4}$/;
      if(!regName.test(this.fullName)){
        this.rName = true
      } else {
        this.rName = false
      }
    },
    changeId(){
      const regIdNo = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
      if(!regIdNo.test(this.number)){
        this.rId = true
      } else {
        this.rId = false
      }
    },
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
              name: this.fullName,
              idNo: this.number,
              pros: this.shenFen_01.replace(/^data:image\/\w+;base64,/, ''),
              cons: this.shenFen_02.replace(/^data:image\/\w+;base64,/, '')
            }
            this.$store.dispatch('identity', data).then(res => {
              if (res.data.code === 0){
                done()
                location.reload()
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
    },
    onAgain() {
      Dialog.confirm({
      title: '温馨提示',
        message: '确定上传吗？',
        beforeClose: (action, done) =>{
        if (action === 'confirm') {
          const data = {
            name: this.fullName,
            idNo: this.number,
            pros: this.shenFen_01.replace(/^data:image\/\w+;base64,/, ''),
            cons: this.shenFen_02.replace(/^data:image\/\w+;base64,/, ''),
            remark: '认证中',
            status: 2
          }
          this.$store.dispatch('updateIde', data).then(res => {
            if (res.data.code === 0){
              done()
              location.reload()
              Toast.success('重新上传成功！')
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
      this.shenFen_02 !== '/img/shenfen0813_02.b46a8d87.jpg' &&
      this.rName === false &&
      this.rId === false &&
      this.fullName !== '' &&
      this.number !== ''
    )
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
#fullname, #number{
  font-size: 12px;
  color: #ff0000;
  margin-left: 16px;
}
.su_title{
  padding-top: 10px;
  border-bottom: 1px solid #22c47c;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: #fff;
}
.box_container{
  border: 1px solid #22c47c;
  border-radius: 10px;
  background-color: #fbfbfb;
}
.tip{
  font-size: 13px;
  padding: 82px 12px;
  display: block;
  color: #555;
  text-align: center;
}
.icon{
  margin: 1px 10px 0 0;
}
.info{
  color: #717171;
  font-size: 12px;
  padding: 25px 0 12px 16px;
}
.cell_context{
  display: flex;
  flex-direction: row;
}
</style>
