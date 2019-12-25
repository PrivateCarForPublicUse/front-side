/* eslint-disable vue/no-parsing-error */
<template>
  <div class="dashboard-container">
    <div class="amap-wrapper">
      <!-- <el-amap vid="amap" :plugin="plugin" class="amap-demo" :center="center" /> -->
      <div id="container" />
    </div>
    <div class="input-box">
      <el-form ref="applyForm" :model="applyForm" :inline="true" :rules="rules">
        <div class="input-container">
          <div class="search-form-left">
            <svg-icon icon-class="sorting" @click="changeStartAndEnd" />
          </div>
          <el-form-item label="起点" class="input-label" prop="start">
            <el-autocomplete
              v-model="applyForm.start"
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
          <div class="input-label">
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
          </div>

          <el-form-item label="终点" prop="end" class="input-label">
            <el-autocomplete
              v-model="applyForm.end"
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
        <el-form-item label="原因" class="input-label input-label-right" prop="inputReason">
          <div
            class="input-text"
          >
            <el-input
              v-model="applyForm.inputReason"
              class="input-reason"
              :autosize="{ minRows: 2, maxRows: 3}"
              type="textarea"
              size="small"
              placeholder="申请理由和原因"
            />
          </div>
        </el-form-item>
        <el-form-item label="开始" class="input-label input-label-right" prop="inputStartTime">
          <div class="block">
            <el-date-picker
              v-model="applyForm.inputStartTime"
              size="small"
              type="datetime"
              align="right"
              placeholder="开始用车时间"
              :default-time="'12:00:00'"
            />
          </div>
        </el-form-item>
        <el-form-item label="结束" class="input-label input-label-right" prop="inputFinishTime">
          <div class="block">
            <el-date-picker
              v-model="applyForm.inputFinishTime"
              size="small"
              type="datetime"
              align="right"
              placeholder="结束用车时间"
              :default-time="'18:00:00'"
            />
          </div>
        </el-form-item>
        <el-form-item label="选择车辆类型" class="input-label input-label-right">
          <el-radio v-model="applyForm.carPrivate" label="1">我的</el-radio>
          <el-radio v-model="applyForm.carPrivate" label="2">共有</el-radio>
        </el-form-item>
        <el-form-item label="车辆" class="input-label input-label-right">
          <el-input
            v-model="applyForm.chooseCar"
            class="input-text"
            size="small"
            placeholder="选择出行车辆"
            @focus="handleShowDialog"
          />
        </el-form-item>
        <div
          class="input-submit"
        >
          <el-button size="small" class="submit-button" @click="submitForm('applyForm')">提交申请</el-button>
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
    <div>
      <el-dialog class="dialog-small" title="选择车辆" :visible.sync="dialogTableVisible" center>
        <el-table
          stripe
          :data="carData"
        >
          <el-table-column property="band" label="车牌" width="100" align="center" />
          <el-table-column property="type" label="车型" width="100" align="center" />
          <el-table-column label="选择" align="center" width="100">
            <template slot-scope="scope">
              <el-button
                size="small"
                type="primary"
                align="center"
                @click="handleChooseCar(scope.row.id, scope.row.band,scope.row.type)"
              >选择</el-button>
            </template>
          </el-table-column>
        </el-table>

      </el-dialog>
    </div>
    <div>
      <el-dialog title="选择车辆" :visible.sync="dialogPublicTableVisible" center>
        <el-table
          stripe
          :data="carData"
        >
          <el-table-column property="band" label="车牌" width="100" align="center" />
          <el-table-column property="user" label="车主" width="100" align="center" />
          <el-table-column property="StarOfCar" label="星级" width="100" align="center" />
          <el-table-column label="用车时间" align="center" width="200">
            <template slot-scope="scope">
              {{ scope.row.startTime }}-{{ scope.row.endTime }}
            </template>
          </el-table-column>
          <el-table-column label="选择" align="center" width="100">
            <template slot-scope="scope">
              <el-button
                size="small"
                type="primary"
                align="center"
                @click="handleChooseCar(scope.row.id,scope.row.band,scope.row.type)"
              >选择</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import MapLoader from '@/utils/map-loader.js'
import cityslist from '@/utils/city.js'
import { applyCar, getCarByTime } from '@/api/applyCar.js'
export default {
  name: 'Dashboard',
  data() {
    var validateStart = (rule, value, callback) => {
      if (value === '' || value === null) {
        callback(new Error('出发地不能为空'))
      } else if (this.checkHasMarker(0)) {
        callback(new Error('请确定具体位置'))
      } else {
        callback()
      }
    }
    var validateEnd = (rule, value, callback) => {
      if (value === '' || value === null) {
        callback(new Error('目的地不能为空'))
      } else if (this.checkHasMarker(-1)) {
        callback(new Error('请确定具体位置'))
      } else {
        callback()
      }
    }
    var validReason = (rule, value, callback) => {
      if (value === '' || value === null) {
        callback(new Error('原因不能为空'))
      } else if (value.length > 72) {
        callback(new Error('理由不能超过72个字符'))
      } else {
        callback()
      }
    }
    var validateTimeStart = (rule, value, callback) => {
      if (value === null) {
        callback(new Error('时间不能为空'))
      } else if (value.getTime() + 1000 < Date.now()) {
        callback(new Error('不能选择已经过去的时间点'))
      } else {
        if (this.applyForm.inputFinishTime !== '') {
          this.$refs.applyForm.validateField('inputFinishTime')
        }
        callback()
      }
    }
    var validateTimeEnd = (rule, value, callback) => {
      if (value === null) {
        callback(new Error('时间不能为空'))
      } else if (this.applyForm.inputStartTime === null) {
        callback(new Error('需先填写开始时间'))
      } else if (value.getTime() < this.applyForm.inputStartTime.getTime()) {
        callback(new Error('结束时间不能晚于开始时间'))
      } else {
        callback()
      }
    }
    return {
      applyForm: {
        start: '',
        end: '',
        inputReason: '',
        inputStartTime: null,
        inputFinishTime: null,
        carPrivate: '1',
        chooseCar: ''
      },
      rules: {
        start: [{ validator: validateStart, trigger: 'blur' }],
        end: [{ validator: validateEnd, trigger: 'blur' }],
        inputReason: [{ validator: validReason, trigger: 'blur' }],
        inputStartTime: [{ validator: validateTimeStart, trigger: 'blur' }],
        inputFinishTime: [{ validator: validateTimeEnd, trigger: 'blur' }]
      },
      adviceList: [],
      routeFormSubRoutes: [],
      currentInputIndex: -1,
      citys: [],
      options: [],
      chooseCity: '',
      map: null,
      markers: [],
      currentCity: '',
      chooseCarId: '',
      dialogTableVisible: false,
      dialogPublicTableVisible: false,
      carData: null,
      // 测试数据
      testCarData: [{
        id: 1,
        isUse: 0,
        band: '123453',
        user: 'kinkin',
        type: '宝马',
        StarOfCar: 2.5,
        startTime: '00:09:00',
        endTime: '00:18:00'
      }]
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
      temp.unshift(this.applyForm.start)
      temp.push(this.applyForm.end)
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
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
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
    handleShowDialog() {
      let params = { 'startTime': this.startTime, 'endTime': this.endTime, 'isMine': this.carPrivate }
      getCarByTime(params).then(response => {
        this.carData = response.data
        // this.listLoading = false
        if (this.applyForm.carPrivate === '1') {
          this.dialogTableVisible = true
        } else {
          this.dialogPublicTableVisible = true
        }
      })
    },
    handleChooseCar(val, band, type) {
      this.chooseCarId = val
      this.dialogPublicTableVisible = false
      this.dialogTableVisible = false
      this.applyForm.chooseCar = band + '-' + type
    },
    handleSelect(item) {
      let that = this
      if (item.location instanceof AMap.LngLat) {
        let district = that.getLocationByDistrict(item.district)
        if (district !== -1) {
          this.chooseCity = district
        } else {
          console.log(没有具体信息)
        }
        that.map.setZoom(13)
        that.map.setCenter(item.location)
        that.addMarker(this.currentInputIndex, item.location)
      }
    },
    getLocationByDistrict(district) {
      if (district.match('自治区') !== null) {
        try {
          this.chooseCity = district.split('自治区')[1].split('市')[0]
        } catch (e) {
          return -1
        }
      } else if (district.match('台湾') !== null) {
        return '台湾'
      } else if (district.match('特别行政区') !== null) {
        return district.split('特别行政区')[0]
      } else {
        try {
          return district.split('省')[1].split('市')[0]
        } catch (e) {
          return -1
        }
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
            startmarker.setPosition(position)
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
            endmarker.setPosition(position)
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
            viamarker.setPosition(position)
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
    checkHasMarker(index) {
      let that = this
      try {
        that.markers[index]
        return true
      } catch (e) {
        return false
      }
    },
    deleteSubRoute(item) {
      var index = this.routeFormSubRoutes.indexOf(item)
      if (index !== -1) {
        this.routeFormSubRoutes.splice(index, 1)
      }
      this.removeMarker(index + 1)
    },
    changeStartAndEnd() {
      let temp = this.applyForm.start
      this.applyForm.start = this.applyForm.end
      this.applyForm.end = temp
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
              if (result.city.match('市') !== null || result.city.match('省') !== null) { that.chooseCity = result.city.slice(0, -1) } else if (result.city.match('特别行政区') !== null) { that.chooseCity = result.city.slice(0, -5) } else {
                that.chooseCity = result.city
              }
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
  width: 325px;
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
.dialog-small{
  margin: 0 auto;
  padding: 0 290px;
}
.input-label>>>.el-form-item__error{
    font-size: 10px;
    line-height: 0.5;
    padding-top: 0px;
}
</style>
