<template>
  <div class="app-container">
    <el-form ref="form" label-width="120px" :model="form">
      <el-form-item label="预约时间">
        <el-input v-model="form.time" />
      </el-form-item>
      <el-form-item label="路径">
        <el-input v-model="form.route" />
      </el-form-item>
      <el-form-item label="搜索">
        <el-select v-model="form.select">
          <!--          <el-option label="Zone one" value="shanghai" />-->
          <!--          <el-option label="Zone two" value="beijing" />-->
          <el-option v-for="(item,index) in searchType" :key="index" :label="item" :value="item" />
        </el-select>
        <el-input v-model="form.search" style="width:200px" placeholder="搜索" />
      </el-form-item>
      <el-form-item label="搜索">
        <el-input v-model="form.search" placeholder="请输入内容" class="input-with-select">
          <el-select slot="prepend" v-model="form.select" placeholder="请选择" style="width:150px">
            <el-option v-for="(item,index) in searchType" :key="index" :label="item" :value="item" />
          </el-select>
          <el-button slot="append" icon="el-icon-search" />
        </el-input>
      </el-form-item>
    </el-form>
    <!--测试表格    -->
    <!--    <el-table-->
    <!--      v-loading="false"-->
    <!--      :data="list"-->
    <!--      element-loading-text="Loading"-->
    <!--      border-->
    <!--      fit-->
    <!--      highlight-current-row-->
    <!--    >-->
    <!--      <el-table-column align="center" label="" width="95">-->
    <!--        <template slot-scope="scope">-->
    <!--          {{ scope.$index + 1 }}-->
    <!--        </template>-->
    <!--      </el-table-column>-->
    <!--      <el-table-column label="name" prop="name" width="110" />-->
    <!--      <el-table-column label="star" prop="star" width="110" />-->
    <!--    </el-table>-->
    <!--    车辆信息表格-->
    <el-table
      v-loading="listLoading"
      :data="carList"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="序号" width="95">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="license" />
      <el-table-column prop="band" />
      <el-table-column prop="type" />
      <el-table-column prop="isPublic" />
      <el-table-column prop="isUse" />
      <el-table-column prop="starTime" />
      <el-table-column prop="endTime" />
      <el-table-column prop="displacement" />
      <el-table-column prop="starOfCar" />
    </el-table>
  </div>
</template>

<script>
import { getMyCarInfo } from '@/api/car'

export default {
  data() {
    return {
      form: {
        time: '2019/12/17 17:00',
        route: '浙大软院 -> 宁波站 -> 浙大软院',
        searchType: ['车型', '星级高于', '品牌'],
        search: ''
      },
      searchType: ['车型', '星级高于', '品牌'],
      list: [{ name: 'a', star: '4' }, { name: 'b', star: '5' }],
      listLoading: false,
      carList: null
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      // this.listLoading = true
      getMyCarInfo().then(response => {
        this.carList = response.data
        this.listLoading = false
      })
    }
  }
}
</script>
