<template>
  <div class="container">
    <div class="header-container">
      <div class="header-container bgimg" />
      <div class="user-container">
        <div class="img-container">
          <img :src="headUrl" width="80px" height="80px">
        </div>
        <div class="words-container">
          <p>{{ name }}</p>
          <span>工号：{{ jobId }}</span>
          <span class="stars">{{ star }}星</span>
        </div>
      </div>
    </div>
    <div class="body-container">
      <div class="charts-container">
        <div class="charts-pic-container">
          <highcharts class="reimiburse-table" :options="ReimTotalChartOptions" />
        </div>
        <div class="charts-sum-container">
          <div class="box-container">
            <p>总报销次数</p>
            <p>{{ totalReimTimes }}</p>
          </div>
          <div class="box-container">
            <p>总报销金额</p>
            <p>{{ totalReimMon }}</p>
          </div>
          <div class="box-container">
            <p>总取消次数</p>
            <p>{{ totalCancelTimes }}</p>
          </div>
        </div>
      </div>
      <p class="title">车辆列表</p>
      <div class="table-list-container">
        <el-table
          :data="tableData"
          style="width: 100%"
        >
          <el-table-column
            align="center"
            prop="carNum"
            label="车牌号"
            width="333"
          />
          <el-table-column
            align="center"
            prop="carType"
            label="车型"
            width="333"
          />
          <el-table-column
            align="center"
            prop="carStar"
            label="车辆星级"
          />
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
import { Chart } from 'highcharts-vue'
import Highcharts from 'highcharts'
import exportingInit from 'highcharts/modules/exporting'
import { getUserInfo, getCarInfo, getReimburseById } from '@/api/reimburse-total'
import '@/utils/string-to-date.js'
exportingInit(Highcharts)
Highcharts.setOptions({
  lang: {
    viewFullscreen: '全屏查看',
    contextButtonTitle: '图表导出菜单',
    decimalPoint: '.',
    downloadJPEG: '下载JPEG图片',
    downloadPDF: '下载PDF文件',
    downloadPNG: '下载PNG文件',
    downloadSVG: '下载SVG文件',
    drillUpText: '返回 {series.name}',
    loading: '加载中',
    months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
    noData: '没有数据',
    numericSymbols: ['千', '兆', 'G', 'T', 'P', 'E'],
    printChart: '打印图表',
    resetZoom: '恢复缩放',
    resetZoomTitle: '恢复图表',
    shortMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    thousandsSep: ',',
    weekdays: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期天']
  }
})
export default {
  components: {
    highcharts: Chart
  },
  data() {
    return {
      id: 0,
      name: 'details',
      headUrl: require('@/icons/jpg/default_head.jpg'),
      star: 3.5,
      jobId: 135,
      totalReimTimes: 0,
      totalReimMon: 0,
      totalCancelTimes: 5,
      tableData: [],
      ReimTotalChartOptions: {
        credits: {
          enabled: false
        },
        lang: {
          resetZoom: '恢复缩放'
        },
        chart: {
          zoomType: 'x'
        },
        exporting: {
          enabled: true
        },
        title: {
          text: '报销情况总览'
        },
        labels: {
          items: [
            {
              style: {
                left: '50px',
                top: '18px',
                color: (Highcharts.theme && Highcharts.theme.textColor) || 'black'
              }
            }
          ]
        },
        xAxis: {
          type: 'datetime',
          dateTimeLabelFormats: {
            millisecond: '%H:%M:%S.%L',
            second: '%H:%M:%S',
            minute: '%H:%M',
            hour: '%H:%M',
            day: '%Y-%m-%d',
            week: '%m-%d',
            month: '%Y-%m',
            year: '%Y'
          }
        },
        yAxis: [{
          gridLineWidth: 0,
          title: {
            text: '金额',
            style: {
              color: Highcharts.getOptions().colors[0]
            }
          },
          labels: {
            format: '{value} 元',
            style: {
              color: Highcharts.getOptions().colors[0]
            }
          },
          opposite: true
        }, {
          gridLineWidth: 0,
          title: {
            text: '次数',
            style: {
              color: Highcharts.getOptions().colors[1]
            }
          },
          labels: {
            style: {
              color: Highcharts.getOptions().colors[1]
            }
          },
          allowDecimals: false
        }],
        tooltip: {
          dateTimeLabelFormats: {
            millisecond: '%H:%M:%S.%L',
            second: '%H:%M:%S',
            minute: '%H:%M',
            hour: '%H:%M',
            day: '%Y-%m-%d',
            week: '%m-%d',
            month: '%Y-%m',
            year: '%Y'
          }
        },
        series: [
          {
            type: 'column',
            name: '未报销次数',
            yAxis: 1,
            data: null
          },
          {
            type: 'spline',
            name: '已报销金额',
            data: null,
            marker: {
              lineWidth: 2,
              lineColor: Highcharts.getOptions().colors[3],
              fillColor: 'white'
            }
          },
          {
            type: 'spline',
            name: '未审核金额',
            data: null,
            marker: {
              lineWidth: 2,
              lineColor: Highcharts.getOptions().colors[3],
              fillColor: 'white'
            }
          },
          {
            type: 'spline',
            name: '未通过报销金额',
            data: null,
            marker: {
              lineWidth: 2,
              lineColor: Highcharts.getOptions().colors[3],
              fillColor: 'white'
            }
          }
        ]
      }
    }
  },
  created() {
    this.id = this.$route.params.id
    this.getUser()
    this.getReimburse()
    this.getCar()
  },
  methods: {
    getUser() {
      getUserInfo(this.id).then(response => {
        this.name = response.data.name
        this.star = response.data.starLevel
        this.jobId = response.data.workNumber
        if (response.data.headPhotoUrl) {
          // TODO
          // this.headUrl = require(response.data.headPhotoUrl)
        }
      })
    },
    getCar() {
      getCarInfo(this.id).then(response => {
        response.data.forEach(item => {
          this.tableData.push({
            carNum: item.license,
            carType: item.band,
            carStar: item.starOfCar })
        })
      })
    },
    getReimburse() {
      getReimburseById(this.id).then(response => {
        const countTimes = []; const countReject = []; const counted = []; const counting = []
        response.data.dataOfEveryDay.forEach(day => {
          const dateTime = day.date.toDate().getTime()
          if (day.imbursed.money > 0) {
            counted.push([dateTime, day.imbursed.money])
          }
          if (day.isimbursing.money > 0) {
            counting.push([dateTime, day.isimbursing.money])
            countTimes.push([dateTime, day.isimbursing.time])
          }
          if (day.rejected.money > 0) {
            countReject.push([dateTime, day.rejected.money])
          }
        })
        this.ReimTotalChartOptions.series[0].data = countTimes
        this.ReimTotalChartOptions.series[1].data = counted
        this.ReimTotalChartOptions.series[2].data = counting
        this.ReimTotalChartOptions.series[3].data = countReject
        this.totalReimMon = response.data.sum.money
        this.totalReimTimes = response.data.sum.time
      })
    }
  }
}
</script>
<style scoped>
.container{
  background-color: #f0f2f5;
  overflow:hidden;
}
.header-container{
  height:180px;
}
.stars{
  /* display: inline-block; */
  border-radius: 3px;
  background-color: orange;
  border:2px solid orange;
  border-left: 4px solid orange;
  border-right: 4px solid orange;
}
.img-container{
  display: inline-block;
  height:80px;
  width:80px;
  border-radius: 50%;
  border: 2px solid #f0f2f5;
  overflow: hidden;
}
.bgimg{
  background-image: url('../../../icons/jpg/bg1.jpg');
  background-size: 100% 100%;
}
.user-container{
  position: absolute;
  top:60px;
  left:50px;
  /* background-image: url('bg1.jpg') ; */
}
.words-container{
  display: inline-block;
  line-height: 0.5em;
  vertical-align: top;
  margin-top: 10px;
  margin-left: 15px;
}
.words-container span{
  font-size: 13px;
  font-family: '微软雅黑', Arial, sans-serif;
  color: #f0f2f5;
}
.words-container p{
  font-size: 20px;
  font-weight: bold;
  font-family: '微软雅黑', Arial, sans-serif;
  color: #f0f2f5;
}
.body-container{
  width:1000px;
  margin:0 auto;
  overflow: hidden;
}
.charts-pic-container{
  height: 350px;
  width:800px;
  background-color: white;
  margin-right:10px;
  display: inline-block;
}
.reimiburse-table{
  height:350px;
}
.charts-sum-container{
  height:350px;
  width:185px;
  display: inline-block;
  vertical-align: top;
  background-color: white;
}
.box-container{
  height:80px;
  width:160px;
  padding-top: 2px;
  margin:27px auto 0;
  background-color: rgb(190, 220, 248);
  vertical-align: middle;
  line-height:0.5em;
  text-align: center;
  font-size: 20px;
  font-weight: bolder;
  font-family: '微软雅黑', Arial, sans-serif;
  border-radius: 6px;
}
.table-list-container{
  padding-left: 5%;
  padding-right: 5%;
  margin:0 auto 20px;
  background-color: white;
}
.title{
  font-size: 23px;
  font-weight: bold;
  font-family: '微软雅黑', Arial, sans-serif;
  line-height: 0;
}
</style>
