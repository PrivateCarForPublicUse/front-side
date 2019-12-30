<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="search"
        class="input-text"
        placeholder="输入搜索词"
        clearable
      >
        <i slot="prefix" class="el-input__icon el-icon-search" />
      </el-input>
      <el-select
        v-model="chooseType"
        placeholder="申请状态"
        clearable
        class="filter-item"
        style="width: 130px"
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
      :data="tables"
      style="width: 100%"
      fit
      stripe
      highlight-current-row
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
          <span style="margin-left: 10px">{{ scope.row.applyTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请用车时间" width="400" align="center">
        <template slot-scope="scope">
          {{ scope.row.startTime }}——{{ scope.row.endTime }}
        </template>
      </el-table-column>
      <el-table-column label="申请原因" width="500" align="center">
        <template slot-scope="scope">
          {{ scope.row.reason }}
        </template>
      </el-table-column>
      <el-table-column label="申请状态" align="center">
        <template slot-scope="scope">
          <el-tag
            size="medium"
            :type="scope.row.status | statusFilter"
          >{{ scope.row.status | statusWordsFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            size="small"
            type="primary"
            :disabled="checkAviable(scope.row.status)"
          >
            取消申请
          </el-button>
        </template>
      </el-table-column>
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
  </div>
</template>
<script>
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
        '3': '完成',
        '4': '取消'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      pageSize: 10,
      currentPage: 1,
      search: '',
      chooseType: '',
      datalist: [
        {
          id: 1,
          applyTime: '2016-05-03',
          reason: '哈哈服务部外设计费来看时空裂缝克拉斯',
          startTime: '2029-11-11 12:12:12',
          endTime: '2029-11-11 12:12:12',
          secRoute: [{
            id: '1', routeId: '0', origin: '浙江大学软件学院', destination: '宁波站（火车站）', carStartTime: '2019-12-12 12:00:00', carStopTime: '2019-12-12 12:00:00', drivingDistance: 20, drivingCost: 20
          }, {
            id: '2', routeId: '0', origin: '浙江大学软件学院', destination: '宁波站（火车站）', carStartTime: 'string', carStopTime: 'string', drivingDistance: 20, drivingCost: 20 }],
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
            id: 1, origin: '浙江大学软件学院', destination: '宁波站（火车站）', carStartTime: 'string', carStopTime: 'string', drivingDistance: 20, drivingCost: 20
          }, {
            id: 2, origin: '宁波站（火车站）', destination: '浙江大学软件学院', carStartTime: 'string', carStopTime: 'string', drivingDistance: 20, drivingCost: 20 },
          {
            id: 2, origin: '宁波站（火车站）', destination: '浙江大学软件学院', carStartTime: 'string', carStopTime: 'string', drivingDistance: 20, drivingCost: 20 }],
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
      ]
    }
  },
  computed: {
    tables() {
      var type = this.chooseType
      return this.datalist.filter((item) => {
        return String(item['status']) === type || type === '' || type === null
      }).filter((dataNews) => {
        return Object.keys(dataNews).some((key) => {
          return String(dataNews[key]).toLowerCase().indexOf(this.search) > -1
        })
      })
    },
    total() {
      return this.tables.length
    }
  },
  created() {
    for (var index in this.datalist) {
      this.datalist[index].filledRoutes = this.fillingRoutes(this.datalist[index].secRoute)
    }
  },
  methods: {
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
      var filledRoutes = []
      filledRoutes.push({ key: 0, title: '出发地', value: routes[0].origin })
      for (var i = 0; i < routes.length; i++) {
        if (i === routes.length - 1) {
          filledRoutes.push({ key: i, title: '目的地', value: routes[i].destination })
        } else {
          filledRoutes.push({ key: i, title: '途径', value: routes[i].destination })
        }
      }
      return filledRoutes
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
  width:60%;
}
.form-title {
  font-weight: bolder;
  margin-bottom: 10px;
}
.bos{
  text-align: center;
}
</style>
