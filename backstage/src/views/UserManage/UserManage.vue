<template>
  <div class="manage">
    <el-dialog
      :title="operateType === 'add' ? '新增用户' : '更新用户'"
      :visible.sync="isShow"
    >
      <common-form :form-label="operateFormLabel" :form="operateForm" />
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShow = false" style="width: 150px">
          取 消
        </el-button>
        <el-button
          type="primary"
          @click="operateType === 'add' ? confirmAdd() : confirmEdit()"
          style="width: 150px"
        >
          确 定
        </el-button>
      </div>
    </el-dialog>
    <div class="manage-header">
      <el-button type="primary" @click="addUser">
        + 新增
      </el-button>
      <common-form inline :form-label="formLabel" :form="searchForm">
        <el-button type="primary" @click="getAdmin">搜索</el-button>
      </common-form>
    </div>
    <common-table
      :tableData="tableData"
      :tableLabel="tableLabel"
      :config="config"
      @edit="editUser"
      @del="delUser"
    />
  </div>
</template>

<script>
import CommonForm from '../../components/CommonForm'
import CommonTable from '../../components/CommonTable'
import { register, admin, adminDel, update } from '../../network/admin'

export default {
  data() {
    return {
      operateType: 'add',
      isShow: false,
      tableData: [],
      tableLabel: [
        {
          prop: 'username',
          label: '姓名'
        },
        {
          prop: 'sex',
          label: '性别'
        },
        {
          prop: 'tel',
          label: '手机',
          width: 200
        },
        {
          prop: 'addr',
          label: '地址',
          width: 420
        }
      ],
      config: {
        page: 1,
        total: 30,
        loading: false
      },
      operateForm: {
        username: '',
        addr: '',
        sex: '',
        tel: ''
      },
      operateFormLabel: [
        {
          model: 'username',
          label: '姓名'
        },
        {
          model: 'sex',
          label: '性别',
          type: 'select',
          opts: [
            {
              label: '男',
              value: '男'
            },
            {
              label: '女',
              value: '女'
            }
          ]
        },
        {
          model: 'tel',
          label: '手机'
        },
        {
          model: 'addr',
          label: '地址'
        }
      ],
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
    addUser() {
      this.operateType = 'add'
      this.operateForm = {}
      if (this.operateFormLabel[1].model === 'sex') {
        this.operateFormLabel.splice(1, 0, { model: 'password', label: '密码' })
      }
      this.isShow = true
    },
    confirmAdd() {
      if (!this.operateForm.username || !this.operateForm.password) {
        this.$message({
          showClose: true,
          message: '用户名或密码不能为空~',
          type: 'warning'
        })
      } else if (!this.operateForm.tel) {
        this.$message({
          showClose: true,
          message: '联系方式不能为空~',
          type: 'warning'
        })
      } else {
        register(this.operateForm)
          .then(res => {
            const result = res.data
            if (result.code === 0) {
              this.$message({
                showClose: true,
                message: '新增管理员成功!',
                type: 'success'
              })
              this.isShow = false
              this.getAdmin()
            } else {
              this.$message({
                showClose: true,
                message: result.msg,
                type: 'error'
              })
            }
          })
          .catch(() => {
            alert('网络错误')
          })
      }
    },
    editUser(row) {
      this.operateType = 'edit'
      this.isShow = true
      if (this.operateFormLabel[1].model === 'password') {
        this.operateFormLabel.splice(1, 1)
      }
      this.operateForm = row
    },
    confirmEdit() {
      console.log(this.operateForm)
      if (this.operateType === 'edit' && this.operateForm.username) {
        update(this.operateForm)
          .then(res => {
            const result = res.data
            if (result.code === 0) {
              this.isShow = false
              this.$message({
                showClose: true,
                type: 'success',
                message: result.msg
              })
              this.getAdmin()
            } else {
              this.$message({
                showClose: true,
                type: 'error',
                message: result.msg
              })
            }
          })
          .catch(() => {
            this.$message({
              showClose: true,
              type: 'error',
              message: '亲，网络出错~'
            })
          })
      } else {
        this.$message({
          showClose: true,
          message: '用户名不能为空~',
          type: 'warning'
        })
      }
    },
    delUser(user) {
      const { _id } = user
      this.$confirm('此操作将永久删除该管理员, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          adminDel({ _id }).then(res => {
            const result = res.data
            if (result.code === 0) {
              this.$message({
                showClose: true,
                type: 'success',
                message: result.msg
              })
              this.getAdmin()
            } else {
              this.$message({
                showClose: true,
                type: 'error',
                message: '删除失败'
              })
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    getAdmin() {
      this.config.loading = true
      admin(this.config.page, 'admin', this.searchForm.keyword).then(res => {
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
    this.getAdmin()
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/common';
</style>
