<template>
  <div>
    <el-upload
      ref="upload"
      action="http://localhost:8080/ensure/uploadwork"
      list-type="picture"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :on-change="handleChange"
      :auto-upload="false"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
    <el-button type="primary" @click="upload">确 定</el-button>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      file: null
    }
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePictureCardPreview(file) {
      console.log(file)
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleChange(file, fileList) {
      this.file = fileList[0]
      console.log(this.file)
    },
    upload() {
      // this.$refs.upload.submit()
      let data = new FormData()
      data.append('file', this.file.raw)
      axios({
        url: 'http://localhost:8080/ensure/uploadwork', //* ***: 你的ip地址
        data: data,
        method: 'post',
        headers: {
          'Content-Type': 'multipart/form-data'
          // 'Access-Control-Allow-Origin': 'http://127.0.0.1:8080'
          // 这里是为了解决跨域问题，但是博主并没有用这种方式解决。后面会给出解决方案
        }
      }).then((res) => {
        console.log(res.data)
      }) // 发送请求
    }
  }
}
</script>
