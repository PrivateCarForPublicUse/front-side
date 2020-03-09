<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="search"
        class="input-text"
        placeholder="输入搜索词"
        clearable
        @input="textChangeFun"
      >
        <i slot="prefix" class="el-input__icon el-icon-search" />
      </el-input>
      <el-select
        v-model="chooseType"
        placeholder="申请状态"
        clearable
        class="filter-item"
        filterable
        style="width: 130px"
        @change="chooseTypeFun"
      >
        <el-option
          v-for="item in applyOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>
    <el-table
      v-loading="listLoading"
      :data="datalist.slice((currentPage-1)*pageSize,currentPage*pageSize)"
      style="width: 100%"
      fit
      stripe
      highlight-current-row
      element-loading-text="Loading"
    >
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-form label-position="left" inline class="demo-table-expand">
            <div class="form-title">
              <a>行驶路径</a>
            </div>
            <el-form-item
              v-for="route in scope.row.filledRoutes"
              :key="route.key"
              :label="route.title"
            >
              <span>{{ route.value }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="申请时间" width="180" align="center">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span style="margin-left: 10px">{{ scope.row.route.applyTime }}</span>
        </template>
      </el-table-column>
      <!--      <el-table-column label="申请用车时间" width="400" align="center">-->
      <!--        <template slot-scope="scope">-->
      <!--          {{ scope.row.startTime }}——{{ scope.row.endTime }}-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column label="行程路径" width="300" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <!--          {{ scope.row | routePathFilter }}-->
          {{ scope.row.routesName }}
        </template>
      </el-table-column>
      <el-table-column label="申请车辆" width="200" prop="carInfo" />
      <el-table-column label="申请原因" width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.route.reason }}
        </template>
      </el-table-column>
      <el-table-column label="行程状态" align="center">
        <template slot-scope="scope">
          <el-tag
            size="medium"
            :type="scope.row.route.status | statusFilter"
          >{{ scope.row.route.status | statusWordsFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="报销状态">
        <template slot-scope="scope">
          <el-tag
            size="medium"
            :type="scope.row.route.isReimburse | reimburseFilter"
          >{{ scope.row.route.isReimburse | reimburseWordsFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="comment(scope.$index,scope.row)">评价</el-button>
        </template>
      </el-table-column>
      <!--      <el-table-column label="操作" align="center">-->
      <!--        <template slot-scope="scope">-->
      <!--          <el-button-->
      <!--            size="small"-->
      <!--            type="primary"-->
      <!--            :disabled="checkAviable(scope.row.route.status)"-->
      <!--          >-->
      <!--            取消申请-->
      <!--          </el-button>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
    </el-table>
    <div class="bos">
      <el-pagination
        background
        layout="total, prev, pager, next"
        :total="total"
        :current-page="currentPage"
        :page-size="pageSize"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-dialog :visible.sync="editFormVisible" title="车辆信息">
      <hr style="height:0;border-top-width:0">
      <MyCarComment :form="myCommentForm" :car-id="editForm.id" />
      <hr style="height:0;border-top-width:0">
      <CarComment v-for="data in carRates" :key="data.carRate.id" :data="data" />
      <CarInfo
        :modify="false"
        :car-id="editForm.id"
        :edit-form="editForm"
        :picture="editForm.picture | fileListFilter"
        :driving-license-img="editForm.drivingLicenseUrl | fileListFilter"
      />
    </el-dialog>
  </div>
</template>
<script>
import { getMyRouteByRouteModel } from '../../api/route'
import CarInfo from '../mycar/carinfo/carInfo'
import MyCarComment from '../comment/MyCarComment'
import { getCarInfoById } from '../../api/car'
import CarComment from '../comment/CarComment'
import { getCarRate } from '../../api/comment'
import store from '@/store'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        '1': 'success',
        '0': 'gray',
        '-1': 'danger',
        '2': 'warning',
        '3': 'success',
        '4': 'info'
      }
      return statusMap[status]
    },
    statusWordsFilter(status) {
      const statusMap = {
        '1': '审核通过',
        '0': '未审核',
        '-1': '审核失败',
        '2': '行程中',
        '3': '已完成',
        '4': '已取消'
      }
      return statusMap[status]
    },
    reimburseFilter(status) {
      const statusMap = {
        '1': 'success',
        '0': 'gray',
        '-1': 'danger',
        '2': 'warning'
      }
      return statusMap[status]
    },
    reimburseWordsFilter(status) {
      const statusMap = {
        '1': '已报销',
        '0': '未报销',
        '-1': '报销失败',
        '2': '审核中'
      }
      return statusMap[status]
    },
    routePathFilter(row) {
      let route = []
      if (row.secRoutesModel.length === 0) return
      route.push(row.secRoutesModel[0].secRoute.origin)
      row.secRoutesModel.forEach(r => {
        route.push(r.secRoute.destination)
      })
      return route.join(' -> ')
    },
    fileListFilter(fileList) {
      let urlPrefix = process.env.VUE_APP_IMG_API + '/'
      return [{ name: '车辆行驶证', url: urlPrefix + fileList }]
    }
  },
  components: {
    MyCarComment,
    CarInfo,
    CarComment
  },
  data() {
    return {
      pageSize: 10,
      currentPage: 1,
      search: '',
      chooseType: '',
      listLoading: true,
      datalistOld: [],
      datalist: [
        {
          id: 1,
          applyTime: '2016-05-03',
          reason: '哈哈服务部外设计费来看时空裂缝克拉斯',
          startTime: '2029-11-11 12:12:12',
          endTime: '2029-11-11 12:12:12',
          secRoute: [{
            id: '1',
            routeId: '0',
            origin: '浙江大学软件学院',
            destination: '宁波站（火车站）',
            carStartTime: '2019-12-12 12:00:00',
            carStopTime: '2019-12-12 12:00:00',
            drivingDistance: 20,
            drivingCost: 20
          }, {
            id: '2',
            routeId: '0',
            origin: '浙江大学软件学院',
            destination: '宁波站（火车站）',
            carStartTime: 'string',
            carStopTime: 'string',
            drivingDistance: 20,
            drivingCost: 20
          }],
          settlement: [{
            id: 1, carStartTime: 'string', carStopTime: 'string', drivingDistance: 20
          }, {
            id: 2, carStartTime: 'string', carStopTime: 'string', drivingDistance: 20
          }
          ],
          totulRouteLength: 60.22,
          totulCost: 62.33,
          status: 1
        }, {
          id: 2,
          applyTime: '2016-05-03',
          reason: '哈哈服务部外设计费来看时空裂缝克拉斯',
          startTime: '2029-11-11 12:12:12',
          endTime: '2029-11-11 12:12:12',
          secRoute: [{
            id: 1,
            origin: '浙江大学软件学院',
            destination: '宁波站（火车站）',
            carStartTime: 'string',
            carStopTime: 'string',
            drivingDistance: 20,
            drivingCost: 20
          }, {
            id: 2,
            origin: '宁波站（火车站）',
            destination: '浙江大学软件学院',
            carStartTime: 'string',
            carStopTime: 'string',
            drivingDistance: 20,
            drivingCost: 20
          },
          {
            id: 2,
            origin: '宁波站（火车站）',
            destination: '浙江大学软件学院',
            carStartTime: 'string',
            carStopTime: 'string',
            drivingDistance: 20,
            drivingCost: 20
          }],
          settlement: [{
            id: 1, carStartTime: 'string', carStopTime: 'string', drivingDistance: 20
          }, {
            id: 2, carStartTime: 'string', carStopTime: 'string', drivingDistance: 20
          }
          ],
          totulRouteLength: 60.22,
          totulCost: 62.33,
          status: 2
        }],
      statusMap: {
        '1': '审核通过',
        '0': '未审核',
        '-1': '审核失败',
        '2': '行程中',
        '3': '完成',
        '4': '取消'
      },
      applyOptions: [
        {
          value: '-1',
          label: '审核失败'
        }, {
          value: '0',
          label: '未审核'
        }, {
          value: '1',
          label: '审核通过'
        }, {
          value: '2',
          label: '行程中'
        }, {
          value: '3',
          label: '完成'
        }, {
          value: '4',
          label: '取消'
        }
      ],
      // 编辑页面
      myCommentForm: { rate: 0, comment: '', ok: false },
      editForm: { id: null, picture: null, drivingLicenseUrl: null },
      editFormVisible: false,
      carRates: null
    }
  },
  computed: {
    tables() {
      // let type = this.chooseType
      // // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      // this.datalist = this.datalist.filter((item) => {
      //   return String(item.route['status']) === type || type === '' || type === null
      // // })
      // }).filter((dataNews) => {
      //   return Object.keys(dataNews.route).some((key) => {
      //     return String(dataNews.route[key]).toLowerCase().indexOf(this.search) > -1
      //   })
      // })
      return this.datalist
    },
    total() {
      return this.tables.length
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getMyRouteByRouteModel().then(response => {
        if (response.code === 200) {
          this.datalist = response.data
          this.datalist.forEach(data => {
            data.filledRoutes = this.fillingRoutes(data.secRoutesModel)
            data.routesName = this.fillingRoutesName(data.secRoutesModel)
            data.carInfo = data.car.band + '-' + data.car.type + ' | ' + data.car.license
          })
          this.datalistOld = this.datalist
          this.listLoading = false
        }
      })
    },
    chooseTypeFun(val) {
      this.datalist = this.datalistOld.filter((item) => {
        return String(item.route['status']) === val || val === '' || val === null
      })
    },
    textChangeFun(val) {
      this.datalist = this.datalistOld.filter((dataNews) => {
        if (dataNews.routesName && String(dataNews['routesName']).indexOf(val) > -1) {
          return true
        }
        return Object.keys(dataNews.route).some((key) => {
          return String(dataNews.route[key]).toLowerCase().indexOf(val) > -1
        })
      })
    },
    checkAviable(val) {
      if (val === 3 || val === 2) {
        return true
      } else {
        return false
      }
    },
    handleCurrentChange(val) {
      this.currentPage = val
    },
    fillingRoutes(routes) {
      if (routes.length === 0) return
      let filledRoutes = []
      filledRoutes.push({ key: 0, title: '出发地', value: routes[0].secRoute.origin })
      for (let i = 0; i < routes.length; i++) {
        if (i === routes.length - 1) {
          filledRoutes.push({ key: i + 1, title: '目的地', value: routes[i].secRoute.destination })
        } else {
          filledRoutes.push({ key: i + 1, title: '途径', value: routes[i].secRoute.destination })
        }
      }
      return filledRoutes
    },
    fillingRoutesName(routes) {
      if (routes.length === 0) return
      let name = [routes[0].secRoute.origin]
      for (var i = 0; i < routes.length; i++) {
        if (i === routes.length - 1) {
          name.push(routes[i].secRoute.destination)
        } else {
          name.push(routes[i].secRoute.destination)
        }
      }
      return name.join(' -> ')
    },
    comment(index, row) {
      // 车辆详情+评价页面
      getCarInfoById(row.route.carId).then(response => {
        if (response.code !== 200) {
          this.$message({
            showClose: true,
            message: response.message,
            type: 'danger'
          })
          return
        }
        // 获取评论
        getCarRate(row.route.carId).then(response2 => {
          if (response2.code !== 200) {
            this.$message({
              showClose: true,
              message: response2.message,
              type: 'danger'
            })
            return
          }
          let userId = Number(store.getters.userId)
          this.carRates = response2.data
          this.carRates.forEach(v => {
            v.user.headPhotoUrl = process.env.VUE_APP_IMG_API + '/' + v.user.headPhotoUrl
            if (Number(v.user.id) === userId) {
              this.myCommentForm = v.carRate
              this.myCommentForm.ok = true
            }
          })
          this.editForm = response.data
          this.myCommentForm.carId = this.editForm.id
          this.editFormVisible = true
        })
      })
    }
  }
}
</script>
<style scoped>
  .filter-container {
    margin-bottom: 20px;
    margin-left: 25px;
  }

  .input-text {
    width: 300px;
  }

  .filler-right {
    float: right;
  }

  .demo-table-expand >>> label {
    margin-left: 20px;
    width: 90px;
    color: #99a9bf;
  }

  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 60%;
  }

  .form-title {
    font-weight: bolder;
    margin-bottom: 10px;
  }

  .bos {
    text-align: center;
  }
</style>
