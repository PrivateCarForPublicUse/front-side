<template>
  <div class="app-container">
    <h2 style="display:inline-block;margin-right:20px">个人基本资料</h2>
    <el-button type="primary" icon="el-icon-edit">修改</el-button>
    <el-form :model="userInfo" label-width="120px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="姓名：">
            <el-input v-model="userInfo.userName" :placeholder="userInfo.userName" disabled="true" />
          </el-form-item>
          <el-form-item label="性别：">
            <el-input v-model="userInfo.gender" disabled="true" />
          </el-form-item>
          <el-form-item label="个人星级：">
            <el-input v-model="userInfo.starLevel" disabled="true" />
          </el-form-item>
          <el-form-item label="账户余额：">
            <el-input v-model="userInfo.remainMoney" disabled="true" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="电话号码：">
            <el-input v-model="userInfo.phoneNumber" :disabled="isDisabled" />
          </el-form-item>
          <el-form-item label="身份证信息：">
            <el-input v-model="userInfo.username" />
          </el-form-item>
          <el-form-item label="驾驶证信息：">
            <el-input v-model="userInfo.username" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import { getUserInfo } from '@/api/user'

export default {
  data() {
    return {
      userInfo: {
        'id': 0,
        'userName': 'hello',
        'accountId': null,
        'workNumber': 31456,
        'name': '??',
        'gender': 0,
        'phoneNumber': '123456789',
        'companyId': null,
        'headPhotoUrl': null,
        'remainMoney': 100,
        'idCardNumber': null,
        'idCardFrontUrl': null,
        'idCardBackUrl': null,
        'idCardDueDate': null,
        'driverLicenseNumber': null,
        'driverLicenseFrontUrl': null,
        'driverLicenseBackUrl': null,
        'driverLicenseDueDate': null,
        'checkStatus': 1,
        'tid': null,
        'isDeleted': 0,
        'starLevel': 4.5
      },
      userName: 'aaaa',
      isDisabled: true
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      // getUserInfo().then(response => {
      //   this.userInfo = response.data
      // })
    }
  }
}
// {
//   "id": 0,
//   "userName": "hello",
//   "accountId": null,
//   "workNumber": 31456,
//   "name": "??",
//   "gender": 0,
//   "phoneNumber": "123456789",
//   "companyId": null,
//   "headPhotoUrl": null,
//   "remainMoney": 100,
//   "idCardNumber": null,
//   "idCardFrontUrl": null,
//   "idCardBackUrl": null,
//   "idCardDueDate": null,
//   "driverLicenseNumber": null,
//   "driverLicenseFrontUrl": null,
//   "driverLicenseBackUrl": null,
//   "driverLicenseDueDate": null,
//   "checkStatus": 1,
//   "tid": null,
//   "isDeleted": 0,
//   "starLevel": 4.5}
</script>
