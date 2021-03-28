<template>
  <div style="height: 100%">
    <van-nav-bar
      title="管理求职意向"
      right-text="保存"
      left-arrow
      @click-left="$router.back()"
      @click-right="onClickRight"
      fixed
    />
    <div class="container" style="margin-top: 60px;text-align: left">
      <div id="status">
        <div class="title">求职状态</div>
        <van-cell :title="post_status" is-link title-style="font-size: 16px" @click="showPicker = true" />
        <van-popup v-model="showPicker" position="bottom">
          <van-picker
            show-toolbar
            title="求职状态"
            :columns="status"
            @cancel="showPicker = false"
            @confirm="onConfirm"
          />
        </van-popup>
      </div>
      <div id="want">
        <div class="title">期望职位</div>
        <van-cell :title="post" is-link title-style="font-size: 16px" @click="postShow = true"/>
        <van-popup v-model="postShow" position="bottom">
          <van-cascader
            v-model="cascaderValue"
            title="选择期望职位"
            :options="options"
            :field-names="fieldNames"
            active-color="#22c47c"
            @close="postShow = false"
            @finish="onFinish"
          />
        </van-popup>
      </div>
      <div id="city">
        <div class="title">工作城市</div>
        <van-cell :title="city" is-link title-style="font-size: 16px" @click="cityShow = true"/>
        <van-popup v-model="cityShow" position="bottom">
          <van-nav-bar
            title="选择工作城市"
            left-arrow
            fixed
            @click-left="cityShow = false"
          />
          <van-index-bar :index-list="words" :sticky="false" highlight-color="#22c47c" style="margin-top: 56px">
            <van-index-anchor index="热门城市" style="margin-left: 10px"/>
            <div class="show">
              <div class="city" v-for="(i, index) in hot" :key="index" @click="cityDetail(i)">{{i}}</div>
            </div>
            <div v-for="(i, index) in words" :key="index">
              <van-index-anchor :index="i" style="clear: both;margin-left: 10px" />
              <div class="show">
                <div class="city" v-for="(j, index) in cityList[i]" :key="index" @click="cityDetail(j.name)">{{j.name}}</div>
              </div>
            </div>
          </van-index-bar>
        </van-popup>
      </div>
      <div id="salary">
        <div class="title">薪资要求</div>
        <van-cell :title="salary" is-link title-style="font-size: 16px" @click="salaryShow = true"/>
        <van-popup v-model="salaryShow" position="bottom">
          <van-picker
            show-toolbar
            title="薪资要求(千元/月)"
            :columns="salaryList"
            @confirm="salaryDetail"
            @cancel="salaryShow = false"
          />
        </van-popup>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import {mapState} from 'vuex'
import {NavBar, Cell, Popup, Picker, Cascader, IndexBar, IndexAnchor, Toast, Dialog} from 'vant'
import cityList from "china-city-data";

Vue.use(NavBar)
Vue.use(Cell)
Vue.use(Popup)
Vue.use(Picker)
Vue.use(Cascader)
Vue.use(IndexBar)
Vue.use(IndexAnchor)
Vue.use(Toast)
Vue.use(Dialog)

export default {
  name: "Purpose",
  data(){
    return {
      post_status: '请选择求职状态',
      showPicker: false,
      status: ['离校-随时到岗', '在校-月内到岗', '在校-考虑机会', '在校-暂不考虑'],
      post: '请选择职位',
      postShow: false,
      cascaderValue: '',
      fieldNames: {
        text: 'name',
        value: 'id',
        children: 'trade_list',
      },
      options: [],
      city: '请选择工作城市',
      cityShow: false,
      cityList,
      hot: ['北京', '上海', '广州', '深圳','成都'],
      words: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'W', 'X', 'Y', 'Z'],
      salary: '请选择薪资',
      salaryShow: false,
      salaryList: [
        {
          text: '面议',
          children: [{text: '面议'}],
        },
      ]
    }
  },
  computed: {
    ...mapState(['user']),
  },
  methods: {
    onClickRight(){
      let purposeList =  {
        post_status: this.post_status,
        job: this.post,
        city: this.city,
        salary: this.salary
      }
      this.$store.dispatch('updateUser', purposeList).then(res => {
        if (res.data.code === 0){
          Toast.success('保存成功')
          this.$router.back()
        }else {
          Toast.fail('保存失败')
        }
      }).catch(() => {
        Toast.fail('网络出错')
      })
    },
    onConfirm(val){
      this.post_status = val
      this.showPicker = false
    },
    onFinish({selectedOptions}){
      this.postShow = false;
      this.post = selectedOptions[1].name
    },
    cityDetail(data) {
      this.city = data
      this.cityShow = false
    },
    salaryDetail(value){
      this.salary = value.join('-')
      this.salaryShow = false
    }
  },
  created() {
    // 遍历二级联动（薪资）
    for (let i =1; i< 101; i++){
      this.salaryList.push({   //父级
        text: `${i}k`,
        children: []
      })
      this.salaryList[i].children.push( //子级
        {text: `${i+1}k`},
        {text: `${i+2}k`},
        {text: `${i+3}k`},
        {text: `${i+4}k`},
        {text: `${i+5}k`}
      )
    }
    // 获取职位信息列表
    this.$store.dispatch('getPostList').then(res => {
      if (res.data.code === 0){
        this.options= res.data.data
      }else {
        Toast.fail('网络失败')
      }
    })
  },
  mounted() {
    let {post_status, job, city, salary} = this.user
    if (post_status){
      this.post_status = post_status
    }
    if (job){
      this.post = job
    }
    if (city){
      this.city = city
    }
    if (salary){
      this.salary = salary
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
.show{
  line-height: 12px;
  position: relative;
  margin-left: 15px;
}
.city{
  width: 4.5rem;
  height: 1.3rem;
  font-size: 12px;
  padding: 5px;
  margin: 5px 8px;
  float: left;
  background-color: #f3f3f3;
  text-align: center;
  cursor: pointer;
}
</style>
