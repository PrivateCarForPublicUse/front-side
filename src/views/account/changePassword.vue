<template>
  <div class="app-container">
    <el-row>
      <el-col :span="12">
        <el-form ref="form" :model="form">
          <el-form-item label="请输入原密码" prop="p">
            <el-input v-model="form.p1" placeholder="请输入原密码" />
          </el-form-item>
          <el-form-item label="请输入新密码" prop="p1">
            <el-input v-model="form.p2" placeholder="请输入新密码" />
          </el-form-item>
          <el-form-item label="请重复输入新密码" prop="p2">
            <el-input v-model="form.p2" placeholder="请重复输入新密码" />
          </el-form-item>
          <el-button type="primary">提交</el-button>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'ChangePassword',
  data() {
    return {
      form: {
        p: '',
        p1: '',
        p2: ''
      }
    }
  }
}
</script>

<style scoped>

</style>
