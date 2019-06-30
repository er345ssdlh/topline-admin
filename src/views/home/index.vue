<template>
  <div>
    <div id='main' style='width: 600px;height:400px;' class="box"></div>
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  name: 'my-home',
  data () {
    return {
    }
  },
  mounted () {
    var myChart = echarts.init(document.getElementById('main'))
    // var option = {
    //   title: {
    //     text: 'ECharts 入门示例'
    //   },
    //   tooltip: {},
    //   legend: {
    //     data: ['最近六天粉丝增长数']
    //   },
    //   xAxis: {
    //     data: ['6.27', '6.28', '6.29', '6.30', '7.01', '7.02']
    //   },
    //   yAxis: {},
    //   series: [{
    //     name: '最近六天粉丝增长数',
    //     type: 'bar',
    //     data: [5, 20, 36, 10, 10, 20]
    //   }]
    // }
    // myChart.setOption(option)
    myChart.setOption({
      legend: {
        data: ['访问来源']
      },
      itemStyle: {
        // 阴影的大小
        shadowBlur: 200,
        // 阴影水平方向上的偏移
        shadowOffsetX: 0,
        // 阴影垂直方向上的偏移
        shadowOffsetY: 0,
        // 阴影颜色
        shadowColor: 'rgba(0, 0, 0, 0.5)'
      },
      // series不同 显示图像不同
      series: [{
        name: '访问来源',
        // 来指定是啥类型的图
        type: 'pie',
        radius: '55%',
        // 南丁格尔图 通过半径表示数据的大小
        roseType: 'angle',
        data: [
          { value: 235, name: '视频广告' },
          { value: 274, name: '联盟广告' },
          { value: 310, name: '邮件营销' },
          { value: 335, name: '直接访问' },
          { value: 300, name: '搜索引擎' }
        ]
      }]
    })
  }
}
</script>
<style>
.box{
  margin-top: -20px;
}
</style>
