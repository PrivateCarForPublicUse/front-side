<template>
  <div class="app-container">
    <el-row>
      <el-col :span="12">
        <el-form ref="form" :model="form" :rules="rules">
          <el-form-item label="请输入原密码" prop="p1">
            <el-input v-model="form.p1" placeholder="请输入原密码" show-password />
          </el-form-item>
          <el-form-item label="请输入新密码" prop="p2">
            <el-input v-model="form.p2" placeholder="请输入新密码" show-password />
          </el-form-item>
          <el-form-item label="请重复输入新密码" prop="p3">
            <el-input v-model="form.p3" placeholder="请重复输入新密码" show-password />
          </el-form-item>
          <el-button type="primary" @click="submit">提交</el-button>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { userChangePassword } from '../../api/user'

export default {
  name: 'ChangePassword',
  data() {
    return {
      form: {
        p: '',
        p1: '',
        p2: ''
      },
      rules: {
        p1: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 4, max: 10, message: '长度在 4 到 10 个字符', trigger: 'blur' }
        ],
        p2: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 4, max: 10, message: '长度在 4 到 10 个字符', trigger: 'blur' }
        ],
        p3: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 4, max: 10, message: '长度在 4 到 10 个字符', trigger: 'blur' },
          { validator: (rule, value, callback) => {
            if (this.form.p2 !== value) { callback(new Error('重复密码输入错误')) } else callback()
          }, message: '第二次密码输入不一致', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          userChangePassword(this.form).then(response => {
            if (response.code === 501) {
              this.$message({
                showClose: true,
                type: 'danger',
                message: '密码输入错误'
              })
            } else if (response.code === 502) {
              this.$message({
                showClose: true,
                type: 'danger',
                message: '第二次密码输入不一致'
              })
            } else if (response.code === 200) {
              this.$message({
                showClose: true,
                type: 'success',
                message: '修改成功！'
              })
            }
            this.form = { p: '', p1: '', p2: '' }
          })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
