<template>
  <div>
    <div class="centen"><el-link type="warning"><h1>更新时间:{{disaster.date}}</h1></el-link></div>
    <div class="tag">
      <el-tag type="success" style=" font-size: 20px;">治愈人数:{{disaster.cured}}</el-tag>
      <el-tag type="info" style=" font-size: 20px;">疑似病例人数:{{disaster.suspect}}</el-tag>
      <el-tag type="warning" style=" font-size: 20px;">	重症人数:{{disaster.serious}}</el-tag>
      <el-tag type="danger" style=" font-size: 20px;">死亡人数:{{disaster.death}}</el-tag>
      <el-tag type="danger" style=" font-size: 20px;">确诊人数:{{disaster.diagnosed}}</el-tag>
    </div>
    <div id="chart" class="chart" ref="filet" width="1000" height="500"></div>
  </div>
</template>

<script>
const echarts = require("echarts/lib/echarts");
// 引入中国地图数据
require("echarts/map/js/china");
// 引入提示框和
require("echarts/lib/component/tooltip");
// 引入标题组件
require("echarts/lib/component/title");
require("echarts/lib/component/legendScroll");
import { request } from "../network/request";
// import { request } from 'http';
import axios from "axios";
export default {
  name: "Home",
  data() {
    return {
      disaster: ''
    };
  },
  mounted() {
    this.myChart = this.$echarts.init(document.getElementById("chart"));
    this.axiosList();
    window.onresize = () => {
      this.$refs.filet.myChart.resize();
    };
    // window.onresize = function() {
    //   this.drawChart(list);
    // };
  },
  methods: {
    axiosList() {
      request({
        url: "/api",
        params: {
          version: "epidemic",
          appid: "23035000",
          appsecret: "8YvlPNrm",
          vue: 1
        }
      }).then(res => {
        console.log(res.data.data);
        let names = res.data.data;

        let list = res.data.data.area.map(item => ({
          name: item.provinceName,
          value: item.currentConfirmedCount, //确认人数
          cureName: item.suspectedCount, //可疑人数
          deathNum: item.deadCount //死亡人数
        }));
        // window.onresize = function(){
        this.drawChart(list);
        // }
        let obj = {
          date: names.date, //跟新时间
          diagnosed: names.diagnosed, //确诊人数
          suspect: names.suspect, //疑似病例人数
          death: names.death, //死亡人数
          cured: names.cured, //治愈人数
          serious: names.serious //重症人数
        };
        this.disaster = obj
      });
    },
    drawChart(res) {
      //地图控件
      var data = res;
      let option = {
        title: {
          text: "新型冠状病毒分布图",
          align: "center"
        },
        tooltip: {
          formatter: function(res) {
            //格式话数据
            return `
                        ${res.data.name}<br/>
                        确认人数:${res.data.value}<br/>
                        可疑计数:${res.data.cureName}<br/>
                        死亡人数:${res.data.deathNum}
                        `;
          }
        },
        layoutCenter: ["100%", "100%"],
        visualMap: {
          min: 0,
          max: 500,
          left: "left",
          top: "bottom",
          text: ["High", "Low"],
          seriesIndex: [1],
          inRange: {
            color: ["#e0ffff", "#006edd"]
          },
          calculable: true
        },
        geo: {
          map: "china",
          roam: true,
          label: {
            show: true,
            color: "rgba(0,0,0,0.4)"
          },
          itemStyle: {
            borderColor: "rgba(0, 0, 0, 0.2)"
          },
          emphasis: {
            itemStyle: {
              areaColor: null,
              shadowOffsetX: 0,
              shadowOffsetY: 0,
              shadowBlur: 20,
              borderWidth: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)"
            }
          }
        },
        series: [
          {
            type: "scatter",
            aspectScale: 105, //长宽比
            coordinateSystem: "geo",
            // data: convertData(data),
            symbolSize: 20,
            // symbol:
            //   "path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z",
            symbolRotate: 35,
            label: {
              formatter: "{b}",
              position: "right",
              show: false
            },
            itemStyle: {
              color: "#F06C00"
            },
            zoom: 1.2,
            grid: {
              left: "30px",
              right: "100px",
              top: "10px",
              bottom: "30px"
            },
            emphasis: {
              label: {
                show: true
              }
            }
          },
          {
            name: "",
            type: "map",
            geoIndex: 0,
            data: res
          }
        ]
      };
      this.myChart.setOption(option);
      this.myChart.on("click", res => {
        this.$notify({
          title: "成功",
          message: `
           ${res.data.name}
         确认人数:${res.data.value}
          可疑计数:${res.data.cureName}
          死亡人数:${res.data.deathNum}
          `,
          type: "success"
        });
      });
    }
  }
};
</script>
<style>
#chart {
  width: 800px;
  height: 500px;
  margin: 0 auto;
}
.centen{
  text-align: center;
}
.tag{
  width: 80%;
  display: flex;
  margin: 30px auto;
  justify-content: space-around; 
}
.tag el-tag {
  font-size: 35px;
}
</style>

