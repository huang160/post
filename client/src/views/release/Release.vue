<template>
  <div id="release" style="text-align: left">
    <header style="z-index: 10;position: fixed;top: 0;width: 100%;">
      <van-nav-bar
        :title="change"
        left-arrow
        :right-text="status === 1 ? '停止招聘' : ''"
        @click-left="status || status === 0 ? $router.back() : onBack()"
        @click-right="onClickRight"
      />
      <van-notice-bar v-if="!status" left-icon="info-o" text="所有职位发布均有专人审核，请认真填写" />
      <van-notice-bar v-else left-icon="info-o" text="职位修改后会进入审核，请耐心等待，请勿重复提交修改"/>
    </header>
    <div id="container" style="margin: 86px 0 50px 0">
      <van-skeleton title :loading="change === '添加职位' ? false : loading" row="12" style="padding-top: 10px">
        <van-field
          v-model = "postName"
          label-width="56px"
          clearable
          label="职位名称"
          placeholder="例如：Web前端开发工程师..."
          input-align="right"
        />
        <van-cell title="职位类型" is-link :value="post" @click="postShow = true"/>
        <van-popup v-model="postShow" position="bottom">
          <van-cascader
            v-model="cascaderValue"
            title="选择职位类别"
            :options="options"
            :field-names="fieldNames"
            active-color="#22c47c"
            @close="postShow = false"
            @finish="onFinish"
          />
        </van-popup>
        <van-cell title="薪资范围" is-link :value="salary" @click="salaryShow = true"/>
        <van-popup v-model="salaryShow" position="bottom">
          <van-picker
            show-toolbar
            title="薪资范围(千元/月)"
            :columns="salaryList"
            @confirm="salaryDetail"
            @cancel="salaryShow = false"
          />
        </van-popup>
        <van-cell title="经验要求" is-link :value="experience" @click="experienceShow = true"/>
        <van-popup round v-model="experienceShow" position="bottom">
          <van-picker
            show-toolbar
            title="请选择经验要求"
            :columns="experienceList"
            @confirm="experienceDetail"
            @cancel="experienceShow = false"
          />
        </van-popup>
        <van-cell title="学历要求" is-link :value="education" @click="educationShow = true"/>
        <van-popup round v-model="educationShow" position="bottom">
          <van-picker
            show-toolbar
            title="请选择学历要求"
            :columns="educationList"
            @confirm="educationDetail"
            @cancel="educationShow = false"
          />
        </van-popup>
        <van-cell title="工作城市" is-link :value="city" @click="cityShow = true"/>
        <van-popup round v-model="cityShow" position="bottom">
          <van-picker
            show-toolbar
            title="请选择工作城市"
            :columns="cityList"
            @confirm="cityDetail"
            @cancel="cityShow = false"
          />
        </van-popup>
        <van-cell title="岗位职责" :border="false" />
        <van-field
          v-model = "duty"
          rows="10"
          type="textarea"
          size="large"
          maxlength="500"
          placeholder="例如:
  1.负责公司的核心产品的开发, 遵从架构设计、数据设计...；
  2.优化现有产品...；
  3.熟悉前端开发常见技术：javascript、HTML、CSS等...；
  4.负责团队中工具类项目的开发以及维护..."
          show-word-limit
        />
        <van-cell title="任职要求" :border="false" />
        <van-field
          v-model = "requirement"
          rows="10"
          type="textarea"
          size="large"
          maxlength="500"
          placeholder="例如:
  1.2021届全日制本科以上学历应届毕业生...
  2.具有较强的逻辑思维能力和学习能力...
  3.对互联网产品和Web技术有浓厚兴趣...
  4.了解html、css、JavaScript..."
          show-word-limit
        />
        <footer>
          <van-button
            size="large"
            :disabled = "onDisabled"
            type="primary"
            @click=" status || status === 0 ? updatePost() : addPost()"
          >
            {{ status === 1 || status === 2 ? '确定修改' : status === 0 || status ===  3 ? '重新发布' :  '保存'}}
          </van-button>
        </footer>
      </van-skeleton>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import {mapState} from "vuex";
import {NavBar, NoticeBar, Icon, Cell, Popup, Cascader, Picker, Field, Button, Skeleton, Toast, Dialog} from 'vant'

Vue.use(NavBar)
Vue.use(NoticeBar)
Vue.use(Icon)
Vue.use(Cell)
Vue.use(Popup)
Vue.use(Cascader)
Vue.use(Picker)
Vue.use(Field)
Vue.use(Button)
Vue.use(Skeleton)
Vue.use(Toast)

export default {
  name: "Release",
  data() {
    return {
      change: '添加职位',
      status: '',
      postName: '',
      post: '',
      postShow: false,
      cascaderValue: '',
      fieldNames: {
        text: 'name',
        value: 'id',
        children: 'trade_list',
      },
      options: [],
      salary:'',
      salaryShow: false,
      salaryList: [
        {
          text: '面议',
          children: [{text: '面议'}],
        },
      ],
      experience: '',
      experienceShow: false,
      experienceList: ['经历不限', '在校生', '应届生', '1年以内', '1-3年', '3-5年', '5-10年', '10年以上'],
      education: '',
      educationShow: false,
      educationList: ['学历不限', '初中及以下', '中专/中技', '高中', '大专', '本科', '硕士', '博士'],
      city: '',
      cityShow: false,
      cityList: [],
      duty: '',
      requirement: '',
      onDisabled: true,
      loading: true
    }
  },
  computed: {
    ...mapState(['user','postList', 'identity'])
  },
  methods: {
    onBack(){
      if (
        this.postName !== '' ||
        this.post !== ''||
        this.salary !== ''||
        this.experience !== ''||
        this.education !== '' ||
        this.city !== ''||
        this.duty.trim() !== ''||
        this.requirement.trim() !== ''
      ){
        Dialog.confirm({
          title: '温馨提示',
          message: '有内容尚未保存，确定退出吗？',
        })
          .then(() => {
            this.$router.back()
          })
          .catch(() => {
            // on cancel
          });
      }else {
        this.$router.back()
      }
    },
    onClickRight(){
      const data = {_id: this.$route.query._id,remark: '停止招聘', status: 3}
      Dialog.confirm({
        title: '温馨提示',
        message: '是否停止招聘？ \n 注：不会提交修改内容，如需要提交请在职位修改页面选择【确定修改】按钮',
      })
        .then(() => {
          this.$store.dispatch('updatePost', data).then(res => {
            if (res.data.code === 0){
              this.$router.back()
              Toast.success('操作成功!')
            }else {
              Toast.fail('操作失败！')
            }
          }).catch(() => {
            Toast.fail('网络出错！')
          })
        })
        .catch(() => {
          // on cancel
        });
    },
    onFinish({selectedOptions}){
      this.postShow = false;
      this.post = selectedOptions[1].name
    },
    salaryDetail(value){
      this.salary = value.join('-')
      this.salaryShow = false
    },
    educationDetail(value){
      this.education = value
      this.educationShow = false
    },
    experienceDetail(value){
      this.experience = value
      this.experienceShow = false
    },
    cityDetail(value){
      if (value[1] === '市辖区' || value[1] ==='县' || value[1] === '省直辖县级行政区划'){
        this.city = value[0] + '·' + value[2]
      }else {
        this.city = value[1] + '·' + value[2]
      }
      this.cityShow = false
    },
    addPost(){
      const data = {
        name: this.user.name,
        postName: this.postName,
        post: this.post,
        salary: this.salary,
        experience: this.experience,
        education: this.education,
        city: this.city,
        duty: this.duty,
        requirement: this.requirement
      }
      Dialog.confirm({
        title: '温馨提示',
        message: '确定职位信息无误？',
      })
        .then(() => {
          this.$store.dispatch('position', data).then(res => {
            if (res.data.code === 0){
              Toast.success('保存成功!')
              this.$router.back()
            }else {
              Toast.fail('保存失败！')
            }
          }).catch(() => {
            Toast.fail('网络出错！')
          })
        })
        .catch(() => {
          // on cancel
        });
    },
    updatePost(){
      const data = {
        _id: this.$route.query._id,
        postName: this.postName,
        post: this.post,
        salary: this.salary,
        experience: this.experience,
        education: this.education,
        city: this.city,
        duty: this.duty,
        requirement: this.requirement,
        status: 2,
        remark: '审核中'
      }
      Dialog.confirm({
        title: '温馨提示',
        message: '是否提交此次更改？',
      })
        .then(() => {
          this.$store.dispatch('updatePost', data).then(res => {
            if (res.data.code === 0){
              this.$router.back()
              Toast.success('更改成功!')
            }else {
              Toast.fail('更改失败！')
            }
          }).catch(() => {
            Toast.fail('网络出错！')
          })
        })
        .catch(() => {
          // on cancel
        });
    }
  },
  created() {
    // 遍历二级联动（薪资）
    for (let i =1; i< 101; i++){
      this.salaryList.push({   //父级
        text: `${i}k`,
        children: []
      })
      for (let j = 1; j <= 10; j++){
        this.salaryList[i].children.push( //子级
          {text: `${i+j}k`}
        )
      }
    }
    //获取职位列表
    this.$store.dispatch('getPostList').then(res => {
      if (res.data.code === 0){
        this.options= res.data.data
      }else {
        Toast.fail('网络失败')
      }
    })
    //获取省市区三级联动数据处理
    this.$store.dispatch('getCityList').then(res => {
      const result = res.data
      for (let i = 0; i < result.length; i++){
        this.cityList.push({
          text: result[i].name,
          children: []
        })
        for (let j = 0; j < result[i].children.length; j++){
          this.cityList[i].children.push({
            text: result[i].children[j].name,
            children: []
          })
          for (let k = 0; k < result[i].children[j].children.length; k++){
            this.cityList[i].children[j].children.push({
              text: result[i].children[j].children[k].name
            })
          }
        }
      }
    })
    // 获取对应_id的职位信息
    const {_id} = this.$route.query
    if (_id){
      this.$store.dispatch('postMsg', _id).then(res => {
        if (res.data.code === 0){
          const result = res.data.data
          const {city, duty, education, experience, post, postName, requirement, salary, status} = result
          this.postName = postName
          this.post = post
          this.salary = salary
          this.experience = experience
          this.education = education
          this.city = city
          this.duty = duty
          this.requirement = requirement
          this.status = status
          this.change = '职位修改'
          this.loading = false
        }else {
          Toast.fail(res.data.msg)
        }
      }).catch(() => {
        Toast.fail('网络出错！')
      })
    }
  },
  updated() {
    this.onDisabled = !(
      this.postName !== '' &&
      this.post !== '' &&
      this.salary !== '' &&
      this.experience !== '' &&
      this.education !== '' &&
      this.city !== '' &&
      this.duty.trim() !== '' &&
      this.requirement.trim() !== '');
  }
}
</script>

<style scoped>
footer{
  position: fixed;
  bottom: 0;
  width: 100%;
}
</style>
