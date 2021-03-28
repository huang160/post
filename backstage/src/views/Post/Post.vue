<template>
  <div class="manage">
    <div class="manage-header">
      <common-form inline :form-label="formLabel" :form="searchForm">
        <el-button type="primary" @click="getPost">搜索</el-button>
      </common-form>
      <el-dialog title="详情" :visible.sync="dialogVisible" width="40%">
        <span v-html="content.replace(/\n/g, '<br/>')"></span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogVisible = false">
            确 定
          </el-button>
        </span>
      </el-dialog>
    </div>
    <common-table
      :tableData="tableData"
      :tableLabel="tableLabel"
      :config="config"
      @success="updatePost"
      @fail="updatePost"
      @detail="detailMsg"
    />
  </div>
</template>

<script>
import CommonForm from '../../components/CommonForm'
import CommonTable from '../../components/CommonTable'
import { postMsg, postUpdate } from '../../network/admin'

export default {
  data() {
    return {
      isShow: false,
      tableData: [],
      tableLabel: [
        {
          prop: 'name',
          label: 'Boss',
          width: 100
        },
        {
          prop: 'postName',
          label: '职位名称',
          width: 150
        },
        {
          prop: 'post',
          label: '职位类型',
          width: 150
        },
        {
          prop: 'education',
          label: '学历要求',
          width: 120
        },
        {
          prop: 'experience',
          label: '经验要求',
          width: 120
        },
        {
          prop: 'salary',
          label: '薪资',
          width: 120
        },
        {
          prop: 'duty',
          label: '岗位职责',
          width: 150
        },
        {
          prop: 'requirement',
          label: '岗位要求',
          width: 150
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
      ],
      dialogVisible: false,
      content: ''
    }
  },
  components: {
    CommonForm,
    CommonTable
  },
  methods: {
    updatePost(ide) {
      const { _id, msg } = ide
      let message, status, remark
      if (msg === '成功') {
        message = '此操作将使职位通过审核, 是否继续?'
        status = 1
        remark = '审核通过'
      } else {
        message = '此操作将使Boss用户重新上传职位信息, 是否继续?'
        status = 0
        remark = '审核失败'
      }
      this.$confirm(message, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          postUpdate({ _id, status, remark }).then(res => {
            const result = res.data
            if (result.code === 0) {
              this.$message({
                showClose: true,
                type: 'success',
                message: result.msg
              })
              this.getPost()
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
    detailMsg(row) {
      this.dialogVisible = true
      this.content = row
    },
    getPost() {
      this.config.loading = true
      postMsg(this.config.page, this.searchForm.keyword).then(res => {
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
    this.getPost()
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/common';
</style>
