<template>
  <div>
    <el-form>
      <div class="title" style="height:44px;position:relative">
        <div class="img" style="float:left">
          <img :src="data.user.headPhotoUrl" alt="" height="40px" width="40px" style="margin-left:10px">
        </div>
        <div class="name" style="margin-left:64px">{{ data.user.userName }}</div>
        <el-rate
          v-model="data.userRate.rate"
          disabled
          show-score
          text-color="#ff9900"
          style="margin-left:60px"
        />
        <div class="time" style="float:right;position:absolute;top:0;right:0">{{ data.userRate.time }}</div>
      </div>
      <el-input v-model="data.userRate.comment" type="textarea" />
    </el-form>
    <hr style="height:0;border-top-width:0">
  </div>
</template>

<script>
export default {
  name: 'UserComment',
  props: {
    // eslint-disable-next-line vue/require-default-prop
    data: Object
  },
  data() {
    return {
      form: null
    }
  }
}
</script>

<style scoped>
</style>
