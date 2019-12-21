<template>
  <div class="app-container">
    <h1>企业通讯录</h1>
    <el-table border highlight-current-row fit :data="list">
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="phone" label="电话" />
    </el-table>
  </div>
</template>
<script>
export default {
  data() {
    return {
      list: [{ name: 'a（客服）', phone: '123' }, { name: 'b', phone: '234' }]
    }
  }
}
</script>
