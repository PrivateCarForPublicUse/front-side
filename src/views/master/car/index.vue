<template>
  <div class="app-container">
    <h2>车辆管理</h2>
    <el-table
      v-loading="listLoading"
      :data="list.slice((currentPage-1)*pageSize,currentPage*pageSize)"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="车牌" prop="license" />
      <el-table-column label="品牌" prop="band" />
      <el-table-column label="车型" prop="type" />
      <el-table-column label="所属用户" prop="userId" />
      <el-table-column label="使用状态" prop="isUse" />
      <el-table-column label="可预约开始时间" prop="starTime" />
      <el-table-column label="可预约结束时间" prop="endTime" />
      <el-table-column label="耗油量" prop="displacement" />
      <el-table-column label="车辆星级" prop="starOfCar" />
      <!--      <el-table-column label="身份证信息" />-->
      <!--      <el-table-column label="驾驶证信息" />-->
      <el-table-column label="操作">
        <template scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index,scope.row)">编辑</el-button>
          <el-button size="mini" @click="handleDelete(scope.$index,scope.row)">删除</el-button>
        </template>
      </el-table-column>
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
    <!--    弹出的编辑框-->
    <el-dialog :visible.sync="deleteFormVisible" title="确定删除这一行数据么？">
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="deleteSubmit">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="editFormVisible" title="编辑" :close-on-click-modal="false">
      <el-form ref="editForm" :model="editForm" label-width="80px" :rules="editFormRules">
        <el-form-item label="车牌" prop="license">
          <el-input v-model="editForm.license" auto-complete="off" />
        </el-form-item>
        <el-form-item label="品牌">
          <el-input v-model="editForm.band" />
        </el-form-item>
        <el-form-item label="车型">
          <el-input v-model="editForm.type" />
        </el-form-item>
        <el-form-item label="所属用户">
          <el-input v-model="editForm.userId" />
        </el-form-item>
        <el-form-item label="使用状态">
          <el-input v-model="editForm.isUse" />
        </el-form-item>
        <el-form-item label="可预约开始时间">
          <el-input v-model="editForm.starTime" />
        </el-form-item>
        <el-form-item label="可预约结束时间">
          <el-input v-model="editForm.endTime" />
        </el-form-item>
        <el-form-item label="耗油量">
          <el-input v-model="editForm.displacement" />
        </el-form-item>
        <el-form-item label="车辆星级">
          <el-input v-model="editForm.starOfCar" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" :loading="editLoading" @click.native="editSubmit">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getAllCars, updateCar } from '@/api/car'

export default {
  name: 'Index',
  data() {
    return {
      currentPage: 1,
      pageSize: 2,
      listLoading: false,
      list: [],
      editFormVisible: false,
      editFormIndex: 0,
      editForm: {
      },
      deleteFormVisible: false
    }
  },
  computed: {
    tables() {
      const type = this.chooseType
      const search = this.searchReason
      return this.datalist.filter((item) => {
        return String(item['reimburseType']) === type || type === '' || type === null
      }).filter((dataNews) => {
        return Object.keys(dataNews).some((key) => {
          const item = (function(item, filters) {
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
      return this.list.length
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getAllCars().then(response => {
        this.list = response.data
        this.listLoading = false
      })
    },
    handleCurrentChange(val) {
      this.currentPage = val
    },
    handleEdit(index, row) {
      this.editFormVisible = true
      this.editFormIndex = index
      this.editForm = Object.assign({}, row)
    },
    handleDelete(index, row) {
      this.deleteFormVisible = true
    },
    editSubmit() {
      // 提交修改的用户信息
      updateCar(this.editForm).then(response => {
        if (response.code === 200) {
          this.$message({
            showClose: true,
            message: '修改成功',
            type: 'success'
          })
          this.list[this.editFormIndex] = Object.assign({}, this.editForm)
          this.editFormVisible = false
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
