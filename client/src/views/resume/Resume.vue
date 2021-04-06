<template>
  <div id="Resume" style="text-align: left">
    <van-nav-bar
      title="我的在线简历"
      left-arrow
      fixed
      right-text="保存"
      @click-left="$router.back()"
      @click-right="onClickRight"
    />
    <div style="margin-top: 46px"></div>
    <van-cell center :label="birth(user.birthDate) ? '' :  birth(user.birthDate) + '·' + user.education" title-style="font-size: 20px;font-weight: bold;">
      <template #title>
        <span class="custom-title">{{ user.name }}</span>
        <van-icon name="edit" @click="$router.push('/information')" style="margin-left: 10px;cursor: pointer"/>
      </template>
      <template #extra>
        <van-image round  width="65" height="65" :src="header"/>
      </template>
    </van-cell>
    <van-cell title="个人优势" title-style="font-weight: bold;" :border="false" />
    <van-field
      v-model="info"
      rows="2"
      type="textarea"
      maxlength="50"
      :placeholder="'如：(IT)熟悉html/css语言,具备良好的编程习惯...' "
      show-word-limit
    />
    <van-cell
      center
      title="求职期望"
      title-style="font-weight: bold;"
      :label="user.post_status + '\n' + user.job + '\n' + user.city + '\n' + user.salary "
      is-link
      to="/purpose"
    />
    <van-cell
      title="工作·项目经历"
      :border="false"
      title-style="font-weight: bold;"
    >
     <template #extra>
       <van-icon name="add-o" size="20" style="cursor: pointer;" @click="$router.push('/experience')"/>
     </template>
    </van-cell>
    <van-cell
      v-if="exp" v-for="(item, index) in exp"
      :key="index"
      :title="item.name"
      :value="item.time"
      is-link
      title-style="font-size: 13px;"
      title-class="van-ellipsis"
      value-class="van-ellipsis"
      :to="'/experience?_id=' + item._id"
    >
      <template #label>
        <div class="van-ellipsis">{{item.post + '\n' + item.trade}}</div>
        <span v-if="item.describe" style="color: #555;padding-top: 10px;">内容:</span>
        <div class="van-ellipsis" style="color: #555;">{{item.describe}}</div>
        <span v-if="item.result" style="color: #555;padding-top: 10px;">业绩:</span>
        <div class="van-ellipsis" style="color: #555;">{{item.result}}</div>
      </template>
    </van-cell>
    <van-cell title="教育背景" title-style="font-weight: bold;" :border="false"/>
    <van-field v-model="education" placeholder="请输入院校及最高学历,如：广州大学·21届本科" />
    <van-cell title="奖项·证书" title-style="font-weight: bold;" :border="false"/>
    <van-field
      v-model="certificate"
      rows="2"
      type="textarea"
      maxlength="100"
      placeholder="如：大英四级、六级,教师资格证,计算机二级... "
      show-word-limit
    />
  </div>
</template>

<script>
import Vue from 'vue'
import {mapState} from "vuex";
import {Cell, Field, Icon, Image, NavBar, Toast} from 'vant'
import {birthDate} from "../../utils";

Vue.use(NavBar)
Vue.use(Cell)
Vue.use(Cell)
Vue.use(Icon)
Vue.use(Image)
Vue.use(Field)
Vue.use(Toast)

export default {
  name: "Resume",
  data() {
   return {
     header: '',
     fullName: '',
     information: '',
     info: '',
     purpose: '',
     certificate: '',
     education:'',
     exp: []
   }
  },
  computed:{
    ...mapState(['user'])
  },
  methods: {
    onClickRight(){
      let data = {
        info: this.info,
        education: this.education,
        certificate: this.certificate
      }
      this.$store.dispatch('updateUser', data).then(res => {
        if (res.data.code === 0){
          Toast.success('保存成功')
          this.$router.back()
        }else {
          Toast.fail(res.data.msg)
        }
      }).catch(()=>{
        Toast.fail('网络错误')
      })
    },
    birth(data) {
      return birthDate(data);
    },
  },
  created() {
    this.$store.dispatch('getExpList').then(res => {
      const result = res.data
      if (result.code === 0){
        this.exp = result.data
      }else {
        Toast(result.msg)
      }
    }).catch(() => {
      Toast.fail('网络错误')
    })
    this.$store.dispatch('getUser').then(res => {
      if (res.data.code ===0 ){
        const result = res.data.data
        if (result.info){
          this.info = result.info
          this.certificate = result.certificate
          this.education = result.education
        }
      }
    })
  },
  mounted() {
    let {header} = this.user
    if (header){
      this.header = `http://localhost:4000/images/${header}`
    }
  }
}
</script>

<style scoped>

</style>
