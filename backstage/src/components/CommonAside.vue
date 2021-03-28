<template>
  <el-menu
    :collapse="isCollapse"
    :default-active="default_active"
    class="el-menu-vertical-demo"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
  >
    <el-menu-item
      v-for="(item, index) in menu"
      :key="index"
      :index="index + ''"
      @click="clickMenu(item)"
    >
      <i :class="item.icon"></i>
      <span slot="title">{{ item.label }}</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      default_active: '0'
    }
  },
  computed: {
    ...mapState({
      isCollapse: state => state.tab.isCollapse,
      menu: state => state.tab.menu
    })
  },
  methods: {
    clickMenu(item) {
      if (this.$route.path !== item.path) {
        this.$router.push({ name: item.name })
        this.$store.commit('selectMenu', item)
      }
    }
  },
  mounted() {
    const path = this.$route.path
    const menu = this.menu
    menu.forEach((item, index) => {
      if (item.path === path) this.default_active = index.toString()
    })
  }
}
</script>

<style lang="scss" scoped>
.el-menu {
  height: 100%;
  border: none;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
</style>
