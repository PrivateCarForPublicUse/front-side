<template>
  <div>
    <el-upload
      action="http://375859080.oss-cn-hangzhou.aliyuncs.com"
      :data="dataObj"
      list-type="picture"
      :before-upload="beforeUpload"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove">
      <el-button size="small" type="primary">点击上传</el-button>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      file: null,
      dataObj: {
        policy: '',
        signature: '',
        key: '',
        ossaccessKeyId: '',
        dir: '',
        host: ''
        // callback: ''
      }
    }
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    beforeUpload(file) {
      let _self = this
      return new Promise((resolve, reject) => {
        axios({
          url: 'http://localhost:8080/aliyun/oss/policy',
          method: 'get'
        }).then(response => {
          _self.dataObj.policy = response.data.data.policy
          _self.dataObj.signature = response.data.data.signature
          _self.dataObj.ossaccessKeyId = response.data.data.accessKeyId
          _self.dataObj.key = response.data.data.dir + '/${filename}'
          _self.dataObj.dir = response.data.data.dir
          _self.dataObj.host = response.data.data.host
          // _self.dataObj.callback = response.data.data.callback
          resolve(true)
        }).catch(err => {
          console.log(err)
          reject(false)
        })
      })
    }
  }
}
</script>
