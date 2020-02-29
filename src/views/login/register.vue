<template>
  <div class="app-container">
    <h2>私车公用系统 用户注册</h2>
    <el-form ref="form" :rules="rules" :model="form" label-width="120px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="身份证正面" style="height: 142px" prop="file">
            <el-upload
              ref="upload"
              action="http://localhost:8080/ensure/uploadwork"
              list-type="picture"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
              :on-change="handleChange"
              :auto-upload="false"
            >
              <el-button v-if="!file" size="mini" type="primary">点击上传</el-button>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
            <!--          <el-button type="primary" @click="upload">确 定</el-button>-->
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
            >
              <el-button v-if="!idCardBackImg" size="mini" type="primary">点击上传</el-button>
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
            >
              <el-button v-if="!drivingLicenseFrontImg" size="mini" type="primary">点击上传</el-button>
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
            >
              <el-button v-if="!drivingLicenseBackImg" size="mini" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item label="头像" style="height: 142px">
            <el-upload
              ref="upload4"
              action="http://localhost:8080/ensure/uploadwork"
              list-type="picture"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove4"
              :on-change="handleChange4"
              :auto-upload="false"
            >
              <el-button v-if="!avatar" size="mini" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
        </el-col>
        <!--        <el-col :span="12">-->
        <!--          <el-button>上传身份证113</el-button>-->
        <!--          <el-upload-->
        <!--            class="avatar-uploader"-->
        <!--            action="https://jsonplaceholder.typicode.com/posts/"-->
        <!--            :show-file-list="false"-->
        <!--            :on-preview="handlePictureCardPreview"-->
        <!--            :auto-upload="false"-->
        <!--          >-->
        <!--            <img v-if="imageUrl" :src="imageUrl" class="avatar el-upload" alt="">-->
        <!--            <i v-else class="el-icon-plus avatar-uploader-icon" />-->
        <!--          </el-upload>-->
        <!--        </el-col>-->
        <el-col :span="12">
          <el-form-item label="用户名" prop="userName">
            <el-input v-model="form.userName" />
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="form.password" show-password />
          </el-form-item>
          <el-form-item label="请再次输入密码" prop="password2">
            <el-input v-model="form.password2" show-password />
          </el-form-item>
          <el-form-item label="所属企业" prop="companyId">
            <el-select ref="company" v-model="form.companyId" filterable placeholder="请选择">
              <el-option
                v-for="item in companies"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
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
          <!--          <el-form-item label="驾驶证到期日期">-->
          <!--            <el-input v-model="form.driverLicenseDueDate" />-->
          <!--          </el-form-item>-->
          <el-form-item label="手机号" prop="phoneNumber">
            <el-input v-model="form.phoneNumber" />
          </el-form-item>
          <el-form-item label="工号" prop="workNumber">
            <el-input v-model="form.workNumber" />
          </el-form-item>
          <el-button type="primary" style="margin-left: 120px" @click="upload">提 交</el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { getAllCompanies } from '@/api/other'
import axios from 'axios'
export default {
  data() {
    let passwordCheck = (rule, value, callback) => {
      if (this.form.password !== value) { callback(new Error('重复密码输入错误')) } else callback()
    }
    // let fileCheck = (rule, value, callback) => {
    //   if (this.file === null) callback(new Error('请上传文件'))
    //   callback()
    // }
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      file: null,
      // idCardFrontImg: null,
      idCardBackImg: null,
      drivingLicenseFrontImg: null,
      drivingLicenseBackImg: null,
      avatar: null,
      form: {
      },
      valiForm: {
        name: ''
      },
      selectedCompany: '',
      companies: [],
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
          // { validator: nameRule1, trigger: 'blur' }
        ],
        userName: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
          // { validator: nameRule1, trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 10, message: '长度在 6 到 10 个字符', trigger: 'blur' }
        ],
        password2: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 10, message: '长度在 6 到 10 个字符', trigger: 'blur' },
          { validator: passwordCheck, message: '密码重复输入错误', trigger: 'blur' }
        ],
        phoneNumber: [
          { required: true, type: 'number', message: '请输入11位电话号码', transform: (value) => Number(value), trigger: 'blur' } // min: 10000000000, max: 20000000000,
        ],
        workNumber: [
          { required: true, message: '请输入工号', trigger: 'blur' }
        ],
        idCardNumber: [
          { required: true, type: 'number', message: '请输入身份证号', transform: (value) => Number(value), trigger: 'blur' }
        ],
        driverLicenseNumber: [
          { required: true, type: 'number', message: '请输入驾驶证号', transform: (value) => Number(value), trigger: 'blur' }
        ],
        companyId: [
          { required: true, message: '请选择企业' }
        ],
        gender: [
          { required: true, message: '请选择性别', trigger: 'change' }
        ]
        // file: { required: true, message: '请选择上传的图片', trigger: 'blur',
        //   validator: fileCheck
        // }
      },
      imageUrl: ''
    }
  },
  created() {
    // 获取公司列表
    getAllCompanies().then(response => {
      this.companies = response.data
    })
  },
  methods: {
    onSubmit() {
      this.$message('submit!')
    },
    onCancel() {
      this.$message({
        message: 'cancel!',
        type: 'warning'
      })
    },
    add(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 通过验证执行
        } else {
          // 验证失败执行
          console.log('error submit!!')
          return false
        }
      })
    },
    handleRemove(file, fileList) {
      // 身份证正面
      this.file = null
    },
    handleRemove1(file, fileList) {
      // 身份证背面
      this.idCardBackImg = null
    },
    handleRemove2(file, fileList) {
      // 驾驶证正面
      this.drivingLicenseFrontImg = null
    },
    handleRemove3(file, fileList) {
      // 驾驶证背面
      this.drivingLicenseBackImg = null
    },
    handleRemove4(file, fileList) {
      // 头像
      this.avatar = null
    },
    handlePictureCardPreview(file) {
      console.log(file)
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleChange(file, fileList) {
      // 身份证正面
      this.file = fileList[0]
      console.log(this.file)
    },
    handleChange1(file, fileList) {
      // 身份证背面
      this.idCardBackImg = fileList[0]
    },
    handleChange2(file, fileList) {
      // 驾驶证正面
      this.drivingLicenseFrontImg = fileList[0]
    },
    handleChange3(file, fileList) {
      // 驾驶证背面
      this.drivingLicenseBackImg = fileList[0]
    },
    handleChange4(file, fileList) {
      // 头像
      this.avatar = fileList[0]
    },
    upload() {
      let v = true
      this.$refs['form'].validate(valid => {
        if (!valid) {
          console.log(this.form)
          v = false
        }
      })
      if (!v) return
      // this.$refs.upload.submit()
      // this.$refs.upload1.submit()
      // this.$refs.upload2.submit()
      // this.$refs.upload3.submit()
      this.form.gender = Number(this.form.gender)
      console.log(this.form)
      let file = new FormData()
      console.log('log' + file)
      if (this.file) { file.append('idCardFrontImg', this.file.raw) }
      if (this.idCardBackImg) file.append('idCardBackImg', this.idCardBackImg.raw)
      if (this.drivingLicenseFrontImg) file.append('drivingLicenseFrontImg', this.drivingLicenseFrontImg.raw)
      if (this.drivingLicenseBackImg) file.append('drivingLicenseBackImg', this.drivingLicenseBackImg.raw)
      if (this.avatar) file.append('avatar', this.avatar.raw)
      file.append('userName', this.form.userName)
      file.append('password', this.form.password)
      file.append('companyId', this.form.companyId)
      file.append('name', this.form.name)
      file.append('gender', this.form.gender)
      file.append('idCardNumber', this.form.idCardNumber)
      file.append('driverLicenseNumber', this.form.driverLicenseNumber)
      file.append('phoneNumber', this.form.phoneNumber)
      file.append('workNumber', this.form.workNumber)
      // file.append('user', this.form)
      axios({
        url: 'http://localhost:8080/register/user', // 'http://localhost:8080/ensure/uploadwork', //* ***: 你的ip地址
        data: file,
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

<style scoped>
  .line{
    text-align: center;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
