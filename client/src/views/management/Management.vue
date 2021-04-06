<template>
  <div id="management" v-if="identity.status === 1" style="text-align: left">
    <van-nav-bar
      title="职位管理"
      left-arrow
      fixed
      @click-left="$router.back()"
    >
      <template #right>
        <van-icon name="add-o" size="20" @click="$router.push('/release')"/>
      </template>
    </van-nav-bar>
    <div id="container" style="margin-top: 46px">
      <van-notice-bar
        left-icon="info-o"
        text="审核中请勿多次提交修改！只有审核通过的职位才会被牛人看到..."
      />
      <van-empty v-if="postList.length < 1" image="search" description="暂无可管理的职位，快去发布吧！" />
      <div
        v-else
        class="postList"
        v-for="(item, index) in postList"
        :key="index"
        :style="item.status === 3 || item.status === 0? 'opacity: 0.5' : ''"
      >
        <van-skeleton title :row="3" :loading="!postList" style="margin-top: 20px">
          <van-cell
            :label="`${item.experience}·${item.education}·${item.post}`"
            :value="item.salary"
            value-class="rightText"
            label-class="van-ellipsis"
            @click="toUpdate(item._id)"
          >
            <template #title>
              <span class="van-ellipsis"> {{item.postName}}</span>
              <van-tag
                v-if="item.status !== 3"
                :type="item.status === 2 ? 'warning' : item.status === 1 ? 'primary' : 'danger'"
                plain
              >
                {{item.remark}}
              </van-tag>
              <van-tag v-else color="#967996" plain> {{item.remark}}</van-tag>
            </template>
          </van-cell>
          <div style="border: 3px solid #eee"></div>
        </van-skeleton>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import {mapState} from 'vuex'
import {NavBar, Icon, NoticeBar, Cell, Tag, Empty, Skeleton} from 'vant'

Vue.use(NavBar)
Vue.use(Icon)
Vue.use(NoticeBar)
Vue.use(Cell)
Vue.use(Tag)
Vue.use(Empty)
Vue.use(Skeleton)

export default {
  name: "Management",
  data() {
    return {
      postName: '',
      salary: '',
      experience: '',
      education: '',
      post: '',
      loading: true
    }
  },
  computed: {
    ...mapState(['postList', 'identity']),
  },
  methods: {
    // 获取对应的职位列表_id
    toUpdate(_id) {
      this.$router.push({path: '/release', query: {_id}})
    }
  }
}
</script>

<style scoped>
.rightText{
  color: #22c47c;
  width: 20%;
}
.van-cell{
  cursor: pointer;
}
</style>
