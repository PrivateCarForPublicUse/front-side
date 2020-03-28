<template>
  <div class="app-container">
    <h2 style="display:inline-block;margin-right:20px">个人基本资料</h2>
    <el-button type="primary" icon="el-icon-edit">修改</el-button>
    <personal-info :id="3">aaa</personal-info>
  </div>
</template>
<script>
import { getUserInfo } from '@/api/user'
import personalInfo from './personalInfo'

export default {
  components: {
    'personalInfo': personalInfo
  },
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
