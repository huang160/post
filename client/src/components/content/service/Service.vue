<template>
  <div id="service" style="text-align: left;">
    <van-nav-bar
      title="客服MM"
      left-arrow
      @click-left="onClickLeft"
      fixed
    />
    <van-cell
      style="margin-top: 46px;color: #22c47c"
      title-style="font-size: 12px;font-weight: bold;color: #000"
      title="猜你想问"
      icon="question"
    />
    <van-collapse v-model="activeName" accordion>
      <van-collapse-item title="如何找工作" name="如何找工作">在【我的->管理求职意向】完善您的求职意向后可主动联系Boss哦。</van-collapse-item>
      <van-collapse-item title="如何删除聊天记录" name="如何删除聊天记录">暂不支持此功能</van-collapse-item>
      <van-collapse-item title="防骗指南" name="防骗指南">请留意非正常邀约的短信/邮箱（如：无公司名，公司主体指向不明确，微信，qq私聊等）</van-collapse-item>
      <van-collapse-item title="其它问题" name="其它问题">
        <h5 style="text-align: center">
          <div>合作咨询热线：400-065-5799</div>
          <div>人工服务： 10086</div>
        </h5>
      </van-collapse-item>
    </van-collapse>
  </div>
</template>

<script>
import Vue from 'vue';
import { NavBar, Cell, Collapse, CollapseItem } from 'vant';

Vue.use(NavBar)
Vue.use(Cell)
Vue.use(Collapse);
Vue.use(CollapseItem);

export default {
  name: "Service",
  data() {
    return {
      activeName: ['如何找工作', '如何删除聊天记录', '防骗指南', '其它问题'],
    };
  },
  methods: {
    onClickLeft() {
      this.$router.replace('/profile')
    }
  }
}
</script>

<style scoped>

</style>
