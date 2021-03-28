<template>
  <div class="login">
    <div style="text-align: center">
      <img src="../../assets/image/title_header.jpg" width="50" height="50" />
    </div>
    <el-form
      label-position="top"
      :model="ruleForm"
      status-icon
      :rules="rules"
      ref="ruleForm"
    >
      <div class="label">用户名</div>
      <el-form-item prop="name">
        <el-input
          type="name"
          v-model="ruleForm.name"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <div class="label">密 码</div>
      <el-form-item prop="password">
        <el-input
          type="password"
          v-model="ruleForm.password"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item align="center">
        <el-button type="primary" @click="submitForm('ruleForm')">
          登录
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { login } from '../../network/admin'

export default {
  name: 'Login',
  data() {
    let name = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入用户名'))
      } else {
        callback()
      }
    }
    let password = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }
    return {
      ruleForm: {
        name: '',
        password: ''
      },
      rules: {
        name: [{ validator: name, trigger: 'blur' }],
        password: [{ validator: password, trigger: 'blur' }]
      }
    }
  },
  methods: {
    submitForm(formName) {
      const admin = {
        username: this.ruleForm.name,
        password: this.ruleForm.password
      }
      this.$refs[formName].validate(valid => {
        if (valid && admin.username && admin.password) {
          login(admin).then(res => {
            const result = res.data
            if (result.code === 0) {
              this.$store.commit('clearMenu')
              this.$store.commit('setMenu', result.data.menu)
              this.$store.commit('setToken', result.data.token)
              this.$store.commit('addMenu', this.$router)
              this.$message({
                showClose: true,
                type: 'success',
                message: result.msg
              })
              this.$router.push({ name: 'home' })
            } else {
              this.$message({
                showClose: true,
                type: 'error',
                message: result.msg
              })
            }
          })
        } else {
          this.$message({
            type: 'info',
            message: 'error submit！'
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.login {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  margin: auto;
  padding: 20px;
  background-color: #fff;
  border: 1px solid #eee;
  width: 300px;
  height: 320px;
}
.label {
  color: #777;
  font-size: 15px;
  margin: 10px 0;
}
.el-button {
  padding: 10px 135px;
  margin-top: 20px;
}
</style>
