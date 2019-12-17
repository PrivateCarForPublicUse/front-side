/* eslint-disable prefer-const */
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
            <svg-icon icon-class="sorting" @click="changeStartAndEnd" />
          </div>
          <el-form-item label="起" class="input-label">
            <el-autocomplete
              v-model="start"
              class="input-text"
              placeholder="出发地"
              :fetch-suggestions="querySearch"
              :trigger-on-focus="false"
            />
          </el-form-item>
          <el-form-item
            v-for="route in routeFormSubRoutes.routes"
            :key="route.key"
            :label="'经'"
            class="input-label"
          >
            <el-autocomplete
              v-model="route.value"
              class="input-text"
              placeholder="途径节点"
              :fetch-suggestions="querySearch"
              :trigger-on-focus="false"
            />
            <svg-icon icon-class="delete" @click="deleteSubRoute(route)" />
          </el-form-item>
          <el-form-item label="终" prop="end" class="input-label">
            <el-autocomplete
              v-model="end"
              class="input-text"
              placeholder="目的地"
              :fetch-suggestions="querySearch"
              :trigger-on-focus="false"
            />
            <svg-icon icon-class="round_add_fill" @click="addSubRoute" />
          </el-form-item>
        </div>
        <div class="input-submit">
          <el-button>提交</el-button>
        </div>
      </el-form>
    </div>
    <div class="select-location">
      <el-select
        v-model="chooseCity"
        filterable
        placeholder="请选择"
        @change="handleChangeCenter"
      >
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
      adviceList: [],
      start: '',
      end: '',
      routeFormSubRoutes: {
        routes: []
      },
      citys: ['北京', '杭州', '上海', '宁波'],
      options: [],
      chooseCity: '',
      map: null
      // chooseCityIndex: 0
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
  },
  created() {
    for (var index = 0; index < this.citys.length; index++) {
      this.options.push({ value: this.citys[index], label: this.citys[index] })
    }
    this.init()
    console.log('创建')
  },
  methods: {
    querySearch(queryString, cb) {
      AMap.plugin('AMap.Autocomplete', (currentCity = this.chooseCity, keyword = queryString) => {
        // 实例化Autocomplete
        var autoOptions = {
          // city 限定城市，默认全国
          city: currentCity
        }
        var autoComplete = new AMap.Autocomplete(autoOptions)
        autoComplete.search(keyword, (status, result) => {
          // 搜索成功时，result即是对应的匹配数据
          var values = []
          for (var tip = 0; tip < result.tips.length; tip++) {
            console.log(result.tips[tip])
            values.push({ value: result.tips[tip].name })
          }
          cb(values)
        })
      })
    },
    handleChangeCenter() {
      var address = this.chooseCity + '市'
      AMap.plugin('AMap.Geocoder', () => {
        var geocoder = new AMap.Geocoder()
        geocoder.getLocation(address, (status, result) => {
          if (status === 'complete' && result.info === 'OK') {
            // 经纬度
            var lng = result.geocodes[0].location.lng
            var lat = result.geocodes[0].location.lat
            var position = new AMap.LngLat(lng, lat)
            this.map.setCenter(position)
          }
        })
      })
    },
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
    changeStartAndEnd() {
      const temp = this.start
      this.start = this.end
      this.end = temp
    },
    init() {
      // eslint-disable-next-line prefer-const
      let that = this
      MapLoader().then(AMap => {
        that.map = new AMap.Map('container', {
          resizeEnable: true,
          zoom: 10,
          lang: 'cn'
        })
        console.log('inmap')
        AMap.plugin(['AMap.ToolBar', 'AMap.Scale'], () => {
          that.map.addControl(new AMap.ToolBar({ position: 'RB', liteStyle: true }))
          that.map.addControl(new AMap.Scale())
        })
        AMap.plugin('AMap.CitySearch', () => {
          var citySearch = new AMap.CitySearch()
          citySearch.getLocalCity((status, result) => {
            if (status === 'complete' && result.info === 'OK') {
              // 查询成功，result即为当前所在城市信息
              that.chooseCity = result.city.slice(0, -1)
            }
          })
        })
      }, e => {
        console.log('地图加载失败', e)
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
  border-radius: 5px;
  background-color: rgb(48, 65, 86);
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
.input-label >>> .el-form-item__label {
  color: white;
  font-weight: normal;
}
</style>
