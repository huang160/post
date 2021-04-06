<template>
  <div id="index" style="text-align: left;">
    <header style="position: fixed;top: 0;width: 100%;z-index: 10">
      <van-nav-bar
        :left-text="post"
        @click-left="onClickLeft"
      >
        <template #right>
          <van-icon name="search"/>
        </template>
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
        <van-tabs v-model="active" line-width="15px" @change="newPost">
          <div style="border-bottom: 1px solid #eee"></div>
          <van-tab title="推荐"/>
          <van-tab title="最新"/>
          <template #nav-right>
            <div style="text-align: right;line-height: 45px;width: 70%;">
              <van-tag
                plain
                type="primary"
                style="padding: 3px 0 2px 5px;cursor: pointer"
                @click="cityShow = true"
              >
                <span>{{ cityName }}</span>
                <img
                  src="~/assets/img/triangle.png"
                  alt="300*300"
                  style="width: 12px;height: 12px;margin: 5px 0 0 -2px;"
                >
              </van-tag>
              <van-popup v-model="cityShow" position="bottom" style="height: 100%;">
                <van-nav-bar
                  title="选择城市"
                  left-arrow
                  right-text="选择市区"
                  fixed
                  @click-left="cityShow = false"
                  @click-right="onClickRight"
                />
                <van-index-bar :index-list="words" :sticky="false" highlight-color="#22c47c" style="margin-top: 56px">
                  <van-index-anchor index="热门城市" style="margin-left: 10px;text-align: left;"/>
                  <div class="show">
                    <div class="city" v-for="(i, index) in hot" :key="index" @click="cityDetail(i)">{{i}}</div>
                  </div>
                  <div v-for="(i, index) in words" :key="index">
                    <van-index-anchor :index="i" style="clear: both;margin-left: 10px;text-align: left;" />
                    <div class="show">
                      <div class="city" v-for="(j, index) in cityData[i]" :key="index" @click="cityDetail(j.name)">{{j.name}}</div>
                    </div>
                  </div>
                </van-index-bar>
              </van-popup>
              <van-popup round v-model="popupShow" position="bottom">
                <van-picker
                  show-toolbar
                  title="选择市区"
                  :columns="suburbList"
                  @confirm="suburbDetail"
                  @cancel="popupShow = false"
                />
              </van-popup>
              <van-tag
                plain
                type="primary"
                style="padding:3px 0 2px 5px;margin: 0 10px;cursor: pointer"
                @click="selectShow = true"
              >
                <span>{{'筛选' + `${(eduNum + salaryNum + exNum) === 0 ? '' : '·' + ( eduNum + salaryNum + exNum) } ` }}</span>
                <img
                  src="~/assets/img/triangle.png"
                  width="12px"
                  height="12px"
                  alt="300*300"
                  style="margin: 5px 0 0 -2px;"
                >
              </van-tag>
              <van-popup v-model="selectShow" position="bottom" style="height: 100%;">
                <van-nav-bar
                  fixed
                  :title="'筛选' + `${(eduNum + salaryNum + exNum) === 0 ? '' : '·' + ( eduNum + salaryNum + exNum) } ` "
                  @click-left="onClickOut"
                >
                  <template #left>
                    <van-icon name="cross"/>
                  </template>
                </van-nav-bar>
                <div class="selected" style="margin-top: 46px;text-align: left;height: 100%">
                  <div class="select">
                    <div class="titleVal">学历要求</div>
                    <div class="selectList" :style="!eduStyle ? activeStyle : disActiveStyle" @click="onEduActive">不限</div>
                    <div
                      class="selectList"
                      v-for="(edu, eduIndex) in educationData"
                      :key="eduIndex"
                      :style="edu.checked ? activeStyle : disActiveStyle"
                      @click="eduClick(eduIndex)"
                    >
                      <span >{{edu.text}}</span>
                    </div>
                  </div>
                  <div class="select" style="clear: both;">
                    <div class="titleVal">薪资待遇<span style="font-size: 12px;color: #666">（单选）</span></div>
                    <div class="selectList" :style="!salStyle ? activeStyle : disActiveStyle" @click="onSalActive">不限</div>
                    <div class="selectList"
                         v-for="(sal, salIndex) in salaryData"
                         :key="salIndex"
                         @click="salClick(salIndex)"
                         :style="sal.checked ? activeStyle : disActiveStyle  "
                    >
                      {{sal.text}}
                    </div>
                  </div>
                  <div class="select" style="clear: both;">
                    <div class="titleVal">经验要求</div>
                    <div
                      class="selectList"
                      :style="exStyle ? disActiveStyle : activeStyle"
                      @click="onExActive"
                    >
                      不限
                    </div>
                    <div class="selectList"
                         v-for="(ex, exIndex) in exData"
                         :key="exIndex"
                         :style="ex.checked ? activeStyle : disActiveStyle"
                         @click="exClick(exIndex)"
                    >
                      {{ex.text}}
                    </div>
                  </div>
                </div>
                <footer>
                  <div id="left">
                    <van-button type="warning" plain @click="onTotalClear">清空</van-button>
                  </div>
                  <div id="right">
                    <van-button type="primary" size="large" @click="onTotalConfirm">确定</van-button>
                  </div>
                </footer>
              </van-popup>
            </div>
          </template>
        </van-tabs>
      </div>
    </header>
    <div id="container" style="margin:90px 0 50px 0;text-align: center;">
      <van-pull-refresh
        v-model="refreshing"
        :disabled="change"
        @refresh="onRefresh({job})"
      >
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad({job: user.job})"
        >
          <div v-for="(item, index) in list" v-if="item.postLists" :key="index" style="text-align: left">
            <div class="postList" v-for="(i, postIndex) in item.postLists" :key="postIndex" v-if="i.status === 1 || 2">
              <div style="cursor: pointer" @click="onDetail(i)">
                <div class="listHeader">
                  <div class="listTitle van-ellipsis">{{i.postName}}</div>
                  <div class="listValue">{{i.salary}}</div>
                </div>
                <div class="listContext">
                  <van-tag type="primary" style="margin-right: 5px;">{{i.experience}}</van-tag>
                  <van-tag type="success" style="margin-right: 5px;">{{i.education}}</van-tag>
                  <van-tag color="#111">{{i.post}}</van-tag>
                </div>
                <div class="van-ellipsis" style="margin-top: 5px;font-size: 12px;">{{item.company}}</div>
                <div class="listFooter">
                  <div class="lfl">
                    <van-image
                      width="20"
                      height="20"
                      alt="300*300"
                      round
                      :src="'http://localhost:4000/images/'+ item.header"
                    />
                    <div class="van-ellipsis" style="font-size: 12px;margin-left: 2px;">{{item.name + '·' + item.job}}</div>
                  </div>
                  <div class="lfr van-ellipsis">{{i.city}}</div>
                </div>
              </div>
              <van-popup
                v-model = "i.checked"
                position="bottom"
                :style="{ height: '100%' , width: '100%'}"
              >
                <van-nav-bar
                  left-arrow
                  fixed
                  title="职位详情"
                  @click-left="onOut(i)"
                />
                <div class="detailList" style="margin: 46px 0 50px 0;padding: 10px;">
                  <div class="header" style="border-bottom: 1px solid #eee;padding: 0 16px 5px 16px;">
                    <div style="display: flex;flex-direction: row;">
                      <div style="width: 60%;font-size: 18px;font-weight: bold;">{{i.postName}}</div>
                      <div style="width: 40%;color: #22c47c;text-align: right;font-size: 14px;">{{i.salary}}</div>
                    </div>
                    <div style="display: flex;flex-direction: row;font-size: 12px;margin-top: 8px;">
                      <div style="width: 40%;display: flex;flex-direction: row;">
                        <van-icon name="location-o" />
                        <div style="margin-top: -2px;">{{i.city}}</div>
                      </div>
                      <div style="width: 30%;display: flex;flex-direction: row;">
                        <van-icon name="medal-o" />
                        <div style="margin-top: -2px;">{{i.experience}}</div>
                      </div>
                      <div style="width: 30%;display: flex;flex-direction: row;">
                        <van-icon name="flag-o" />
                        <div style="margin-top: -2px;">{{i.education}}</div>
                      </div>
                    </div>
                  </div>
                  <div class="boss">
                    <van-image
                      width="40"
                      height="40"
                      alt="300*300"
                      round
                      :src="'http://localhost:4000/images/'+ item.header"
                    />
                    <div style="font-size: 13px;margin-left: 10px;">
                      <div style="color: #111;margin-bottom: 3px;">{{item.name}}</div>
                      <div>{{item.company + '·' + item.job}}</div>
                    </div>
                  </div>
                  <div class="content" style="padding: 10px 16px;border-bottom: 1px solid #eee;">
                    <div style="font-size: 14px;font-weight: bold;">职位详情</div>
                    <div style="padding: 10px 0">
                      <van-tag type="success">{{i.post}}</van-tag>
                    </div>
                    <div style="font-size: 12px;padding-top: 10px"> 岗位职责:</div>
                    <div
                      v-html="i.duty.replace(/\n/g, '<br/>')"
                      style="font-size: 12px;word-break: break-all; overflow:hidden;"
                    >
                    </div>
                    <div style="font-size: 12px;padding-top: 10px">任职要求:</div>
                    <div
                      v-html="i.requirement.replace(/\n/g, '<br/>')"
                      style="font-size: 12px;padding-bottom: 10px;word-break: break-all; overflow:hidden;">
                    </div>
                  </div>
                  <div class="addr"  v-if="codeObj !== ''" style="padding: 10px 16px;border-bottom: 1px solid #eee;">
                    <baidu-map
                      class="map"
                      :scroll-wheel-zoom="true"
                      :center="centerCode"
                      :zoom="zoom"
                    >
                      <bm-marker
                        :position="codeObj"
                        :zIndex="99"
                        :icon="{ url: markerIcon, size: { width: 25, height: 25 } }"
                        @click="isShowInfo = true"
                        style="margin-top: 10px"
                      >
                        <bm-info-window
                          :show="isShowInfo"
                          :close-on-click="false"
                          title="工作地点"
                          style="font-size: 12px;text-align: center;"
                        >
                          <div> {{i.addr}}</div>
                        </bm-info-window>
                      </bm-marker>
                      <bm-view style="width: 100%; height:100%; flex: 1"></bm-view>
                    </baidu-map>
                  </div>
                  <div v-if="userList">
                    <div v-for="(user, userIndex) in userList" :key="userIndex" v-if="user._id === item._id">
                      <div style="font-size: 14px;font-weight: bold;padding: 10px 16px;">在招相关职位</div>
                      <div v-for="(userPost, upInd) in user.postLists" :key="upInd">
                        <van-cell
                          :title="userPost.postName"
                          :label="userPost.experience + '·' + userPost.education + '·' + userPost.post"
                          :value="userPost.salary"
                          title-class="van-ellipsis"
                          label-class="van-ellipsis"
                          value-class="sal"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="footer" style="position: fixed; bottom: 0;width: 100%;z-index: 10;">
                    <van-button
                      type="primary"
                      size="large"
                      style="margin-left: -10px;"
                      @click="onClickPost(item)"
                    >
                      立即沟通
                    </van-button>
                  </div>
                </div>
              </van-popup>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import {mapState} from 'vuex'

import cityData from 'china-city-data'
import {parseStringToStar} from '../../utils'
import BaiduMap from 'vue-baidu-map'
import {
  NavBar,
  Button,
  Cascader,
  Icon,
  IndexAnchor,
  IndexBar,
  Picker,
  Popup,
  PullRefresh,
  Search,
  Tab,
  Tabs,
  Tag,
  Image,
  Toast,
} from 'vant';

Vue.use(NavBar)
Vue.use(Button)
Vue.use(Search)
Vue.use(PullRefresh)
Vue.use(Tab)
Vue.use(Tabs)
Vue.use(Icon)
Vue.use(Tag)
Vue.use(Popup)
Vue.use(Picker)
Vue.use(IndexBar)
Vue.use(IndexAnchor)
Vue.use(Cascader)
Vue.use(Image)
Vue.use(Toast)

Vue.use(BaiduMap, {
  ak: '4ThO4IcKPiBjSMmaPglaaahdlUG2yGUV'
})

export default {
  name: "ApplicantIndex",
  data(){
    return {
      change: false,
      post: '选择职位',
      postShow: false,
      cascaderValue: '',
      fieldNames: {
        text: 'name',
        value: 'id',
        children: 'trade_list',
      },
      options: [],
      searchInput: '',
      list: [],
      loading: false,
      finished: false,
      refreshing: false,
      active: '',
      cityName: '城市',
      cityShow: false,
      cityData,
      hot: ['北京', '上海', '广州', '深圳','成都'],
      words: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'W', 'X', 'Y', 'Z'],
      popupShow: false,
      suburbList: [],
      selectVal: '筛选',
      selectShow: false,
      educationData: [
        {text: '初中及以下', checked: false},
        {text: '中专/中技', checked: false},
        {text: '高中', checked: false},
        {text: '大专', checked: false},
        {text: '本科', checked: false},
        {text: '硕士', checked: false},
        {text: '博士', checked: false},
      ],
      salaryData: [
        {text: '3K以下', checked: false},
        {text: '3K-5K', checked: false},
        {text: '5K-10K', checked: false},
        {text: '10K-20K', checked: false},
        {text: '20K-50K', checked: false},
        {text: '50K以上', checked: false}
      ],
      exData: [
        {text: '在校生', checked: false},
        {text: '应届生', checked: false},
        {text: '1年以内', checked: false},
        {text: '1-3年', checked: false},
        {text: '3-5年', checked: false},
        {text: '5-10年', checked: false},
        {text: '10年以上', checked: false}
      ],
      eduNum: 0,
      salaryNum: 0,
      exNum: 0,
      eduStyle: false,
      salStyle: false,
      exStyle: false,
      activeStyle: 'color: #22c47c;border:1px solid #22c47c;',
      disActiveStyle: 'color: #2c3e50;border: 1px solid #fff; ',
      totalSelect: [{eduArr: [], sum: ''}, {salArr: [], sum: ''}, {exArr: [], sum: ''}],
      job:'',
      city:'',
      area: '',
      eduItems: [],
      salItems: '',
      exItems: [],
      timer: '',
      centerCode: {},
      codeObj: {},
      zoom: 100,
      markerIcon: require('../../assets/img/bz.png'),
      isShowInfo: true
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
      this.cityName = '城市'
      this.city = ''
      this.area = ''
      this.salItems = ''
      this.eduItems.splice(0, this.eduItems.length)
      this.exItems.splice(0, this.exItems.length)
      this.list.splice(0, this.list.length)
      this.onTotalClear()
      this.onRefresh({job: this.post})
    },
    // （推荐，最新标签的切换）
    newPost(){
      clearTimeout(this.timer) // 清除定时器
      this.cityName = '城市'
      this.city = ''
      this.area = ''
      this.salItems = ''
      this.eduItems.splice(0, this.eduItems.length)
      this.exItems.splice(0, this.exItems.length)
      this.list.splice(0, this.list.length)
      this.onTotalClear()
      if (this.job !== ''){
        this.onRefresh({job: this.job})
      }else {
        this.onRefresh({job: this.user.job})
      }
    },
    // 职位数据加载（包括过滤选项）
    onLoad({job}) {
      this.job = job
      //发送异步请求
      this.$store.dispatch('getBossPost', {postName: job ? job : 'Python'})
      this.timer =  setTimeout(() => {
        if (this.refreshing) {
          this.list.splice(0, this.list.length)
          this.refreshing = false;
        }
        // 职位列表初始化添加
        for (let i = 0; i < this.userList.length; i++) {
          this.list.push(this.userList[i]);
          /*
          js数组循环删除，数组下标已经发生改变的解决方法（逆向删除）
          */
          // list列表有可能为空
          if (this.list.length !== 0){
            // 过滤筛选城市列表
            if (this.city){
              this.list.forEach((listVal_1, listInd_1) => {
                for (let cityInd = listVal_1.postLists.length-1; cityInd >= 0; cityInd--){
                  let arr = listVal_1.postLists[cityInd].city.split('·')
                  if (arr[0] !== this.city + '市' && this.city){
                    this.list[listInd_1].postLists.splice(cityInd, 1)
                  }
                }
                // 当职位信息为空时（筛选完成时），清空对应列表数据(即清除boss的信息)
                if (this.list[listInd_1].postLists.length === 0){
                  this.list.splice(listInd_1, 1)
                }
              })
            }

            // 过滤筛选城市【区级】列表
            if (this.area ){
              this.list.forEach((listVal_2, listInd_2) => {
                for (let areaInd = listVal_2.postLists.length-1; areaInd >= 0; areaInd--){
                  let arr = listVal_2.postLists[areaInd].city.split('·')
                  if (arr[1] !== this.area && this.area){
                    this.list[listInd_2].postLists.splice(areaInd, 1)
                  }
                }
                // 当职位信息为空时（筛选完成时），清空对应列表数据(即清除boss的信息)
                if (this.list[listInd_2].postLists.length === 0){
                  this.list.splice(listInd_2, 1)
                }
              })
            }


            // 过滤筛选(学历要求)
            if (this.eduItems.length > 0){
              let arr = []
              this.list.forEach((listVal_3, listInd_3) => {
                if (this.list[listInd_3].length !== 0){
                  for (let eduInd = listVal_3.postLists.length-1; eduInd >= 0; eduInd--){
                    this.eduItems.forEach(value => {
                      if (listVal_3.postLists[eduInd].education === value){
                        arr.push(listVal_3.postLists[eduInd])
                      }
                    })
                  }
                  if (arr.length > 0 ){
                    this.list[listInd_3].postLists.splice(0, this.list[listInd_3].postLists.length)
                    arr.forEach(value => this.list[listInd_3].postLists.push(value))
                  }else {
                    this.list.splice(listInd_3, 1)
                  }
                }
              })
            }

            // 过滤筛选(薪资条件)
            if(this.salItems){
              this.list.forEach((listVal_4, listInd_4) => {
                for (let salInd = listVal_4.postLists.length-1; salInd >= 0; salInd--){
                  const arr = listVal_4.postLists[salInd].salary.split('-');
                  const sal = this.salItems.split('-');
                  let arr_1, arr_2
                  if (arr[0] === '面试'){
                    arr_1 = 0
                    arr_2 = 0
                  }else {
                    arr_1 = parseInt(arr[0].replace(/[^0-9]/ig,""))
                    arr_2 = parseInt(arr[1].replace(/[^0-9]/ig,""))
                  }
                  const sal_1 = parseInt(sal[0].replace(/[^0-9]/ig,""))
                  if (sal.length > 1){
                    const sal_2 = parseInt(sal[1].replace(/[^0-9]/ig,""))
                    if (!(arr_1 >= sal_1 && arr_2 <= sal_2)){
                      this.list[listInd_4].postLists.splice(salInd, 1)
                    }
                  }else if (sal_1 === 3){
                    if (!(arr_2 < sal_1)){
                      this.list[listInd_4].postLists.splice(salInd, 1)
                    }
                  }else {
                    if (!(arr_2 > sal_1)){
                      this.list[listInd_4].postLists.splice(salInd, 1)
                    }
                  }
                }
                // 当职位信息为空时（筛选完成时），清空对应列表数据(即清除boss的信息)
                if (this.list[listInd_4].postLists.length === 0){
                  this.list.splice(listInd_4, 1)
                }
              })
            }

            // 过滤筛选（经验要求）
            if (this.exItems.length > 0){
              let arr = []
              this.list.forEach((listVal_5, listInd_5) => {
                if (this.list[listInd_5].length !== 0){
                  for (let exInd = listVal_5.postLists.length-1; exInd >= 0; exInd--){
                    this.exItems.forEach(value => {
                      if (listVal_5.postLists[exInd].experience === value){
                        arr.push(listVal_5.postLists[exInd])
                      }
                    })
                  }
                  if (arr.length > 0 ){
                    this.list[listInd_5].postLists.splice(0, this.list[listInd_5].postLists.length)
                    arr.forEach(value => this.list[listInd_5].postLists.push(value))
                  }else {
                    this.list.splice(listInd_5, 1)
                  }
                }
              })
            }

            this.list.forEach((val, ind) => {
              this.list[ind].postLists.forEach(value => {
                this.$set(value, 'checked', false)  // vue官方推荐写法（数组对象添加新属性）
              })
            })

          }
        }

        this.loading = false;

        if (this.list.length >= 0) {
          this.finished = true;
        }
      }, 1000);
    },
    onRefresh({job}) {
      // 清空列表数据
      this.finished = false;

      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true;
      this.onLoad({job});
    },
    onClickRight(){
      this.cityShow = false
      this.popupShow = true
    },
    // 城市获取点击事件
    cityDetail(value){
      this.cityName = parseStringToStar(value, 5)
      this.cityShow = false
      this.list = []
      this.city = value
      this.area = ''
      this.onRefresh({job: this.job})
    },
    // 市区获取点击事件
    suburbDetail(value){
      this.cityName = parseStringToStar(value[2], 5)
      this.popupShow = false
      this.list.splice(0, this.list.length)
      this.area = value[2]
      this.city = ''
      this.onRefresh({job: this.job})
    },
    // 学历要求【不限】按钮改变点击事件
    onEduActive(){
      this.eduStyle = false
      this.educationData.forEach(val => val.checked = false)
      this.eduNum = 0
    },
    // 学历要求点击事件
    eduClick(eduIndex){
      this.educationData[eduIndex].checked = !this.educationData[eduIndex].checked // 取反
      if (this.educationData[eduIndex].checked){
        this.eduNum += 1
      }else {
        this.eduNum -= 1
      }
      this.eduStyle = this.eduNum !== 0;
    },
    // 薪资待遇【不限】按钮改变点击事件
    onSalActive(){
      this.salStyle = false
      this.salaryData.forEach(value => value.checked = false)
      this.salaryNum = 0
    },
    // 薪资待遇点击事件
    salClick(salIndex){
      this.salaryData.forEach((value, index) => {
        if (index === salIndex){
          value.checked = !value.checked
          if (value.checked) {
            this.salStyle = true
            this.salaryNum = 1
          }else {
            this.salStyle = false
            this.salaryNum = 0
          }
        }else {
          value.checked = false
        }
      })
    },
    // 经验要求【不限】按钮改变点击事件
    onExActive(){
      this.exStyle = false
      this.exData.forEach(value => value.checked = false)
      this.exNum = 0
    },
    // 经验要求点击事件
    exClick(exIndex){
      this.exData[exIndex].checked = !this.exData[exIndex].checked // 取反
      if (this.exData[exIndex].checked){
        this.exNum += 1
      }else {
        this.exNum -= 1
      }
      this.exStyle = this.exNum !== 0;
    },
    // 筛选条件清零操作
    onTotalClear(){
      this.onEduActive()
      this.onSalActive()
      this.onExActive()
    },
    // 图标x退出点击事件
    onClickOut(){
      this.selectShow = false
      this.totalSelect[0].eduArr.forEach((value, index) => {
        this.educationData.splice(index, 1, {text: value.text, checked: value.checked})
      })
      this.eduNum = this.totalSelect[0].sum
      this.eduNum === 0 ? this.eduStyle = false : this.eduStyle = true
      this.totalSelect[1].salArr.forEach((value, index) => {
        this.salaryData.splice(index, 1, {text: value.text, checked: value.checked})
      })
      this.salaryNum = this.totalSelect[1].sum
      this.salaryNum === 0 ? this.salStyle = false : this.salStyle = true
      this.totalSelect[2].exArr.forEach((value, index) => {
        this.exData.splice(index, 1, {text: value.text, checked: value.checked})
      })
      this.exNum = this.totalSelect[2].sum
      this.exNum === 0 ? this.exStyle = false : this.exStyle = true
    },
    // 确定所选按钮事件
    onTotalConfirm(){
      this.selectShow = false
      this.educationData.forEach((value, index) => {
        this.totalSelect[0].eduArr.splice(index, 1, {text: value.text, checked: value.checked})
      })
      this.totalSelect[0].sum = this.eduNum
      this.salaryData.forEach((value, index) => {
        this.totalSelect[1].salArr.splice(index, 1, {text: value.text, checked: value.checked})
      })
      this.totalSelect[1].sum = this.salaryNum
      this.exData.forEach((value, index) => {
        this.totalSelect[2].exArr.splice(index, 1, {text: value.text, checked: value.checked})
      })
      this.totalSelect[2].sum = this.exNum

      this.list.splice(0, this.list.length)
      this.eduItems.splice(0, this.eduItems.length)
      this.salItems = ''
      this.exItems.splice(0, this.exItems.length)
      this.totalSelect[0].eduArr.forEach(value => {
        if (value.checked){
          this.eduItems.push(value.text)
        }
      })
      this.totalSelect[1].salArr.forEach(value => {
        if (value.checked){
          this.salItems = value.text
        }
      })
      this.totalSelect[2].exArr.forEach(value => {
        if(value.checked){
          this.exItems.push(value.text)
        }
      })
      this.onRefresh({job: this.job})
    },
    onOut(i){
      i.checked = false
      this.change = false
    },
    onDetail(i){
      i.checked = true
      this.change = true
      if (i.addr) {
        // 获取百度地图接口逆地理编码
        this.$store.dispatch('getAddrCode', {address: i.addr}).then(res => {
          if (res.data.code === 0){
            const {result} = res.data.data
            this.codeObj = result.location
            const {lat, lng} = result.location
            this.centerCode = {lat: lat + 0.0002, lng: lng + 0.0001}
          }
        })
      }
    },
    // 跳转到聊天页面
    onClickPost(item){
      this.$router.push({
        path: `/chat/${item._id}`,
        query: {
          company: item.company,
          name: item.name,
          job: item.job,
        },
      })
    }
  },
  created() {
    //获取省市区三级联动数据处理
    this.$store.dispatch('getCityList').then(res => {
      const result = res.data
      for (let i = 0; i < result.length; i++){
        this.suburbList.push({
          text: result[i].name,
          children: []
        })
        for (let j = 0; j < result[i].children.length; j++){
          this.suburbList[i].children.push({
            text: result[i].children[j].name,
            children: []
          })
          for (let k = 0; k < result[i].children[j].children.length; k++){
            this.suburbList[i].children[j].children.push({
              text: result[i].children[j].children[k].name
            })
          }
        }
      }
    })
    // 获取筛选条件前各选项的状态（类似数据库存储）
    this.educationData.forEach(value => {
      this.totalSelect[0].eduArr.push({text: value.text,checked: value.checked})
    })
    this.salaryData.forEach(value => {
      this.totalSelect[1].salArr.push({text: value.text,checked: value.checked})
    })
    this.exData.forEach(value => {
      this.totalSelect[2].exArr.push({text: value.text,checked: value.checked})
    })
    this.totalSelect[0].sum = this.eduNum
    this.totalSelect[1].sum = this.salaryNum
    this.totalSelect[2].sum = this.eduNum

  },
  mounted() {
    if (!this.$store.state.user.header){
      this.$router.replace('/info')
    }
  }
}
</script>

<style scoped>
.titleVal{
  margin-left: 8px;
  font-weight: bold;
  padding-top: 10px;
}
.show{
  line-height: 12px;
  position: relative;
  margin-left: 15px;
  bottom: 10px;
  top: 10px;
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
.select{
  line-height: 20px;
  position: relative;
  margin-left: 15px;
  bottom: 10px;
  top: 10px;
}
.selectList{
  width: 4.5rem;
  height: 1.3rem;
  font-size: 12px;
  padding: 5px;
  margin: 5px 8px;
  float: left;
  background-color: #f3f3f3;
  text-align: center;
  border: 1px solid #fff;
  cursor: pointer;
}
footer{
  position: fixed;
  bottom: 0;
  width: 100%;
  display: flex;
  flex-direction: row;
  background-color: #fff;
  padding: 5px 0;
  border-top: 1px solid #eee;
}
#left{
  width: 40%;
  text-align: center;
}
#right{
  width: 60%;
  margin-right: 20px;
}
.postList{
  padding: 8px 12px;
  border-bottom: 8px solid #eee;
}
.listHeader{
  display: flex;
  flex-direction: row;
}
.listTitle{
  width: 70%;
  font-weight: bold;
  font-size: 18px;
  padding-bottom: 5px;
}
.listValue {
  width: 30%;
  font-size: 14px;
  text-align: right;
  color: #22c47c;
}
.listFooter{
  display: flex;
  flex-direction: row;
}
.lfl{
  width: 60%;
  display: flex;
  flex-direction: row;
  margin-top: 5px;
}
.lfr{
  width: 40%;
  font-size: 12px;
  color: #969799;
  text-align: right;
  margin-top: 5px;
}
.boss{
  padding: 10px 16px;
  border-bottom: 1px solid #eee;
  display: flex;
  flex-direction: row;
}
.sal{
  color: #22c47c;
}
.map {
  width: 100%;
  height: 150px;
}
</style>
