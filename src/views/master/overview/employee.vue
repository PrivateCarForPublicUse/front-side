<template>
  <div class="container">
    <div class="button-container">
      <el-input
        v-model="searchReason"
        class="input-text"
        placeholder="输入搜索词"
        clearable
      >
        <i slot="prefix" class="el-input__icon el-icon-search" />
      </el-input>
      <el-table
        v-loading="listLoading"
        :data="tables.slice((currentPage-1)*pageSize,currentPage*pageSize)"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
        style="width: 100%"
        :cell-style="cellStyle"
        @cell-click="redirect"
        @cell-mouse-enter="showTips"
        @cell-mouse-leave="hideTips"
      >
        <el-table-column label="用户名" prop="userName" align="center" />
        <el-table-column label="工号" prop="workNumber" align="center" />
        <el-table-column label="电话号码" prop="phoneNumber" align="center" />
        <el-table-column label="姓名" prop="name" align="center" />
        <el-table-column label="性别" prop="gender" align="center" />
        <el-table-column label="用户星级" prop="starLevel" align="center" />
      </el-table>
      <div style="text-align: center">
        <el-pagination
          background
          layout="total, prev, pager, next"
          :total="total"
          :current-page="currentPage"
          :page-size="pageSize"
          @current-change="handleCurrentChange"
        />
      </div>
      <div v-show="show" class="tips">点击查看详情</div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      show: false,
      currentPage: 1,
      pageSize: 4,
      listLoading: false,
      list: [],
      editFormVisible: false,
      editFormIndex: 0,
      editForm: {
      },
      deleteFormVisible: false,
      names: 'employee',
      searchReason: '',
      datalist: [{
        id: 1,
        userName: 'kinkin',
        workNumber: 125,
        phoneNumber: 122,
        name: '111',
        gender: '1',
        starLevel: 5.6
      }, {
        id: 1,
        userName: 'kinkin',
        workNumber: 125,
        phoneNumber: 122,
        name: '111',
        gender: '1',
        starLevel: 5.6
      }, {
        id: 1,
        userName: 'kinkin',
        workNumber: 125,
        phoneNumber: 122,
        name: '111',
        gender: '1',
        starLevel: 5.6
      }]
    }
  },
  computed: {
    tables() {
      const search = this.searchReason
      return this.datalist.filter((dataNews) => {
        return Object.keys(dataNews).some((key) => {
          return String(dataNews[key]).toLowerCase().indexOf(search) > -1 || search === null
        })
      })
    },
    total() {
      return this.list.length
    }
  },
  methods: {
    redirect(row) {
      this.$router.push({ path: '/overview/employee/details/' + row.id })
    },
    handleCurrentChange(val) {
      this.currentPage = val
    },
    showTips(row, column, cell, event) {
      this.show = true
      var div = document.getElementsByClassName('tips')[0]
      div.style = 'left:' + (event.pageX - 180) + 'px;top:' + (event.pageY - 50) + 'px;'
    },
    hideTips() {
      this.show = false
    },
    cellStyle() {
      return 'cursor:pointer;'
    }
  }
}
</script>
<style scoped>
.input-text{
  float:left;
  margin-left: 25px;
  margin-top:20px;
  width:300px;
  margin-bottom: 20px;
}
.reimburse-second{
  width:100px;
  height:100px;
  background-color: red;
}
.tips{
  font-size:12px;
  text-align: center;
  color: white;
  position:absolute;
  border-radius: 5%;
  width:80px;
  height:25px;
  line-height: 25px;
  background-color: rgba(0, 0, 0, 0.5)
}
</style>
