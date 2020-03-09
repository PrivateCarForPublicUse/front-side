<template>
  <div>
    <el-form ref="form" :model="editForm" :rules="rules" label-width="120px">
      <el-row>
        <el-col :span="24">
          <el-form-item label="车辆照片" style="height: 142px" prop="picture">
            <el-upload
              ref="upload"
              action="http://localhost:8080/ensure/uploadwork"
              list-type="picture"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
              :on-change="handleChange"
              :auto-upload="false"
              :file-list="picture"
            >
              <el-button v-if="!picture" size="mini" type="primary">点击上传</el-button>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible" append-to-body="true">
              <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
          </el-form-item>
          <el-form-item label="车辆行驶证" style="height: 142px" prop="drivingLicenseImg">
            <el-upload
              ref="upload"
              action="http://localhost:8080/ensure/uploadwork"
              list-type="picture"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove1"
              :on-change="handleChange1"
              :auto-upload="false"
              :readonly="readOnly"
              :file-list="drivingLicenseImg"
            >
              <el-button v-if="!drivingLicenseImg" size="mini" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item label="车辆牌照" prop="license">
            <el-input v-model="editForm.license" :readonly="readOnly" />
          </el-form-item>
          <el-form-item label="车辆品牌" prop="band">
            <el-input v-model="editForm.band" :readonly="readOnly" />
          </el-form-item>
          <el-form-item label="车辆型号" prop="type">
            <el-input v-model="editForm.type" :readonly="readOnly" />
          </el-form-item>
          <el-form-item label="公私状态" prop="isPublic">
            <el-select v-model="editForm.isPublic" placeholder="车辆公私状态" @change="publicStateChange">
              <el-option label="公车" value="1" aria-selected="true" />
              <el-option label="私车" value="0" />
            </el-select>
          </el-form-item>
          <el-form-item label="公用时间段" class="input-label input-label-right">
            <template>
              <el-time-picker
                v-model="applyTimeValue"
                is-range
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                placeholder="选择时间范围"
                style="width:220px"
                :disabled="timeDisabledState"
              />
            </template>
          </el-form-item>
          <el-form-item label="车辆排放量" prop="displacement">
            <el-input v-model="editForm.displacement" :readonly="readOnly" />
          </el-form-item>
          <el-button v-show="modify" type="primary" style="margin-left: 120px" @click="upload">提交修改</el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>

import '@/utils/data-format.js'

export default {
  name: 'CarInfo',
  filters: {
    fileListFilter(fileList) {
      let urlPrefix = process.env.VUE_APP_IMG_API + '/'
      return [{ name: '车辆行驶证', url: urlPrefix + fileList }]
    }
  },
  props: {
    // eslint-disable-next-line vue/require-default-prop
    carId: Number,
    // eslint-disable-next-line vue/require-default-prop
    editForm: Object,
    // eslint-disable-next-line vue/require-default-prop
    picture: String,
    // eslint-disable-next-line vue/require-default-prop
    drivingLicenseImg: String,
    modify: {
      required: false,
      default: true,
      type: Boolean
    }
  },
  data() {
    return {
      form: {
        license: null, // 车辆牌照
        band: null, // 车辆品牌
        type: null, // 车辆型号
        isPublic: '1', // 公私状态
        starTime: null, // 公用开始时间
        endTime: null, // 公用结束时间
        displacement: null // 车辆排放量
      },
      applyTimeValue: [new Date(2020, 1, 1, 9, 0), new Date(2020, 1, 1, 18, 0)],
      timeDisabledState: false, // 时间框是否可选
      readOnly: true,
      rules: {
        license: { required: true, message: '请输入车辆牌照', trigger: 'blur' },
        band: { required: true, message: '请输入车辆品牌', trigger: 'blur' },
        type: { required: true, message: '请输入车辆型号', trigger: 'blur' },
        displacement: [
          { required: true, message: '请输入排放量', trigger: 'blur' },
          { type: 'number', message: '请输入数字', trigger: 'blur', transform: value => Number(value) }
        ]
      },
      dialogVisible: false,
      dialogImageUrl: null,
      fileList: [[]]
    }
  },
  created() {
    console.log(this.carId)
    console.log(this.editForm)
    this.fetchData(this.carId)
  },
  methods: {
    fetchData(id) {
      // getCarInfoById(id).then(response => {
      //   if (response.code !== 200) {
      //     this.$message({
      //       showClose: true,
      //       message: response.msg,
      //       type: 'danger'
      //     })
      //   }
      //   this.form = response.data
      // })
      this.form = this.editForm
    },
    handleRemove(file, fileList) {
      // 车辆照片
      this.picture = null
    },
    handleRemove1(file, fileList) {
      // 行驶证
      this.drivingLicenseImg = null
    },
    handlePictureCardPreview(file) {
      console.log(file)
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleChange(file, fileList) {
      // 车辆照片
      this.picture = fileList[0]
    },
    handleChange1(file, fileList) {
      // 行驶证
      this.drivingLicenseImg = fileList[0]
    },
    publicStateChange(value, key) {
      this.timeDisabledState = value !== '1'
    },
    upload() {
      // this.$refs['form'].validate(valid => {
      //   if (!valid) return
      // })
      // // let userId = store.getters.userId
      // let userId = this.userId
      // console.log('userId' + userId)
      // let carInfo = new FormData()
      // if (this.picture)carInfo.append('picture', this.picture.raw)
      // if (this.drivingLicenseImg)carInfo.append('drivingLicenseImg', this.drivingLicenseImg.raw)
      // this.form.starTime = this.applyTimeValue[0].Format('hh:mm')
      // this.form.endTime = this.applyTimeValue[1].Format('hh:mm')
      // carInfo.append('license', this.form.license)
      // carInfo.append('band', this.form.band)
      // carInfo.append('type', this.form.type)
      // carInfo.append('isPublic', Number(this.form.isPublic))
      // carInfo.append('starTime', this.form.starTime)
      // carInfo.append('endTime', this.form.endTime)
      // carInfo.append('displacement', this.form.displacement)
      // carInfo.append('userId', userId)
      // axios({
      //   url: 'http://localhost:8080/register/car', // 'http://localhost:8080/ensure/uploadwork', //* ***: 你的ip地址
      //   data: carInfo,
      //   method: 'post',
      //   headers: {
      //     'Content-Type': 'multipart/form-data'
      //     // 'Access-Control-Allow-Origin': 'http://127.0.0.1:8080'
      //     // 这里是为了解决跨域问题，但是博主并没有用这种方式解决。后面会给出解决方案
      //   }
      // }).then((res) => {
      //   console.log(res.data)
      // }) // 发送请求
    }
  }
}
</script>

<style>

</style>
