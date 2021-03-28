<template>
  <div id="experience">
    <van-nav-bar
      :title="confirm ? '简历修改' : '添加经历'"
      left-arrow
      fixed
      right-text="保存"
      @click-left="confirm ? $router.back() : back()"
      @click-right="confirm ? onUpdate() : onClickRight()"
    />
    <div class="container" style="text-align: left;margin-top: 56px">
      <div class="title">公司/项目名称</div>
      <van-field v-model = "name" placeholder="请输入"/>
      <div class="title">工龄/项目时长</div>
      <van-field v-model = "time"  placeholder="请输入"/>
      <div class="title">职位名称/项目角色</div>
      <van-field v-model = "post"  placeholder="请输入"/>
      <div class="title">工作内容/项目描述</div>
      <van-field
        v-model = "describe"
        rows="4"
        type="textarea"
        maxlength="300"
        placeholder="请输入"
        show-word-limit
      />
      <van-cell title="以下为选填项" :border="false" title-style="text-align:center;"/>
      <div class="title">所在行业/项目性质（外包，比赛，毕设，课设...）</div>
      <van-field v-model = "trade"  placeholder="选填 请输入"/>
      <div class="title">工作业绩/项目业绩</div>
      <van-field v-model = "result"  placeholder="选填 请输入"/>
      <div class="title">网站链接/项目链接(github，CSDN...)</div>
      <van-field v-model = "link"  placeholder="选填 请输入"/>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import {mapState} from 'vuex'
import {Button, NavBar, Cell, Field, Dialog, Toast} from 'vant'

Vue.use(Button)
Vue.use(NavBar)
Vue.use(Cell)
Vue.use(Field)
Vue.use(Dialog)
Vue.use(Toast)

export default {
  name: "Experience",
  data() {
    return {
      name: '',
      time: '',
      post: '',
      describe: '',
      trade: '',
      result: '',
      link: '',
      confirm: false
    }
  },
  computed: {...mapState(['user'])},
  methods: {
    onClickRight(){
      let exp =  {
        pid: this.user._id,
        name: this.name,
        post: this.post,
        time: this.time,
        describe: this.describe,
        result: this.result,
        trade: this.trade,
        link: this.link
      }

      if(this.name === '' || this.post === '' || this.time === '' || this.describe === ''){
        Toast('经历未完善！')
      }else {
        this.$store.dispatch('exp', exp).then(res => {
          if (res.data.code === 0){
            Toast.success('保存成功！')
            this.$router.back()
          }else if (res.data.code === 1){
            Toast.fail(res.data.msg)
          }else {
            Toast.fail('保存失败')
          }
        })
      }
    },
    onUpdate(){
      let exp =  {
        _id: this.$route.query._id,
        pid: this.user._id,
        name: this.name,
        post: this.post,
        time: this.time,
        describe: this.describe,
        result: this.result,
        trade: this.trade,
        link: this.link
      }

      if(this.name === '' || this.post === '' || this.time === '' || this.describe === ''){
        Toast('经历未完善！')
      }else {
        this.$store.dispatch('updateExp', exp).then(res => {
          if (res.data.code === 0){
            Toast.success('更改成功！')
            this.$router.back()
          }else if (res.data.code === 1){
            Toast.fail(res.data.msg)
          }else {
            Toast.fail('更改失败')
          }
        })
      }
    },
    back(){
      if(this.name !== '' ||
        this.post !== '' ||
        this.time !== '' ||
        this.describe !== '' ||
        this.result !== '' ||
        this.trade !== '' ||
        this.link !== ''
      ){
        Dialog.confirm({
          title: '温馨提示',
          message: '有内容未保存，要退出吗？',
          theme: 'round-button',
        }).then(() => {
          this.$router.back()
        }).catch(() => {

        })
      }else {
        this.$router.back()
      }
    },
  },
  created() {
    window.scrollTo(0, 0)
    let {_id} = this.$route.query
    if (_id){
      const arr = ['name', 'post', 'time', 'describe', 'result', 'trade', 'link']
      this.$store.dispatch('getExp', {_id}).then(res => {
        const result = res.data
        if (result.code === 0){
          this.confirm = true
          arr.forEach(value => {
            this[value] = result.data[value]
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.title{
  font-size: 12px;
  color: #828284;
  margin-left: 16px;
  padding-top: 10px;
}
</style>
