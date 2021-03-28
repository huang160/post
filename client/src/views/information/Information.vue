<template>
  <div id="information">
    <van-nav-bar
      title="个人信息"
      right-text="保存"
      left-arrow
      fixed
      @click-left="$router.back()"
      @click-right="updateUser"
    />
    <div class="container" style="margin-top: 56px;text-align: left">
      <div id="header">
        <van-cell center title="头像">
          <template #default>
            <van-uploader :after-read="afterRead">
              <van-image width="65" height="65" round :src=" headImage.indexOf('.png') !== -1 ? getHeaderImag(headImage) : headImage " />
            </van-uploader>
          </template>
        </van-cell>
      </div>
      <div id="name">
        <div class="title">姓名</div>
        <van-field v-model="fullName" />
      </div>
      <div id="applicant" v-if="user.type === '牛人'">
        <div id="sex">
          <div class="title">性别</div>
          <van-cell :title="sex" is-link title-style="font-size: 16px" @click="sexShow = true"/>
          <van-popup v-model="sexShow" position="bottom">
            <van-picker
              show-toolbar
              title="选择性别"
              :columns="sexList"
              @confirm="sexDetail"
              @cancel="sexShow = false"
            />
          </van-popup>
        </div>
        <div id="person">
          <div class="title">我的牛人身份</div>
          <van-cell :title="person" is-link title-style="font-size: 16px" @click="personShow = true"/>
          <van-popup v-model="personShow" position="bottom">
            <van-picker
              show-toolbar
              title="选择牛人身份"
              :columns="personList"
              @confirm="personDetail"
              @cancel="personShow = false"
            />
          </van-popup>
        </div>
        <div id="birthDate">
          <div class="title">出生年月</div>
          <van-cell :title="birthDate" is-link title-style="font-size: 16px" @click="birthDateShow = true"/>
          <van-popup v-model="birthDateShow" position="bottom">
            <van-datetime-picker
              v-model="currentDate"
              type="year-month"
              title="选择年月"
              :min-date="minDate"
              :max-date="maxDate"
              :formatter="formatter"
              @confirm="birthDateDetail"
              @cancel="birthDateShow = false"
            />
          </van-popup>
        </div>
      </div>
      <div id="Boss" v-else>
        <van-cell title="我的职位" title-class="Title" :border="false"/>
        <van-field placeholder="请输入我的职位" maxlength="20" v-model="job"/>
        <van-cell title="我的公司" title-class="Title" :border="false"/>
        <van-field placeholder="注意区分总公司和分公司，请输入" maxlength="20" v-model="company"/>
        <van-cell title="个人简介" title-class="Title" :border="false"/>
        <van-field
          v-model="info"
          rows="2"
          type="textarea"
          placeholder="可选,请输入(100字以内)"
          maxlength="100"
          show-word-limit
        />
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import {mapState} from 'vuex'
import {NavBar, Cell, Uploader, Image, Field, Picker, Popup, DatetimePicker, Dialog, Toast} from 'vant'

Vue.use(NavBar)
Vue.use(Cell)
Vue.use(Uploader)
Vue.use(Image)
Vue.use(Field)
Vue.use(Picker)
Vue.use(Popup)
Vue.use(DatetimePicker)
Vue.use(Dialog)
Vue.use(Toast)

export default {
  name: "Information",
  data() {
    return {
      headImage: '',
      fullName: '',
      sex: '',
      sexShow: false,
      sexList: ['男', '女'],
      person: '',
      personShow: false,
      personList: ['学生', '职场人'],
      birthDate: '',
      birthDateShow: false,
      minDate: new Date(1953, 0, 1),
      maxDate: new Date(2006, 10, 1),
      currentDate: new Date(),
      job: '',
      info: '',
      company: ''
    }
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    // 获取后台头像
    getHeaderImag(img){
      return `http://localhost:4000/images/${img}`
    },
    //动态获取上传图片地址
    afterRead(file){
      this.headImage = file.content
    },
    personDetail(val){
      this.person = val
      this.personShow = false
    },
    sexDetail(val){
      this.sex = val
      this.sexShow = false
    },
    // 获取出生年月列表
    formatter(type, val) {
      if (type === 'year') {
        return `${val}`;
      } else if (type === 'month') {
        return `${val}`;
      }
      return val;
    },
    // 动态更新出生年月
    birthDateDetail(val){
      let dateTime = new Date(val)
      let month = dateTime.getMonth()+1
      if (month < 10){
        month = '0' + month
      }
      this.birthDate  = dateTime.getFullYear()+'.'+ month
      this.birthDateShow = false
    },
    // 保存更改,发送axios请求
    updateUser(){
      Dialog.confirm({
        title: '温馨提示',
        message: '确定要保存此次操作吗？',
        confirmButtonColor: '#22c47c'
      })
        .then(() => {
          let applicantInfo = {
            header: this.headImage === this.user.header ?  this.user.header : this.headImage.replace(/^data:image\/\w+;base64,/, ''),
            name: this.fullName,
            sex: this.sex,
            person: this.person,
            birthDate: this.birthDate
          }
          let bossInfo = {
            header: this.headImage === this.user.header ?  this.user.header : this.headImage.replace(/^data:image\/\w+;base64,/, ''),
            name: this.fullName,
            job: this.job,
            company: this.company,
            info: this.info
          }

          this.$store.dispatch('updateUser', this.user.type === '牛人' ? applicantInfo : bossInfo).then(res => {
            if (res.data.code === 0){
              Toast.success('保存成功')
              this.$router.back()
            }else {
              Toast.fail('保存失败')
            }
          }).catch(() => {
            Toast.fail('网络出错')
          })
        })
        .catch(() => {
          // on cancel
        });
    }
  },
  mounted() {
    const {header, name, sex, person, birthDate, job, company, info} = this.user
    if (header){
      this.headImage = header
      this.fullName = name
      this.sex = sex
      this.person = person
      this.birthDate = birthDate
      this.job = job
      this.company = company
      this.info = info
    }
  }
}
</script>

<style scoped>
.title{
  font-size: 12px;
  color: #969799;
  margin-left: 16px;
  padding-top: 10px;
}
.Title{
  font-size: 12px;
  color: #969799;
}
.Text{
  font-size: 14px;
  color: #111;
}
</style>
