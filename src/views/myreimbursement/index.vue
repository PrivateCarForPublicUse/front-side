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
        <el-button type="primary">
          申请报销
        </el-button>
      </div>
    </div>
    <el-table
      :data="tables.slice((currentPage-1)*pageSize,currentPage*pageSize)"
      style="width: 100%"
      fit
      stripe
      highlight-current-row
      @selection-change="handleSelectionChange"
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
      <!-- <el-table-column type="selection" width="55" /> -->
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
      <el-table-column label="申请时间" width="180" align="center">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span style="margin-left: 10px">{{ scope.row.appleyTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请原因" width="350" align="center">
        <template slot-scope="scope">
          {{ scope.row.reason }}
        </template>
      </el-table-column>
      <el-table-column label="行驶长度(km)" align="center">
        <template slot-scope="scope">
          {{ scope.row.routeLength }}
        </template>
      </el-table-column>
      <el-table-column label="费用(元)" align="center">
        <template slot-scope="scope">
          {{ scope.row.cost }}
        </template>
      </el-table-column>
      <el-table-column label="报销状态" align="center">
        <template slot-scope="scope">
          <el-tag
            size="medium"
            :type="scope.row.reimburseType | statusFilter"
          >{{ scope.row.reimburseType | statusWordsFilter }}</el-tag>
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
    }
  },
  data() {
    return {
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
      datalist: [
        {
          id: 1,
          appleyTime: '2016-05-03',
          reason: '哈哈服务部外设计费来看时空裂缝克拉斯',
          routetest: ['浙江大学软件学院', '宁波站（火车站）', '浙江大学软件学院'],
          routeLength: 60.22,
          cost: 62.33,
          reimburseType: 1
        },
        {
          id: 4,
          appleyTime: '2016-05-03',
          reason: '哈哈服务部外设计费来看时空裂缝克拉斯',
          routetest: ['浙江大学软件学院', '宁波站（火车站）', '浙江大学软件学院'],
          routeLength: 60.22,
          cost: 62.33,
          reimburseType: 2
        },
        {
          id: 6,
          appleyTime: '2016-05-03',
          reason: '测试是啊是啊',
          routetest: ['浙江大学软件学院', '宁波站（火车站）', '浙江大学软件学院'],
          routeLength: 60.22,
          cost: 62.33,
          reimburseType: -1
        },
        {
          id: 8,
          appleyTime: '2016-05-03',
          reason: '测试是啊是啊',
          routetest: ['浙江大学软件学院', '宁波站（火车站）', '浙江大学软件学院'],
          routeLength: 60.22,
          cost: 62.33,
          reimburseType: -1
        },
        {
          id: 9,
          appleyTime: '2016-05-03',
          reason: '测试是啊是啊',
          routetest: ['浙江大学软件学院', '宁波站（火车站）', '浙江大学软件学院'],
          routeLength: 60.22,
          cost: 62.33,
          reimburseType: -1
        },
        {
          id: 12,
          appleyTime: '2016-05-03',
          reason: '测试是啊是啊',
          routetest: ['浙江大学软件学院', '宁波站（火车站）', '浙江大学软件学院'],
          routeLength: 60.22,
          cost: 62.33,
          reimburseType: -1
        },
        {
          id: 16,
          appleyTime: '2016-05-03',
          reason: '测试是啊是啊',
          routetest: ['浙江大学软件学院', '宁波站（火车站）', '浙江大学软件学院'],
          routeLength: 60.22,
          cost: 62.33,
          reimburseType: -1
        },
        {
          id: 17,
          appleyTime: '2016-05-03',
          reason: '测试是啊是啊',
          routetest: ['浙江大学软件学院', '宁波站（火车站）', '浙江大学软件学院'],
          routeLength: 60.22,
          cost: 62.33,
          reimburseType: -1
        },
        {
          id: 18,
          appleyTime: '2016-05-03',
          reason: '测试是啊是啊',
          routetest: ['浙江大学软件学院', '宁波站（火车站）', '浙江大学软件学院'],
          routeLength: 60.22,
          cost: 62.33,
          reimburseType: 0
        },
        {
          id: 29,
          appleyTime: '2016-05-03',
          reason: '测试是啊是啊',
          routetest: ['浙江大学软件学院', '宁波站（火车站）', '浙江大学软件学院'],
          routeLength: 60.22,
          cost: 62.33,
          reimburseType: 0
        },
        {
          id: 44,
          appleyTime: '2016-05-03',
          reason: '测试不是啊不是啊',
          routetest: ['浙江大学软件学院', '宁波站（火车站）', '浙江大学软件学院'],
          routeLength: 60.22,
          cost: 62.33,
          reimburseType: 0
        }
      ],
      multipleSelection: [],
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
        return String(item['reimburseType']) === type || type === '' || type === null
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
        if (items[index].reimburseType === 0) { tableOptions.push(items[index].id) }
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
    for (var index in this.datalist) {
      this.datalist[index].filledRoutes = this.fillingRoutes(this.datalist[index].routetest)
    }
    this.datalist.map(item => {
      this.$set(item, 'checked', false)
      return item
    })
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    fillingRoutes(routes) {
      var filledRoutes = []
      for (var i = 0; i < routes.length; i++) {
        if (i === 0) {
          filledRoutes.push({ key: 0, title: '出发地', value: routes[0] })
        } else if (i === routes.length - 1) {
          filledRoutes.push({ key: i, title: '目的地', value: routes[i] })
        } else {
          filledRoutes.push({ key: i, title: '途径', value: routes[i] })
        }
      }
      return filledRoutes
    },
    handleCurrentChange(val) {
      this.currentPage = val
    },
    handleCheckAllChange(val) {
      let that = this
      for (let i in that.tables) {
        if (that.tables[i].reimburseType === 0) {
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
    },
    isDisabel(val) {
      let that = this
      var reimburse = that.tables[val + (that.currentPage - 1) * that.pageSize].reimburseType
      return reimburse !== 0
    },
    flashAllChecked() {
      let that = this
      that.checkAll = false
      for (let i in that.tables) {
        if (that.tables[i].reimburseType === 0) {
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
  /* position: absolute;
  bottom: 10px;
  left: 50%;
  margin-left: -170px; */
  text-align: center;
}
</style>
