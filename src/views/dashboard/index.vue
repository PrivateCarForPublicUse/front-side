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
          <el-form-item label="起点" class="input-label">
            <el-autocomplete
              v-model="start"
              popper-class="my-autocomplete"
              class="input-text"
              size="small"
              placeholder="出发地"
              :fetch-suggestions="querySearch"
              :trigger-on-focus="false"
              @focus="changeInputIndex(0)"
              @select="handleSelect"
            >
              <i
                slot="suffix"
                class="el-icon-location-outline"
              />
              <template slot-scope="{ item }">
                <div class="name">{{ item.value }}</div>
                <div class="addr">{{ item.district }}</div>
              </template>
            </el-autocomplete>
          </el-form-item>
          <el-form-item
            v-for="route in routeFormSubRoutes.length"
            :key="routeFormSubRoutes[route-1].key"
            :label="'途经'"
            class="input-label"
          >
            <el-autocomplete
              v-model="routeFormSubRoutes[route-1].value"
              popper-class="my-autocomplete"
              size="small"
              class="input-text"
              placeholder="途径节点"
              :fetch-suggestions="querySearch"
              :trigger-on-focus="false"
              @focus="changeInputIndex(route)"
              @select="handleSelect"
            >
              <i
                slot="suffix"
                class="el-icon-location-outline"
              />
              <template slot-scope="{ item }">
                <div class="name">{{ item.value }}</div>
                <div class="addr">{{ item.district }}</div>
              </template>
            </el-autocomplete>
            <svg-icon icon-class="delete" @click="deleteSubRoute(routeFormSubRoutes[route-1])" />
          </el-form-item>
          <el-form-item label="终点" prop="end" class="input-label">
            <el-autocomplete
              v-model="end"
              popper-class="my-autocomplete"
              size="small"
              class="input-text"
              placeholder="目的地"
              :fetch-suggestions="querySearch"
              :trigger-on-focus="false"
              @focus="changeInputIndex(-1)"
              @select="handleSelect"
            >
              <i
                slot="suffix"
                class="el-icon-location-outline"
              />
              <template slot-scope="{ item }">
                <div class="name">{{ item.value }}</div>
                <div class="addr">{{ item.district }}</div>
              </template>
            </el-autocomplete>
            <svg-icon icon-class="round_add_fill" @click="addSubRoute" />
          </el-form-item>
        </div>
        <el-form-item label="原因" class="input-label input-label-right">
          <div
            class="input-text"
          >
            <el-input
              v-model="inputReason"
              class="input-reason"
              :autosize="{ minRows: 2, maxRows: 3}"
              type="textarea"
              size="small"
              placeholder="申请理由和原因"
            />
          </div>
        </el-form-item>
        <el-form-item label="选择车辆类型" class="input-label input-car-label">
          <el-radio v-model="carPrivate" class="input-label" label="1">我的</el-radio>
          <el-radio v-model="carPrivate" label="2">共有</el-radio>

        </el-form-item>
        <el-form-item label="车辆" class="input-label input-label-right">
          <el-input
            v-model="chooseCar"
            class="input-text"
            size="small"
            placeholder="选择出行车辆"
          />
        </el-form-item>
        <el-form-item label="开始" class="input-label input-label-right">
          <div class="block">
            <el-date-picker
              v-model="inputStartTime"
              size="small"
              type="datetime"
              align="right"
              placeholder="开始用车时间"
              :default-time="'12:00:00'"
            />
          </div>
        </el-form-item>
        <el-form-item label="结束" class="input-label input-label-right">
          <div class="block">
            <el-date-picker
              v-model="inputFinishTime"
              size="small"
              type="datetime"
              align="right"
              placeholder="结束用车时间"
              :default-time="'18:00:00'"
            />
          </div>
        </el-form-item>
        <div
          class="input-submit"
        >
          <el-button size="small" class="submit-button">提交申请</el-button>
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
import cityslist from '@/utils/city.js'
export default {
  name: 'Dashboard',
  data() {
    return {
      adviceList: [],
      start: '',
      end: '',
      inputReason: '',
      routeFormSubRoutes: [],
      currentInputIndex: -1,
      citys: [],
      options: [],
      chooseCity: '',
      map: null,
      markers: [],
      currentCity: '',
      inputStartTime: '',
      inputFinishTime: '',
      carPrivate: '1',
      chooseCar: '',
      chooseCarId: ''
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ]),
    routeFormRoutes() {
      let index; let temp = []
      for (index in this.routeFormSubRoutes) {
        temp.push(this.routeFormSubRoutes[index].value)
      }
      temp.unshift(this.start)
      temp.push(this.end)
      return temp
    }
  },
  mounted() {
    this.init()
  },
  created() {
    this.initcitys()
    for (var index = 0; index < this.citys.length; index++) {
      this.options.push({ value: this.citys[index], label: this.citys[index] })
    }
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
          if (result.tips instanceof Array) {
            for (var tip = 0; tip < result.tips.length; tip++) {
              // console.log(result.tips[tip])
              values.push({ value: result.tips[tip].name, district: result.tips[tip].district + result.tips[tip].address, location: result.tips[tip].location })
            }
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
    handleSelect(item) {
      let that = this
      if (item.location instanceof AMap.LngLat) {
        if (item.district.match('自治区') !== null) {
          try {
            this.chooseCity = item.district.split('自治区')[1].split('市')[0]
          } catch (e) {
            console.log('没有具体信息')// 优化可以做定位
          }
        } else if (item.district.match('台湾') !== null) {
          this.chooseCity = '台湾'
        } else if (item.district.match('特别行政区') !== null) {
          this.chooseCity = item.district.split('特别行政区')[0]
        } else {
          try {
            console.log(item.district)
            this.chooseCity = item.district.split('省')[1].split('市')[0]
          } catch (e) {
            console.log('没有具体信息')// 优化可以做定位
          }
        }
        that.map.setZoom(13)
        that.map.setCenter(item.location)
        that.addMarker(this.currentInputIndex, item.location)
      }
    },
    addSubRoute() {
      this.routeFormSubRoutes.push({
        value: '',
        key: Date.now()
      })
    },
    addMarker(index, position) {
      let that = this
      try {
        let oldmarker = that.markers[index]
        oldmarker.setPosition(position)
      } catch (e) {
        AMapUI.loadUI(['overlay/SimpleMarker'], function(SimpleMarker) {
          if (index === 0) {
            var startmarker = new SimpleMarker({
              iconLabel: {
                innerHTML: '起',
                style: {
                  color: '#fff',
                  fontSize: '90%',
                  marginTop: '2px'
                }},
              iconTheme: 'default',
              iconStyle: 'blue',
              map: that.map
            })
            that.map.add(startmarker)
            that.markers[index] = startmarker
          } else if (index === -1) {
            var endmarker = new SimpleMarker({
              iconLabel: {
                innerHTML: '终',
                style: {
                  color: '#fff',
                  fontSize: '90%',
                  marginTop: '2px'
                }},
              iconTheme: 'default',
              iconStyle: 'red',
              map: that.map
            })
            that.map.add(endmarker)
            that.markers[index] = endmarker
          } else {
            var viamarker = new SimpleMarker({
              iconLabel: {
                innerHTML: '经',
                style: {
                  color: '#fff',
                  fontSize: '90%',
                  marginTop: '2px'
                }},
              iconTheme: 'default',
              iconStyle: 'green',
              map: that.map
            })
            that.map.add(viamarker)
            that.markers[index] = viamarker
          }
        })
      }
    },
    removeMarker(index) {
      let that = this
      try {
        that.map.remove(that.markers[index])
        delete that.markers[index]
      // eslint-disable-next-line no-empty
      } catch (e) {}
    },
    deleteSubRoute(item) {
      var index = this.routeFormSubRoutes.indexOf(item)
      if (index !== -1) {
        this.routeFormSubRoutes.splice(index, 1)
      }
      this.removeMarker(index + 1)
    },
    changeStartAndEnd() {
      let temp = this.start
      this.start = this.end
      this.end = temp
      try {
        let startPosition = this.markers['0'].getPosition()
        try {
          let stopPosition = this.markers['-1'].getPosition()
          this.markers['0'].setPosition(stopPosition)
          this.markers['-1'].setPosition(startPosition)
        } catch (e) {
          this.removeMarker(0)
          this.addMarker(-1, startPosition)
        }
      } catch (e) {
        try {
          let stopPosition = this.markers['-1'].getPosition()
          this.removeMarker(-1)
          this.addMarker(0, stopPosition)
        } catch (e) {
          console.log('没有需要交换的标记')
        }
      }
    },
    changeInputIndex(index) {
      this.currentInputIndex = index
    },
    initcitys() {
      let i; let j; let that = this
      for (i in cityslist) {
        for (j in cityslist[i].city) {
          that.citys.push(cityslist[i].city[j].name)
        }
      }
    },
    init() {
      let that = this
      MapLoader().then(AMap => {
        that.map = new AMap.Map('container', {
          resizeEnable: true,
          zoom: 10,
          lang: 'cn'
        })
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
              that.currentCity = that.chooseCity
            }
          })
        })
        AMap.plugin('AMap.Geolocation', () => {
          var geolocation = new AMap.Geolocation({
            enableHighAccuracy: false, // 是否使用高精度定位，默认:true
            timeout: 10000, // 超过10秒后停止定位，默认：5s
            buttonPosition: 'RB', // 定位按钮的停靠位置
            buttonOffset: new AMap.Pixel(15, 140), // 定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
            zoomToAccuracy: false // 定位成功后是否自动调整地图视野到定位点
          })
          that.map.addControl(geolocation)
          geolocation.getCurrentPosition((status, result) => {
            if (status !== 'complete') {
              console.log('定位失败')
            }
          })
          AMap.event.addListener(geolocation, 'complete', () => {
            that.chooseCity = that.currentCity
          })
        })
        initAMapUI()
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
  width: 320px;
  border-radius: 5px;
  background-color: rgb(48, 65, 86);
}

.input-container {
  margin: 25px;
  margin-bottom: 0;
  margin-right: 15px;
  position: relative;
}
.search-form-left {
  position: absolute;
  top: 48%;
  transform: translateY(-50%);
  left: -20px;
}
.input-submit {
  text-align: center;
  margin-bottom: 25px;
}
.input-text {
  width: 220px;
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
.input-car-label{
  margin-left: 25px;
}
.el-form--inline >>> .el-form-item{
  margin-bottom: 7px;
  margin-right: 0;
}
.input-label-right{
  margin-left: 25px;
}
.my-autocomplete .addr >>>{
  position: relative;
  top:-8px;
  font-size: 12px;
  color: #b4b4b4;
}
.my-autocomplete .name >>>{
  text-overflow: ellipsis;
  overflow: hidden;
}
.submit-button{
  font-size: 14px;
  color: rgb(48, 65, 86);
}
.input-reason{
  margin-bottom: 5px;
  margin-top:5px;
}
.input-label>>>.el-radio__label {
  color: white
}

.input-car>>>.el-input--small{
  width:190px;
}
</style>
