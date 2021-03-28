<template>
  <div class="common-table">
    <el-table :data="tableData" height="90%" stripe v-loading="config.loading">
      <el-table-column label="序号" width="85" fixed>
        <template slot-scope="scope">
          <span style="margin-left: 10px">
            {{ (config.page - 1) * 20 + scope.$index }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        v-for="item in tableLabel"
        :key="item.prop"
        :label="item.label"
        :width="item.width ? item.width : 125"
      >
        <template slot-scope="scope">
          <span v-if="item.label === '正面' || item.label === '反面'">
            <el-image
              style="width: 120px; height: 50px"
              :src="imgHeader + scope.row[item.prop]"
              :preview-src-list="[imgHeader + scope.row[item.prop]]"
            />
          </span>
          <span
            v-else-if="item.label === '岗位职责' || item.label === '岗位要求'"
          >
            <el-button
              size="mini"
              type="text"
              @click="handleDetail(scope.row[item.prop])"
            >
              查看详情
            </el-button>
          </span>
          <span v-else>
            {{ scope.row[item.prop] }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" v-if="pathname === 'user'">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleEdit(scope.row)">
            编辑
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="220"
        v-if="pathname === 'identity' || pathname === 'post'"
        :fixed="pathname === 'post' ? 'right' : false"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="success"
            @click="handleSuccess(scope.row)"
          >
            认证成功
          </el-button>
          <el-button size="mini" type="danger" @click="handleFail(scope.row)">
            认证失败
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pager"
      layout="prev, pager, next"
      :total="config.total"
      :current-page.sync="config.page"
      @current-change="changePage"
    />
  </div>
</template>

<script>
export default {
  name: 'CommonTable',
  props: {
    tableData: Array,
    tableLabel: Array,
    config: Object
  },
  data() {
    return {
      imgHeader: 'http://localhost:4000/identityImgs/',
      pathname: '',
      visible: false
    }
  },
  methods: {
    handleEdit(row) {
      this.$emit('edit', row)
    },
    handleDelete(row) {
      this.$emit('del', row)
    },
    handleSuccess(row) {
      this.$emit('success', Object.assign(row, { msg: '成功' }))
    },
    handleFail(row) {
      this.$emit('fail', Object.assign(row, { msg: '失败' }))
    },
    handleDetail(row) {
      this.$emit('detail', row)
    },
    changePage(page) {
      this.$emit('changePage', page)
    }
  },
  mounted() {
    this.pathname = this.$route.name
  }
}
</script>

<style lang="scss" scoped>
.common-table {
  height: calc(100% - 62px);
  background-color: #fff;
  position: relative;
  .pager {
    position: absolute;
    bottom: 0;
    right: 20px;
  }
}
</style>
