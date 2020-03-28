<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules">
      <el-form-item label="您的评价" prop="rate">
        <el-rate v-model="form.rate" style="margin-top: 11px" :disabled="form.ok" />
      </el-form-item>
      <el-form-item prop="comment">
        <el-input
          v-model="form.comment"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4}"
          placeholder="请输入内容"
          :readonly="form.ok"
        />
      </el-form-item>
      <el-button v-show="!form.ok" type="primary" size="mini" @click="submit">提交</el-button>
    </el-form>
  </div>
</template>

<script>
import { submitComment } from '../../api/comment'

export default {
  name: 'MyCarComment',
  props: {
    // eslint-disable-next-line vue/require-default-prop
    carId: Number,
    form: Object
  },
  data() {
    return {
      // form: { rate: null, comment: '' },
      rules: {
        rate: { required: true, min: 1, transform: value => Number(value), type: 'number', message: '请评分' },
        comment: { required: true, message: '请输入评价' }
      }
    }
  },
  created() {
    this.form.carId = this.carId
  },
  methods: {
    submit() {
      let v = false
      this.$refs['form'].validate(valid => {
        if (valid) {
          v = true
        }
      })
      if (!v) return
      this.form.time = new Date().Format('yyyy-MM-dd hh:mm:ss')
      submitComment(this.form).then(response => {
        if (response.code !== 200) {
          this.$message({
            showClose: true,
            type: 'danger',
            message: '提交失败'
          })
          return
        }
        this.form.ok = true
      })
    }
  }
}
</script>

<style scoped>

</style>
