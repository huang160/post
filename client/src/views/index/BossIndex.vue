<template>
  <div id="index" style="text-align: left">
    <header style="position: fixed;top: 0;width: 100%;z-index: 10">
      <van-nav-bar
        :left-text="post"
        @click-left="onClickLeft"
      >
      </van-nav-bar>
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
      <div>
        <van-tabs v-model="active" line-width="0" @change="newPost">
          <div style="border-bottom: 1px solid #eee"></div>
          <van-tab title="推荐"/>
          <van-tab title="最新"/>
        </van-tabs>
      </div>
    </header>
    <div style="margin-top: 90px;">
      <van-pull-refresh
        :disabled = 'change'
        v-if="list !== ''"
        v-model="refreshing"
        success-text="加载已完成"
        @refresh="onRefresh"
        style="margin-bottom: 50px;"
      >
        <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" >
          <div class="container"
               v-for="(item, index) in list"
               :key="index"
               v-if="item.header&&item.post_status"
          >
            <van-cell
              center
              :title="item.name"
              :border="false"
              @click="item.checked = true;change = true;"
              title-style="font-weight: bold;font-size: 18px"
            >
              <template #extra>
                <van-image width="50" height="50" round :src="'http://localhost:4000/images/' + item.header" />
              </template>
              <template #label>
                <div style="color: #505050">{{ item.education ? item.education : '暂无教育信息' }}</div>
                <div>{{item.job ? '应聘岗位：' + item.job : '岗位不明'}}</div>
                <div class="van-multi-ellipsis--l3">{{  item.info ?  item.info : '暂无个人描述' }}</div>
              </template>
            </van-cell>
            <div style="margin-bottom: 1px;border: 3px solid #ececec"></div>
            <van-popup
              v-model = "item.checked"
              position="bottom"
              :style="{ height: '100%' , width: '100%'}"
            >
              <van-nav-bar
                left-arrow
                :left-text="item.name"
                fixed
                @click-left="item.checked = false;change = false;"
              />
              <div class="container" style="padding: 10px 16px;margin: 46px 0 50px 0;">
                <div class="header" >
                  <div class="info" style="width: 80%;">
                     <div style="font-size: 20px;font-weight: bold;"> {{item.name}}</div>
                     <div style="font-size: 12px;padding: 3px 1px;color: #969799;">
                       {{birth(item.birthDate) + '岁' + '\n' + item.sex}}
                     </div>
                  </div>
                  <div class="image" style="width: 20%;text-align: right;">
                    <van-image
                      width="40"
                      height="40"
                      alt="300*300"
                      round
                      :src="'http://localhost:4000/images/'+ item.header"
                    />
                  </div>
                </div>
                <div class="content" v-if="item.education">
                  <div style="padding: 10px 0">
                    {{item.education}}
                  </div>
                  <div>{{item.info}}</div>
                </div>
                <div class="wish" v-if="item.job">
                  <div style="font-size: 14px;">求职期望</div>
                  <div style="display: flex;flex-direction: row;">
                    <div style="width: 70%;font-weight: bold;">{{item.job + '，' + item.city}}</div>
                    <div style="width: 30%;color: #22c47c;text-align: right;">{{item.salary}}</div>
                  </div>
                  <div style="font-size: 13px;color: #969799;">{{item.post_status}}</div>
                </div>
                <div class="exps" v-if="item.exp.length > 0">
                  <div style="font-size: 13px;color: #111">工作/项目经历</div>
                  <div
                    v-for="(i, ind) in item.exp"
                    :key="ind"
                    style="padding: 10px 0"
                  >
                    <div style="display: flex;flex-direction: row;">
                      <div style="color: #222;width: 70%;">{{i.name}}</div>
                      <div style="width: 30%;color: #969799;text-align: right;">{{i.time}}</div>
                    </div>
                    <div style="color: #969799;">{{i.post + '\n' + i.trade}}</div>
                    <div style="color: #111;" v-if="i.describe">
                      内容<br>
                      <span style="word-break: break-all;color: #969799;" v-html="i.describe.replace(/\n/g, '<br/>')"></span>
                    </div>
                    <div style="color: #111;" v-if="i.result">
                      业绩<br>
                      <span style="word-break: break-all;color: #969799;" v-html="i.result.replace(/\n/g, '<br/>')"></span>
                    </div>
                    <div style="color: #111;" v-if="i.link">
                      作品/项目链接<br>
                      <span style="color: #969799">{{i.link}}</span>
                    </div>
                  </div>
                </div>
                <div class="award" v-if="item.certificate">
                  <div style="font-size: 14px;">资格证书</div>
                  <div>
                    <van-tag type="success">{{item.certificate}}</van-tag>
                  </div>
                </div>
              </div>
              <div style="position: fixed;bottom: 0;z-index: 10;width: 100%;">
                <van-button
                  type="primary"
                  size="large"
                  @click="onClickPost(item)"
                >
                  立即沟通
                </van-button>
              </div>
            </van-popup>
          </div>
        </van-list>
      </van-pull-refresh>
      <van-empty v-else image="search" description="找不到相关信息" />
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import {mapState} from 'vuex'
import {
  NavBar,
  Cascader,
  Icon,
  Tab,
  Tabs,
  List,
  PullRefresh,
  Cell,
  Image,
  Empty,
  Button,
  Toast
} from 'vant'
import {parseStringToStar, birthDate} from "../../utils";

Vue.use(NavBar)
Vue.use(Cascader)
Vue.use(Icon)
Vue.use(Tab)
Vue.use(Tabs)
Vue.use(List)
Vue.use(PullRefresh)
Vue.use(Cell)
Vue.use(Image)
Vue.use(Button)
Vue.use(Empty)

export default {
  name: "BossIndex",
  data(){
    return {
      change: false,
      active: '',
      loading: false,
      finished: false,
      refreshing: false,
      list: [],
      post: '选择职位',
      postShow: false,
      cascaderValue: '',
      options: [],
      fieldNames: {
        text: 'name',
        value: 'id',
        children: 'trade_list',
      },
      time: ''
    }
  },
  computed: {
    ...mapState(['user','userList'])
  },
  methods: {
    onClickLeft(){
      // 获取职位信息列表
      this.$store.dispatch('getPostList').then(res => {
        if (res.data.code === 0){
          this.options = res.data.data
        }else {
          Toast.fail('网络失败')
        }
      })
      this.postShow = true
    },
    onFinish({selectedOptions}){
      this.postShow = false;
      this.post = parseStringToStar(selectedOptions[1].name, 8)
      this.onRefresh()
    },
    onLoad() {
      this.$store.dispatch('getUserList', '牛人')
       this.time =  setTimeout(() => {
        if (this.refreshing) {
          this.refreshing = false
        }
        this.list = []
        for (let i = 0; i < this.userList.length; i++){
          if (this.post === '选择职位'){
            this.list.push(this.userList[i])
          }else if(this.userList[i].job === this.post) {
            this.list.push(this.userList[i])
          }
        }

         if (this.list.length >= 0){
           this.list.forEach(value => {
             this.$set(value, 'checked', false)
           })
         }

        this.loading = false
        if (this.list.length >= 0) {
          this.finished = true
        }
      }, 1000);
    },
    onRefresh() {
      // 清空列表数据
      this.finished = false;
      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true;
      this.onLoad();
    },
    onClickPost(item) {
      this.$router.push({
        path: `/chat/${item._id}`,
        query: {
          name: item.name,
          job: item.job,
        },
      })
    },
    // （推荐，最新标签的切换）
    newPost(){
      clearTimeout(this.time)
      this.onRefresh()
    },
    birth(val){
      return birthDate(val)
    }
  },
  mounted() {
    if (!this.user.header){
      this.$router.replace('/info')
    }
  }
}
</script>

<style scoped>
.header{
  padding: 10px 0;
  display: flex;
  flex-direction: row;
  border-bottom: 1px solid #ececec;
}
.content,.wish,.exps,.award{
  padding: 10px 0;
  font-size: 12px;
  border-bottom: 1px solid #ececec;
}
</style>
