<template>
  <div class="app-container">
    <h2>报销审核</h2>
    <el-table
      v-loading="listLoading"
      :data="list.slice((currentPage-1)*pageSize,currentPage*pageSize)"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="开始时间" prop="route.applyStartTime" />
      <el-table-column label="结束时间" prop="route.applyEndTime" />
      <el-table-column label="车辆" prop="route.carId" />
      <el-table-column label="用户" prop="route.userId" />
      <el-table-column label="行程状态" prop="route.status" />
      <el-table-column label="申请原因" prop="route.reason" />
      <!--      <el-table-column label="身份证信息" />-->
      <!--      <el-table-column label="驾驶证信息" />-->
      <el-table-column label="报销状态">
        <template scope="scope">
          <el-tag
            size="medium"
            :type="scope.row.route.isReimburse | statusFilter"
          >{{ scope.row.route.isReimburse | statusWordsFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template scope="scope">
          <el-button size="mini" @click="acceptReimburse(scope.$index,scope.row)">审核通过</el-button>
          <el-button size="mini" @click="rejectReimburseDialog(scope.row)">审核不通过</el-button>
          <!--          <el-button size="mini" @click="auditPass(scope.$index,scope.row,1)">审核通过</el-button>-->
          <!--          <el-button size="mini" @click="auditPass(scope.$index,scope.row,2)">撤销审核</el-button>-->
          <!--          <el-button size="mini" @click="auditPass(scope.$index,scope.row,-1)">审核不通过</el-button>-->
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
      <el-form ref="editForm" :model="editForm" label-width="80px">
        <el-form-item label="开始时间">
          <el-input v-model="editForm.applyStartTime" auto-complete="off" />
        </el-form-item>
        <el-form-item label="结束时间">
          <el-input v-model="editForm.applyEndTime" />
        </el-form-item>
        <el-form-item label="车辆">
          <el-input v-model="editForm.carId" />
        </el-form-item>
        <el-form-item label="用户">
          <el-input v-model="editForm.userId" />
        </el-form-item>
        <el-form-item label="报销状态">
          <el-input v-model="editForm.status" />
        </el-form-item>
        <el-form-item label="申请原因">
          <el-input v-model="editForm.reason" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" :loading="editLoading" @click.native="editSubmit">提交</el-button>
      </div>
    </el-dialog>
    <!--    反馈审核失败消息的对话框-->
    <el-dialog title="审核失败反馈信息" :visible.sync="rejectDialogVisible">
      <el-form ref="rejectForm" :model="rejectForm" :inline="true" :rules="rules">
        <el-form-item label="反馈信息" :label-width="100" prop="rejectMessage">
          <el-input v-model="rejectForm.rejectMessage" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="rejectReimburse(rejectForm.row,rejectForm.rejectMessage)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getAuditRoutes, getAllRoutes, updateRoute } from '@/api/route'
import { getReimburseRoutes } from '@/api/route'
import { acceptReimburse, rejectReimburse } from '../../../../api/route'

export default {
  name: 'Index',
  filters: {
    // 报销状态（-1 报销失败；0 未报销；1 已报销；2 审核中）
    statusFilter(status) {
      const statusMap = {
        '1': 'success',
        '2': 'gray',
        '0': 'warning',
        '-1': 'danger'
      }
      return statusMap[status]
    },
    statusWordsFilter(status) {
      const statusMap = {
        '1': '审核通过',
        '2': '未审核',
        '0': '未申请',
        '-1': '审核失败'
      }
      return statusMap[status]
    }
  },
  data() {
    function sleep1(ms, callback) {
      setTimeout(callback, ms)
    }
    let messageRule = (rule, value, callback) => {
      console.log('hhhhh')
      console.log('***' + value)
      if (value === '' || value === null) {
        callback(new Error('出发地不能为空'))
      } else {
        callback()
      }
    }
    return {
      currentPage: 1,
      pageSize: 10,
      listLoading: false,
      list: [],
      editFormVisible: false,
      editFormIndex: 0,
      editForm: {
      },
      deleteFormVisible: false,
      rejectDialogVisible: false,
      rejectForm: {
        reviewReimburse: '',
        rejectMessage: '',
        row: {}
      },
      rules: {
        rejectMessage: [
          { required: true, message: '请输入信息', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 5, max: 10, message: '长度在 5 到 10 个字符', trigger: 'blur' }
        ]
      },
      valiForm: {
        name: ''
      },
      editFormRules: {},
      editLoading: false
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
      }).sort(function(a, b) {
        return b.applyStartTime - a.applyStartTime
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
      getReimburseRoutes({ status: 3, isReimburse: 2 }).then(response => {
        this.list = response.data
        this.listLoading = false
      })
    },
    acceptReimburse(index, row) {
      // 审核通过
      acceptReimburse({ routeId: row.route.id }).then(response => {
        if (response.code === 200) {
          // 审核通过，设置为 1
          row.route.isReimburse = 1
          this.$message({
            message: '处理成功！',
            type: 'success'
          })
        } else {
          this.$message({
            message: response.message,
            type: 'danger'
          })
        }
      })
    },
    rejectReimburseDialog(row) {
      // 拒绝报销的dialog
      this.rejectForm.rejectMessage = ''
      this.rejectForm.row = row
      this.rejectDialogVisible = true
    },
    rejectReimburse(row, message) {
      // 拒绝审核
      this.$refs['rejectForm'].validate((valid) => {
        if (valid) {
          rejectReimburse({ routeId: row.route.id, message: message }).then(response => {
            if (response.code === 200) {
              row.route.isReimburse = -1
              this.$message({
                message: '处理成功！',
                type: 'success'
              })
            } else {
              this.$message({
                message: response.message,
                type: 'danger'
              })
            }
          }).finally(() => {
            this.rejectDialogVisible = false
          })
        } else {
          return false
        }
      })
    },
    auditPass(index, row, check) {
      row.route.isReimburse = check
      updateRoute(Object.assign({}, row.route)).then(response => {
        if (response.code === 200) {
          this.$message({
            showClose: true,
            message: '修改成功',
            type: 'success'
          })
        }
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
      updateRoute(this.editForm).then(response => {
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

</style>
