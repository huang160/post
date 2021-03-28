<template>
  <van-empty image="error" description="抱歉，找不到此页面！" />
</template>

<script>
import Vue from 'vue'
import {Empty} from 'vant'

Vue.use(Empty)

export default {
  name: "NotFound"
}
</script>

<style scoped>

</style>
