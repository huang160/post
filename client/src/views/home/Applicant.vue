<template>
  <div id="home">
    <router-view name="applicantIndex"/>
    <router-view name="applicantMessage"/>
    <router-view name="applicantProfile"/>
    <van-tabbar
      route
      active-color="#22c47c"
      inactive-color="#000"
      v-model="active"
    >
      <van-tabbar-item replace to="/index" icon="search">
        <span>职位</span>
        <template #icon="props">
          <img :src="props.active ? icon.active : icon.inactive"/>
        </template>
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
import {mapState} from "vuex";
import { Tabbar, TabbarItem } from 'vant';

Vue.use(Tabbar);
Vue.use(TabbarItem);

export default {
  name: "Applicant",
  computed: {
    ...mapState(['chat'])
  },
  data() {
    return {
      active: 0,
      icon: {
        active: require('../../assets/img/active.png'),
        inactive: require('../../assets/img/inactive.png')
      }
    }
  },

}
</script>

<style scoped>

</style>
