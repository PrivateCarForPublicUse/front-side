<template>
  <div class="dashboard-container">
    <div class="amap-wrapper">
      <!-- <el-amap vid="amap" :plugin="plugin" class="amap-demo" :center="center" /> -->
      <div id="container" />
    </div>
    <div class="input-box">
      <el-form :inline="true">
        <div class="input-container">
          <div class="search-form-left">
            <svg-icon icon-class="sorting" />
          </div>
          <el-form-item label="起">
            <el-input v-model="start" class="input-text" placeholder="出发地" />
          </el-form-item>
          <el-form-item
            v-for="route in routeFormSubRoutes.routes"
            :key="route.key"
            :label="'经'"
          >
            <el-input
              v-model="route.value"
              class="input-text"
              placeholder="途径节点"
            />
            <svg-icon icon-class="delete" @click="deleteSubRoute(route)" />
          </el-form-item>
          <el-form-item label="终" prop="end">
            <el-input v-model="end" class="input-text" placeholder="目的地" />
            <svg-icon icon-class="round_add_fill" @click="addSubRoute" />
          </el-form-item>
        </div>
        <div class="input-submit">
          <el-button>提交</el-button>
        </div>
      </el-form>
    </div>
    <div class="select-location">
      <el-select v-model="chooseCity" filterable placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import MapLoader from '@/utils/map-loader.js'
export default {
  name: 'Dashboard',
  data() {
    return {
      start: '',
      end: '',
      routeFormSubRoutes: {
        routes: []
      },
      citys: ['北京', '杭州', '上海', '宁波'],
      options: [],
      chooseCity: '杭州',
      map: null
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ]),
    routeFormRoutes() {
      var temp = JSON.parse(JSON.stringify(this.routeFormSubRoutes))
      temp.unshift(this.start)
      temp.push(this.end)
      return temp
    }
  },
  mounted() {
    this.init()
    console.log('重新渲染')
  },

  created() {
    for (var index = 0; index < this.citys.length; index++) {
      this.options.push({ value: index, label: this.citys[index] })
    }
    this.init()
    console.log('创建')
  },
  methods: {
    addSubRoute() {
      this.routeFormSubRoutes.routes.push({
        value: '',
        key: Date.now()
      })
    },
    deleteSubRoute(item) {
      var index = this.routeFormSubRoutes.routes.indexOf(item)
      if (index !== -1) {
        this.routeFormSubRoutes.routes.splice(index, 1)
      }
    },
    init() {
      const that = this
      MapLoader().then(AMap => {
        that.map = new AMap.Map('container', {
          resizeEnable: true,
          lang: 'cn'
        })
        AMap.plugin(['AMap.ToolBar', 'AMap.Scale'], () => {
          that.map.addControl(new AMap.ToolBar({ position: 'RB', liteStyle: true }))
          that.map.addControl(new AMap.Scale())
        })
        this.chooseCity = AMap.plugin('AMap.CitySearch', () => {
          var citySearch = new AMap.CitySearch()
          citySearch.getLocalCity((status, result) => {
            if (status === 'complete' && result.info === 'OK') {
              // 查询成功，result即为当前所在城市信息
              return result.city.slice(0, -1)
            }
          })
        })
      })
    }
  }
}
</script>

<style scoped>
.amap-wrapper {
  width: 100%;
  height: 100%;
  position: absolute;
}
.input-box {
  position: absolute;
  left: 10px;
  top: 10px;
  height: auto;
  width: 330px;
  background-color: black;
}

.input-container {
  margin: 10%;
  margin-bottom: 0;
  position: relative;
}
.search-form-left {
  position: absolute;
  top: 43%;
  transform: translateY(-50%);
  left: -20px;
}
.input-submit {
  text-align: center;
  margin-bottom: 25px;
}
.input-text {
  width: 210px;
}
.select-location {
  width: 90px;
  height: auto;
  position: absolute;
  top: 10px;
  left: 370px;
  background-color: white;
}
body,
html,
#container {
  width: 100%;
  height: 100%;
}
</style>
