<template>
  <el-form inline :model="form" ref="form" label-width="100px">
    <el-form-item
      v-for="item in formLabel"
      :key="item.model"
      :label="item.label"
    >
      <el-input
        v-if="!item.type"
        v-model="form[item.model]"
        autocomplete="off"
        :placeholder="
          '请输入' +
            (item.label === '密码'
              ? '密码，最多22位'
              : item.label
              ? item.label
              : '姓名关键词进行搜索，如:张三，关键词（张）')
        "
        :maxlength="item.label === '密码' ? '22' : ''"
        :show-password="item.label === '密码'"
        style="width: 400px"
      />
      <div style="color: #F56C6C;font-size: 12px;">
        {{ item.label === '联系方式' ? checkMobile(form[item.model]) : '' }}
      </div>
      <el-select
        v-if="item.type === 'select'"
        v-model="form[item.model]"
        placeholder="请选择"
        style="width: 400px"
      >
        <el-option
          v-for="item in item.opts"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
        <el-switch
          v-model="form[item.model]"
          v-if="item.type === 'switch'"
          active-color="#13ce66"
          inactive-color="#ff4949"
        />
      </el-select>
    </el-form-item>
    <el-form-item>
      <slot></slot>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'CommonForm',
  props: {
    inline: Boolean,
    form: Object,
    formLabel: Array
  },
  data() {
    return {
      admin: []
    }
  },
  methods: {
    checkMobile(str) {
      const re = /^1\d{10}$/
      if (re.test(str)) {
        return ''
      } else {
        return '* 请正确输入13位手机号码, 必填'
      }
    }
  }
}
</script>

<style scoped></style>
