<template>
  <div class="manage">
    <div class="manage-header">
      <common-form inline :form-label="formLabel" :form="searchForm">
        <el-button type="primary" @click="getIde">搜索</el-button>
      </common-form>
    </div>
    <common-table
      :tableData="tableData"
      :tableLabel="tableLabel"
      :config="config"
      @success="updateIde"
      @fail="updateIde"
    />
  </div>
</template>

<script>
import CommonForm from '../../components/CommonForm'
import CommonTable from '../../components/CommonTable'
import { ideMsg, ideUpdate } from '../../network/admin'

export default {
  data() {
    return {
      isShow: false,
      tableData: [],
      tableLabel: [
        {
          prop: 'name',
          label: '姓名'
        },
        {
          prop: 'cons',
          label: '正面',
          width: 200
        },
        {
          prop: 'pros',
          label: '反面',
          width: 200
        }
      ],
      config: {
        page: 1,
        total: 30,
        loading: false
      },
      searchForm: {
        keyword: ''
      },
      formLabel: [
        {
          model: 'keyword',
          label: ''
        }
      ]
    }
  },
  components: {
    CommonForm,
    CommonTable
  },
  methods: {
    updateIde(ide) {
      const { _id, msg } = ide
      let message, status, remark
      if (msg === '成功') {
        message = '此操作将使Boss用户通过实名认证, 是否继续?'
        status = 1
        remark = '认证成功'
      } else {
        message = '此操作将使Boss用户重新上传认证资料, 是否继续?'
        status = 0
        remark = '认证失败'
      }
      this.$confirm(message, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          ideUpdate({ _id, status, remark }).then(res => {
            const result = res.data
            if (result.code === 0) {
              this.$message({
                showClose: true,
                type: 'success',
                message: result.msg
              })
              this.getIde()
            } else {
              this.$message({
                showClose: true,
                type: 'error',
                message: result.msg
              })
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消此次操作'
          })
        })
    },
    getIde() {
      this.config.loading = true
      ideMsg(this.config.page, this.searchForm.keyword).then(res => {
        const result = res.data
        if (result.code === 0) {
          this.tableData = result.data
          this.config.total = result.count
          this.config.loading = false
        }
      })
    }
  },
  created() {
    this.getIde()
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/common';
</style>
