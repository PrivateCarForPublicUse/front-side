<template>
  <div>
    <el-form label-width="120px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="头像" style="height: 142px">
            <el-upload
              ref="upload4"
              action="http://localhost:8080/ensure/uploadwork"
              list-type="picture"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove4"
              :on-change="handleChange4"
              :auto-upload="false"
              :file-list="fileList[4]"
            >
              <el-button v-if="!form.url[4]" size="mini" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item label="用户名" prop="userName">
            <el-input v-model="form.userName" />
          </el-form-item>
          <el-form-item label="姓名" prop="name">
            <el-input v-model="form.name" />
          </el-form-item>
          <el-form-item label="性别" prop="gender">
            <el-select v-model="form.gender" placeholder="性别">
              <el-option label="男" value="0" />
              <el-option label="女" value="1" />
            </el-select>
          </el-form-item>
          <el-form-item label="身份证号" prop="idCardNumber">
            <el-input v-model="form.idCardNumber" />
          </el-form-item>
          <!--          <el-form-item label="身份证到期日期">-->
          <!--            <el-input v-model="form.idCardDueDate" />-->
          <!--          </el-form-item>-->
          <el-form-item label="驾驶证号" prop="driverLicenseNumber">
            <el-input v-model="form.driverLicenseNumber" />
          </el-form-item>
          <el-form-item label="手机号" prop="phoneNumber">
            <el-input v-model="form.phoneNumber" />
          </el-form-item>
          <el-form-item label="工号" prop="workNumber">
            <el-input v-model="form.workNumber" />
          </el-form-item>
          <el-form-item label="账户余额">
            <el-input v-model="form.remainMoney" readonly="true" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
          <el-form-item label="身份证正面" style="height: 142px" prop="file">
            <el-upload
              ref="upload"
              action="http://localhost:8080/ensure/uploadwork"
              list-type="picture"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
              :on-change="handleChange"
              :auto-upload="false"
              :file-list="fileList[0]"
            >
              <el-button v-if="!form.url[0]" size="mini" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item label="身份证背面" style="height: 142px">
            <el-upload
              ref="upload1"
              action="http://localhost:8080/ensure/uploadwork"
              list-type="picture"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove1"
              :on-change="handleChange1"
              :auto-upload="false"
              :file-list="fileList[1]"
            >
              <el-button v-if="!form.url[1]" size="mini" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item label="驾驶证正面" style="height: 142px">
            <el-upload
              ref="upload2"
              action="http://localhost:8080/ensure/uploadwork"
              list-type="picture"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove2"
              :on-change="handleChange2"
              :auto-upload="false"
              :file-list="fileList[2]"
            >
              <el-button v-if="!form.url[2]" size="mini" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item label="驾驶证背面" style="height: 142px">
            <el-upload
              ref="upload3"
              action="http://localhost:8080/ensure/uploadwork"
              list-type="picture"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove3"
              :on-change="handleChange3"
              :auto-upload="false"
              :file-list="fileList[3]"
            >
              <el-button v-if="!form.url[3]" size="mini" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { getUserById } from '@/api/user'

export default {
  name: 'PersonalInfo',
  props: {
    id: {
      type: Number,
      default: 3,
      required: true
    }
  },
  data() {
    return {
      form: {
        url: []
      },
      dialogImageUrl: '',
      dialogVisible: false,
      src: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
      fileList: []
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      getUserById(this.id).then(response => {
        if (response.code !== 200) {
          return
        }
        this.form = response.data
        this.form.gender = this.form.gender.toString()
        this.form.url = Array(5)
        this.form.url = [this.form.idCardFrontUrl, this.form.idCardBackUrl, this.form.driverLicenseFrontUrl, this.form.driverLicenseBackUrl, this.form.headPhotoUrl]
        let str = ['身份证正面', '身份证背面', '驾驶证正面', '驾驶证背面', '头像']
        this.form.url.forEach((v, i) => {
          this.form.url[i] = process.env.VUE_APP_IMG_API + '/' + v
          this.fileList[i] = []
          this.fileList[i][0] = { name: str[i], url: this.form.url[i], status: 'ready' }
        })
      })
    },
    handleRemove(file, fileList) {
      // 身份证正面
      this.form.url[0] = null
    },
    handleRemove1(file, fileList) {
      // 身份证背面
      this.form.url[1] = null
    },
    handleRemove2(file, fileList) {
      // 驾驶证正面
      this.form.url[2] = null
    },
    handleRemove3(file, fileList) {
      // 驾驶证背面
      this.form.url[3] = null
    },
    handleRemove4(file, fileList) {
      // 头像
      this.form.url[4] = null
    },
    handlePictureCardPreview(file) {
      console.log(file)
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleChange(file, fileList) {
      // 身份证正面
      this.form.url[0] = fileList[0]
      console.log(this.file)
    },
    handleChange1(file, fileList) {
      // 身份证背面
      this.form.url[1] = fileList[0]
    },
    handleChange2(file, fileList) {
      // 驾驶证正面
      this.form.url[2] = fileList[0]
    },
    handleChange3(file, fileList) {
      // 驾驶证背面
      this.form.url[3] = fileList[0]
    },
    handleChange4(file, fileList) {
      // 头像
      this.form.url[4] = fileList[0]
    }
  }
}
</script>

<style scoped>

</style>
