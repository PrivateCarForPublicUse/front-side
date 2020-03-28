<template>
  <div class="container">
    <div class="total-container">
      <div class="box-containter">
        <p>总人数</p>
        <p>{{ totalUser }}</p>
      </div>
      <div class="box-containter">
        <p>总报销量</p>
        <p>{{ totalReimbursement }}</p>
      </div>
      <div class="box-containter">
        <p>总车辆</p>
        <p>{{ totalCar }}</p>
      </div>
    </div>
    <div class="element-container">
      <highcharts class="reimiburse-total" :options="ReimTotalChartOptions" />
    </div>
    <div class="element-container-small">
      <div class="reimiburse-first">
        <highcharts class="reimiburse-table" :options="ReimChartOptions" />
      </div>
      <div class="reimiburse-topN" div>
        <a class="topNTitle">报销金额Top5</a>
        <el-table
          :data="reimTopMonData"
          style="width: 80%;margin:0 auto"
          :cell-style="cellStyle"
          @cell-click="redirect"
          @cell-mouse-enter="showTips"
          @cell-mouse-leave="hideTips"
        >
          <el-table-column prop="name" label="员工" align="center" />
          <el-table-column prop="value" label="报销金额(元)" align="center" />
        </el-table>
      </div>
      <div class="reimiburse-topN" div>
        <a class="topNTitle">报销次数Top5</a>
        <el-table
          :data="reimTopTimData"
          style="width: 80%;margin:0 auto"
          :cell-style="cellStyle"
          @cell-click="redirect"
          @cell-mouse-enter="showTips"
          @cell-mouse-leave="hideTips"
        >
          <el-table-column prop="name" label="员工" align="center" />
          <el-table-column prop="value" label="报销次数" align="center" />
        </el-table>
      </div>
      <div v-show="show" class="tips">点击查看详情</div>
    </div>
    <div class="element-container-smaller">
      <div class="evaluate-table-contaniner">
        <highcharts class="evaluate-table" :options="EvaPerChartOptions" />
      </div>
      <div class="evaluate-table-contaniner">
        <highcharts class="evaluate-table" :options="EvaCarChartOptions" />
      </div>
      <div class="car-table-container">
        <div class="car-table-second" />
        <div class="car-table-first">
          <highcharts class="persent-table" :options="pieChartOptions" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getTotalReimburse,
  getTotulPerson,
  getTotulCar,
  getPriveateCar,
  getMoneyDec,
  getTimeDec
} from '@/api/reimburse-total'
import { Chart } from 'highcharts-vue'
import More from 'highcharts/highcharts-more'
import Highcharts from 'highcharts'
import SeriesLabel from 'highcharts/modules/series-label'
import exportingInit from 'highcharts/modules/exporting'
import '@/utils/string-to-date.js'
exportingInit(Highcharts)
SeriesLabel(Highcharts)
More(Highcharts)
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
    months: [
      '一月',
      '二月',
      '三月',
      '四月',
      '五月',
      '六月',
      '七月',
      '八月',
      '九月',
      '十月',
      '十一月',
      '十二月'
    ],
    noData: '没有数据',
    numericSymbols: ['千', '兆', 'G', 'T', 'P', 'E'],
    printChart: '打印图表',
    resetZoom: '恢复缩放',
    resetZoomTitle: '恢复图表',
    shortMonths: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec'
    ],
    thousandsSep: ',',
    weekdays: [
      '星期一',
      '星期二',
      '星期三',
      '星期四',
      '星期五',
      '星期六',
      '星期天'
    ]
  }
})
export default {
  name: 'HelloWorld',
  components: {
    highcharts: Chart
  },
  data() {
    return {
      reimTopTimData: null,
      reimTopMonData: null,
      pieChartOptions: {
        exporting: {
          enabled: false
        },
        chart: {
          type: 'pie',
          options3d: {
            enabled: true,
            alpha: 45
          }
        },
        title: {
          text: '',
          align: 'center',
          verticalAlign: 'middle'
        },
        plotOptions: {
          pie: {
            dataLabels: {
              enabled: true,
              distance: -20
            }
          }
        },
        credits: {
          enabled: false
        },
        series: [
          {
            size: '90%',
            type: 'pie',
            name: '公私车数量',
            innerSize: '30%',
            data: null
          }
        ]
      },
      EvaPerChartOptions: {
        credits: {
          enabled: false
        },
        exporting: {
          enabled: false
        },
        chart: {
          type: 'scatter',
          zoomType: 'xy'
        },
        title: {
          text: '人员星级'
        },
        xAxis: {
          title: {
            enabled: true,
            text: '借车次数'
          },
          startOnTick: true,
          endOnTick: true,
          showLastLabel: true
        },
        yAxis: {
          title: {
            text: '人员星级'
          },
          plotLines: [
            {
              color: 'black',
              dashStyle: 'dot',
              width: 2,
              value: 3, // 修改值
              label: {
                align: 'right',
                style: {
                  fontStyle: '微软雅黑'
                },
                text: '平均星级',
                x: -10
              },
              zIndex: 3
            }
          ]
        },
        legend: {
          enabled: false
        },
        plotOptions: {
          scatter: {
            marker: {
              radius: 5,
              states: {
                hover: {
                  enabled: true,
                  lineColor: 'rgb(100,100,100)'
                }
              }
            },
            states: {
              hover: {
                marker: {
                  enabled: false
                }
              }
            },
            tooltip: {
              headerFormat: null,
              pointFormat: '<b>{point.user}</b><br>{point.x}次, {point.y}星'
            }
          }
        },
        series: [
          {
            name: '借用车辆用户',
            color: 'rgba(223, 83, 83, .5)',
            data: [
              { x: 5, y: 1.5, user: '李小璐' },
              { x: 1, y: 5, user: '李大璐' }
            ]
          }
        ]
      },
      EvaCarChartOptions: {
        credits: {
          enabled: false
        },
        exporting: {
          enabled: false
        },
        chart: {
          type: 'scatter',
          zoomType: 'xy'
        },
        title: {
          text: '车辆星级'
        },
        xAxis: {
          title: {
            enabled: true,
            text: '借车次数'
          },
          startOnTick: true,
          endOnTick: true,
          showLastLabel: true
        },
        yAxis: {
          title: {
            text: '车辆星级'
          },
          plotLines: [
            {
              color: 'black',
              dashStyle: 'dot',
              width: 2,
              value: 2, // 修改值
              label: {
                align: 'right',
                style: {
                  fontStyle: '微软雅黑'
                },
                text: '平均星级',
                x: -10
              },
              zIndex: 3
            }
          ]
        },
        legend: {
          enabled: false
        },
        plotOptions: {
          scatter: {
            marker: {
              radius: 5,
              states: {
                hover: {
                  enabled: true,
                  lineColor: 'rgb(100,100,100)'
                }
              }
            },
            states: {
              hover: {
                marker: {
                  enabled: false
                }
              }
            },
            tooltip: {
              headerFormat: null,
              pointFormat:
                '<b>{point.owner} {point.name}</b><br>{point.x}次, {point.y}星'
            }
          }
        },
        series: [
          {
            name: '借用车辆用户',
            color: Highcharts.getOptions().colors[0],
            data: [
              { x: 5, y: 1.5, name: '浙A888888', owner: '李小璐' },
              { x: 1, y: 5, name: '浙A555555', owner: '李大璐' }
            ]
          }
        ]
      },
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
                color:
                  (Highcharts.theme && Highcharts.theme.textColor) || 'black'
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
        yAxis: [
          {
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
          },
          {
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
          }
        ],
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
            name: '未审核次数',
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
      },
      ReimChartOptions: {
        credits: {
          enabled: false
        },
        chart: {
          type: 'packedbubble',
          plotBorderWidth: 1
        },
        legend: {
          enabled: false
        },
        title: {
          text: '公司人员报销情况'
        },
        tooltip: {
          useHTML: true,
          pointFormat: '<b>{point.name}:</b> {point.y}元</sub>'
        },
        plotOptions: {
          series: {
            cursor: 'pointer',
            point: {
              events: {
                click: function() {
                  window.location.href =
                    '#/overview/employee/details/' + this.id
                }
              }
            }
          },
          packedbubble: {
            minSize: '30%',
            maxSize: '50%',
            zMin: 0,
            // zMax: 100,
            layoutAlgorithm: {
              splitSeries: false,
              gravitationalConstant: 0.02
            },
            dataLabels: {
              enabled: true,
              format: '{point.name}',
              filter: {
                property: 'y',
                operator: '>',
                value: 250
              },
              style: {
                color: 'black',
                textOutline: 'none',
                fontWeight: 'normal'
              }
            }
          }
        },
        series: [
          {
            name: '用户',
            data: null
          }
        ]
      },
      totalUser: 0,
      totalCar: 0,
      totalReimbursement: 0,
      show: false,
      listLoading: true
    }
  },
  created() {
    this.getReimburse()
    this.getCar()
    this.getPersonStar()
    this.getUserByMoneyDec()
    this.getUserByTimeDec()
  },
  methods: {
    cellStyle() {
      return 'padding:9px;cursor:pointer;'
    },
    redirect(row) {
      this.$router.push({ path: '/overview/employee/details/' + row.id })
    },
    showTips(row, column, cell, event) {
      this.show = true
      var div = document.getElementsByClassName('tips')[0]
      div.style =
        'left:' + (event.pageX - 200) + 'px;top:' + (event.pageY - 100) + 'px;'
    },
    hideTips() {
      this.show = false
    },
    getReimburse() {
      getTotalReimburse().then(response => {
        this.totalReimbursement = response.data.sum.money
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
      })
    },
    async getCar() {
      let priveteNum; let publicNum; const data = []
      await getPriveateCar(0).then(response => {
        this.totalCar = response.data.count
        priveteNum = response.data.length
        data.push(['私车', priveteNum])
      })
      await getPriveateCar(1).then(response => {
        this.totalCar = response.data.count
        publicNum = response.data.length
        data.push(['公车', publicNum])
      })
      this.pieChartOptions.series[0].data = data
      this.totalCar = priveteNum + publicNum
    },
    getPersonStar() {
      getTotulPerson().then(response => {
        // console.log(response.data)
      })
    },
    getUserByMoneyDec() {
      getMoneyDec().then(response => {
        const data = []
        response.data.forEach(ele => {
          data.push({ 'name': ele.user.name, 'id': ele.user.id, 'value': ele.sum })
        })
        this.ReimChartOptions.series[0].data = data
        if (data.length > 5) {
          this.reimTopMonData = data.slice(0, -5)
        } else {
          this.reimTopMonData = data
        }
      })
    },
    getUserByTimeDec() {
      getTimeDec().then(response => {
        const data = []
        response.data.forEach(ele => {
          data.push({ 'name': ele.user.name, 'id': ele.user.id, 'value': ele.times })
        })
        if (data.length > 5) {
          this.reimTopTimData = data.slice(0, -5)
        } else {
          this.reimTopTimData = data
        }
      })
    }
  }
}
</script>
<style scoped>
.total-container {
  height: 140px;
  width: 1000px;
  margin: 20px auto 0;
  line-height: 140px;
  background-color: white;
}
.box-containter {
  display: inline-block;
  vertical-align: middle;
  line-height: 0.5em;
  padding-top: 3px;
  margin: 0px 4%;
  height: 100px;
  width: 250px;
  background-color: rgb(190, 220, 248);
  text-align: center;
  font-size: 23px;
  font-weight: bolder;
  font-family: "微软雅黑", Arial, sans-serif;
  border-radius: 6px;
  color: #424242;
}
.reimiburse-total {
  width: 1000px;
  height: 350px;
}
.highcharts-container {
  width: 600px;
  height: 400px;
  margin: auto;
}
.container {
  background-color: #f0f2f5;
  overflow: hidden;
}
.element-container {
  width: 1000px;
  height: 350px;
  margin: 20px auto;
}
.element-container-small {
  width: 1000px;
  height: 300px;
  margin: 20px auto;
}
.element-container-smaller {
  width: 1000px;
  height: 250px;
  margin: 20px auto;
}
.reimiburse-first {
  display: inline-block;
}
.reimiburse-topN {
  text-align: center;
  padding-top: 8px;
  font-family: "微软雅黑", Arial, sans-serif;
  vertical-align: top;
  font-size: 18px;
  display: inline-block;
  width: 290px;
  height: 100%;
  margin-left: 5px;
  background-color: white;
}
.reimiburse-table {
  width: 400px;
  height: 300px;
}
.evaluate-table-contaniner {
  display: inline-block;
  width: 400px;
  height: 100%;
  margin-right: 5px;
  background-color: white;
}
.evaluate-table {
  height: 250px;
  width: 400px;
}
.car-table-container {
  display: inline-block;
  width: 180px;
}
.car-table-first {
  height: 180px;
}
.persent-table {
  height: 180px;
  width: 180px;
}
.car-table-second {
  margin-bottom: 5px;
  height: 65px;
  background-color: white;
}
.tips {
  font-size: 12px;
  text-align: center;
  color: white;
  position: absolute;
  border-radius: 5%;
  width: 80px;
  height: 25px;
  line-height: 25px;
  background-color: rgba(0, 0, 0, 0.5);
}
.topNTitle {
  cursor: default;
}
</style>
