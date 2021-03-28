<template>
  <div id="home">
    <router-view name="bossIndex"/>
    <router-view name="bossMessage"/>
    <router-view name="bossProfile"/>
    <van-tabbar
      v-model="active"
      route
      active-color="#22c47c"
      inactive-color="#000"
    >
      <van-tabbar-item replace to="/index" icon="friends-o">
        牛人
      </van-tabbar-item>
      <van-tabbar-item
        :badge="chat.unReadCount === 0 ? '' : chat.unReadCount"
        replace
        to="/message"
        icon="chat-o"
      >
        <span>消息</span>
      </van-tabbar-item>
      <van-tabbar-item
        replace
        to="/profile"
        icon="contact"
      >
        我的
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import Vue from 'vue';
import {mapState} from 'vuex'
import { Tabbar, TabbarItem } from 'vant';

Vue.use(Tabbar);
Vue.use(TabbarItem);

export default {
  name: "Boss",
  computed: {
    ...mapState(['chat'])
  },
  data() {
    return {
      active: 0,
    }
  },
}
</script>

<style scoped>

</style>
