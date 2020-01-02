<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="searchReason"
        class="input-text"
        placeholder="输入搜索词"
        clearable
        @clear="flashAllChecked"
      >
        <i slot="prefix" class="el-input__icon el-icon-search" />
      </el-input>
      <el-select
        v-model="chooseType"
        placeholder="报销状态"
        clearable
        class="filter-item"
        style="width: 130px"
      >
        <el-option
          v-for="item in reimburseOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <div class="filler-right">
        <el-button type="primary" @click="applyReimburse">
          申请报销
        </el-button>
      </div>
    </div>
    <el-table
      ref="rTable"
      v-loading="listLoading"
      :data="tables.slice((currentPage-1)*pageSize,currentPage*pageSize)"
      style="width: 100%"
      fit
      stripe
      highlight-current-row
      element-loading-text="Loading"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="expand">
        <template slot-scope="scope">
          <div>
            <el-table
              :data="scope.row.secModels"
              width="100%"
              class="intable-label"
            >
              <el-table-column label="行驶路程" width="500" align="center">
                <template slot-scope="scope">
                  {{ scope.row.origin }} -- {{ scope.row.destination }}
                </template>
              </el-table-column>
              <el-table-column label="历经时间" width="350" align="center">
                <template slot-scope="scope">
                  {{ scope.row.carStartTime }} -- {{ scope.row.carStopTime }}
                </template>
              </el-table-column>
              <el-table-column property="drivingDistance" label="行驶长度(km)" align="center">
                <template slot-scope="scope">
                  {{ scope.row.drivingDistance | toFixed2 }}
                </template>
              </el-table-column>
              <el-table-column property="drivingCost" label="费用(元)" align="center">
                <template slot-scope="scope">
                  {{ scope.row.drivingCost | toFixed2 }}
                </template>
              </el-table-column>
            </el-table>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        align="left"
        width="55"
      >
        <template slot="header" slot-scope="scope">
          <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange" />
        </template>
        <template slot-scope="scope">
          <el-checkbox
            :key="tables[scope.$index+(currentPage-1)*pageSize].id"
            v-model="tables[scope.$index+(currentPage-1)*pageSize].checked"
            :disabled="isDisabel(scope.$index)"
            @change="handleCheckedItemsChange(scope.$index)"
          />
        </template>
      </el-table-column>
      <el-table-column label="行程申请时间" width="180" align="center">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span style="margin-left: 10px">{{ scope.row.applyTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请原因" width="350" align="center">
        <template slot-scope="scope">
          {{ scope.row.reason }}
        </template>
      </el-table-column>
      <el-table-column label="行驶总长度(km)" align="center">
        <template slot-scope="scope">
          {{ scope.row.routelength | toFixed2 }}
        </template>
      </el-table-column>
      <el-table-column label="总费用(元)" align="center">
        <template slot-scope="scope">
          {{ scope.row.cost | toFixed2 }}
        </template>
      </el-table-column>
      <el-table-column label="报销状态" align="center">
        <template slot-scope="scope">
          <el-tag
            size="medium"
            :type="scope.row.isReimburse | statusFilter"
          >{{ scope.row.isReimburse | statusWordsFilter }}</el-tag>
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
import { sendReimburseApplication, getMyRouteByDataModel } from '../../api/route'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        '1': 'success',
        '0': 'gray',
        '-1': 'danger',
        '2': 'warning'
      }
      return statusMap[status]
    },
    statusWordsFilter(status) {
      const statusMap = {
        '1': '已报销',
        '0': '未报销',
        '-1': '报销失败',
        '2': '审核中'
      }
      return statusMap[status]
    },
    toFixed2(data) {
      return data.toFixed(2)
    }
  },
  data() {
    return {
      listLoading: false,
      multipleSelection: [],
      checkAll: false,
      isIndeterminate: false,
      pageSize: 10,
      currentPage: 1,
      reimburseOptions: [
        {
          value: '-1',
          label: '报销失败'
        },
        {
          value: '0',
          label: '未报销'
        },
        {
          value: '1',
          label: '已报销'
        },
        {
          value: '2',
          label: '审核中'
        }
      ],
      // 测试数据
      datalist: [
        {
          id: 1,
          appleyTime: '2016-05-03 11:00',
          reason: '哈哈服务部外设计费来看时空裂缝克拉斯',
          secRoute: [{
            id: '1', origin: '浙江大学软件学院', destination: '宁波站（火车站）', carStartTime: '2019-12-12 12:00:00', carStopTime: '2019-12-12 12:00:00', drivingDistance: 20, drivingCost: 20
          }, {
            id: '2', origin: '宁波站（火车站）', destination: '浙江大学软件学院', carStartTime: 'string', carStopTime: 'string', drivingDistance: 20, drivingCost: 20 }],
          routeLength: 60.22,
          cost: 62.33,
          isReimburse: 0
        }],
      chooseType: '',
      searchReason: '',
      searchItems: ['reason', 'routeLength', 'cost', 'applyTime']
    }
  },
  computed: {
    tables() {
      var type = this.chooseType
      var search = this.searchReason
      return this.datalist.filter((item) => {
        return String(item['isReimburse']) === type || type === '' || type === null
      }).filter((dataNews) => {
        return Object.keys(dataNews).some((key) => {
          var item = (function(item, filters) {
            for (var index in filters) {
              if (filters[index] === item) {
                return item
              }
            }
          })(key, this.searchItems)
          return String(dataNews[item]).toLowerCase().indexOf(search) > -1 || search === null
        })
      })
    },
    total() {
      return this.tables.length
    },
    optionList() {
      let items = this.datalist
      var tableOptions = []
      for (var index in items) {
        if (items[index].isReimburse === 0) { tableOptions.push(items[index].id) }
      }
      return tableOptions
    }
  },
  watch: {
    chooseType() {
      if (this.chooseType !== '' && this.chooseType !== null) { this.currentPage = 1 }
    },
    searchReason() {
      if (this.searchReason !== '' && this.searchReason !== null) {
        this.flashAllChecked()
        this.currentPage = 1
      }
    }
  },
  created() {
    this.datalist.map(item => {
      this.$set(item, 'checked', false)
      return item
    })
    this.fetchDataList()
  },
  methods: {
    fetchDataList() {
      this.listLoading = true
      getMyRouteByDataModel().then(response => {
        if (response.code === 200) {
          this.datalist = response.data
          this.listLoading = false
        }
      })
    },
    handleSelectionChange(val) {
      // 选中多选框
      this.multipleSelection = val
      console.log('jjj')
      console.log(val)
    },
    applyReimburse() {
      // 申请报销
      let rList = []
      this.tables.forEach(item => {
        if (item.checked) {
          rList.push(item.routId)
        }
      })
      console.log(rList)
      if (rList.length === 0) return
      sendReimburseApplication({ ids: rList }).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '申请成功！',
            type: 'success',
            showClose: true
          })
          this.tables.forEach(item => {
            rList.forEach(r => {
              if (item.routId === r) {
                item.isReimburse = 2
              }
            })
          })
        }
      })
    },
    handleCurrentChange(val) {
      this.currentPage = val
    },
    handleCheckAllChange(val) {
      let that = this
      for (let i in that.tables) {
        if (that.tables[i].isReimburse === 0) {
          if (val) {
            that.tables[i].checked = true
          } else {
            that.tables[i].checked = false
          }
        }
      }
      that.isIndeterminate = false
    },
    handleCheckedItemsChange(index) {
      // 筛选后的全选和非全选
      let that = this
      index = index + (that.currentPage - 1) * that.pageSize
      that.tables[index].isChecked = !that.tables[index].isChecked
      let countedSize = 0
      for (let i in that.tables) {
        if (that.tables[i].checked) {
          countedSize++
        }
      }
      that.isIndeterminate = countedSize > 0 && countedSize < that.optionList.length
      this.checkAll = countedSize === that.optionList.length
    },
    isDisabel(val) {
      let that = this
      var reimburse = that.tables[val + (that.currentPage - 1) * that.pageSize].isReimburse
      return reimburse !== 0
    },
    flashAllChecked() {
      let that = this
      that.checkAll = false
      for (let i in that.tables) {
        if (that.tables[i].isReimburse === 0) {
          that.tables[i].checked = false
        }
      }
      that.isIndeterminate = false
    }
  }
}
</script>
<style scoped>
.filter-container {
  margin-bottom: 20px;
  margin-left: 25px;
  /* position:absolute; */
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
.bos{
  text-align: center;
}
</style>
