<template>
  <div class="app-container">
    <h2>用户注册</h2>
    <el-row>
      <el-col :span="12">
        <el-button>上传身份证</el-button>
        <el-upload
          class="avatar-uploader"
          action="https://jsonplaceholder.typicode.com/posts/"
          :show-file-list="false"
          :on-preview="handlePictureCardPreview"
          :auto-upload="false"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar el-upload" alt="">
          <i v-else class="el-icon-plus avatar-uploader-icon" />
        </el-upload>
      </el-col>
      <el-col :span="12"><el-button>上传驾驶证</el-button></el-col>
    </el-row>
    <el-form ref="form" :model="form" label-width="120px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="姓名">
            <el-input v-model="form.name" />
          </el-form-item>
          <el-form-item label="性别">
            <el-select v-model="form.gender" placeholder="性别">
              <el-option label="男" value="shanghai" />
              <el-option label="女" value="beijing" />
            </el-select>
          </el-form-item>
          <el-form-item label="身份证号">
            <el-input v-model="form.idCardNumber" />
          </el-form-item>
          <el-form-item label="身份证到期日期">
            <el-input v-model="form.idCardDueDate" />
          </el-form-item>
          <el-form-item label="驾驶证号">
            <el-input v-model="form.driverLicenseNumber" />
          </el-form-item>
          <el-form-item label="驾驶证到期日期">
            <el-input v-model="form.driverLicenseDueDate" />
          </el-form-item>
          <el-form-item label="手机号">
            <el-input v-model="form.phoneNumber" />
          </el-form-item>
          <el-form-item label="工号">
            <el-input v-model="form.workNumber" />
          </el-form-item>
          <el-form-item label="头像">
            <el-input v-model="form.headPhotoUrl" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="Activity name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="Activity zone">
        <el-select v-model="form.region" placeholder="please select your zone">
          <el-option label="Zone one" value="shanghai" />
          <el-option label="Zone two" value="beijing" />
        </el-select>
      </el-form-item>
      <el-form-item label="Activity time">
        <el-col :span="11">
          <el-date-picker v-model="form.date1" type="date" placeholder="Pick a date" style="width: 100%;" />
        </el-col>
        <el-col :span="2" class="line">-</el-col>
        <el-col :span="11">
          <el-time-picker v-model="form.date2" type="fixed-time" placeholder="Pick a time" style="width: 100%;" />
        </el-col>
      </el-form-item>
      <el-form-item label="Instant delivery">
        <el-switch v-model="form.delivery" />
      </el-form-item>
      <el-form-item label="Activity type">
        <el-checkbox-group v-model="form.type">
          <el-checkbox label="Online activities" name="type" />
          <el-checkbox label="Promotion activities" name="type" />
          <el-checkbox label="Offline activities" name="type" />
          <el-checkbox label="Simple brand exposure" name="type" />
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="Resources">
        <el-radio-group v-model="form.resource">
          <el-radio label="Sponsor" />
          <el-radio label="Venue" />
        </el-radio-group>
      </el-form-item>
      <el-form-item label="Activity form">
        <el-input v-model="form.desc" type="textarea" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">Create</el-button>
        <el-button @click="onCancel">Cancel</el-button>
      </el-form-item>
    </el-form>

    <el-form ref="valiForm" :model="valiForm" :rules="rules" label-width="100px" class="demo-valiForm">

      <el-form-item label="名称：" prop="name">
        <el-input v-model="valiForm.name" />
      </el-form-item>

    </el-form>
    <el-button type="primary" @click="add('valiForm')">确 定</el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      valiForm: {
        name: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 5, max: 10, message: '长度在 5 到 10 个字符', trigger: 'blur' }
          // { validator: nameRule1, trigger: 'blur' }
        ]
      },
      imageUrl: ''
    }
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
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload(file) {
      // const isJPG = file.type === 'image/jpeg'
      // const isLt2M = file.size / 1024 / 1024 < 2
      //
      // if (!isJPG) {
      //   this.$message.error('上传头像图片只能是 JPG 格式!')
      // }
      // if (!isLt2M) {
      //   this.$message.error('上传头像图片大小不能超过 2MB!')
      // }
      // return isJPG && isLt2M
    },
    handlePictureCardPreview(file) {
      console.log('jjj')
      this.imageUrl = file.url
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
