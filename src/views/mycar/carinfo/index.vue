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
        <el-select v-model="form.searchType" v-for="type in form.searchType">
          <el-option label="Zone one" value="shanghai" />
          <el-option label="Zone two" value="beijing" />
          <el-option label="type" value="type" />
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        time: '2019/12/17 17:00',
        route: '浙大软院 -> 宁波站 -> 浙大软院',
        searchType: ['车型', '星级', '评分']
      }
    }
  }
}
</script>
