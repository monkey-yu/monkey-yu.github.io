---
layout:     post
title:      "介绍v-echarts"
date:       2019-08-13 12:00:00
author:     "monkey-yu"
header-img: "img/tree.jpg"
catalog: false
tags:
    - Vue
---

> 最近做的项目多数是基于Vue的，当遇到绘制图表时候，优先会想到免费开源功能齐全的百度echarts。然而，在vue项目中，引入echarts会有很多繁琐的配置项，数据格式转化等。 无意间发现某大神封装了v-echarts，简单好用，简直是救星！下面具体介绍。

#### 一、介绍

v-echarts是基于Vue2.0和echarts 封装的图表组件。他只需要统一提供一种对前后端都友好的数据格式设置简单的配置项，便可轻松生成常见的图表。

- [v-echarts 文档地址](https://v-charts.js.org/#/)

- [v-echarts Github地址](https://github.com/ElemeFE/v-charts)

#### 二、使用

npm安装： 

```
npm i v-echarts echarts -s
```

v-echarts图表类型：

```
|- lib/
|- line.js  -------------- 折线图
|- bar.js  --------------- 条形图
|- histogram.js  --------- 柱状图
|- pie.js  --------------- 饼图
|- ring.js  -------------- 环图
|- funnel.js  ------------ 漏斗图
|- waterfall.js  --------- 瀑布图
|- radar.js  ------------- 雷达图
|- map.js  --------------- 地图
|- bmap.js  -------------- 百度地图
...(更多，参考echarts有的图表)
```

##### 1.基础实例：饼图

```html
<template>
  <div class="echarts-ring-box">
    <ve-ring
      :data="chartData"
      :settings="chartSettings"
      :tooltip-visible="true"
      height="200px"
      width="500px"
      :extend="chartExtend"
    ></ve-ring>
  </div>
</template>
<script lang="ts" src="./echarts-ring.ts"></script>
<style lang="scss" src="./echarts-ring.scss"></style>
```

```javascript
import Vue from 'vue';
import Component from 'vue-class-component';
import VeRing from 'v-charts/lib/ring.common';    // 引入对应图表
@Component({
  props: [],
  components: { VeRing },
  computed: {}
})
export default class EchartsRing extends Vue {
  colors = [
    '#EFB3E6',
    '#FF9F9B',
    '#97D7AC',
    '#c4ccd3'
  ];
  chartSettings = {

  };
	chartData = {
    columns: ['name', 'value'],
    rows: [
      { name: '中山医院', value: 40 },
      { name: '华山医院', value: 40 },
      { name: '新华医院', value: 30 },
      { name: '复旦医院', value: 20 },
      { name: '湘雅医院', value: 10 }
    ]
  };
  chartExtend = {
    series: {
          label: {
            show: false
          },
          center: ['25%', '38%'],
    			radius: ['45%','65%']
  	}
  };
}

```

```scss
@import 'v-charts/lib/style.css';  // 一定要引入他的css
.echarts-ring-box {
  width: auto;
}
```

效果图如下：

![v-echarts1](/img/post_img/vue/v-echarts1.png)

##### 2.传递数据的实例：折线图

```html
<!-- 折线图组件html -->
<template>
  <div class="echarts-line-box">
    <Veline
      :settings="chartSettings"     
      :data="chartData"
      :data-empty="dataEmpty"        
      :colors="colors"
      :grid="grid"
      :extend="chartExtend"
      :tooltip-visible="true"
    ></Veline>
  </div>
</template>
<script lang="ts" src="./echarts-line.ts"></script>
<style lang="scss" src="./echarts-line.scss"></style>

```

上述中`data-empty`设置暂无数据状态；

`extend`设置extend配置项；

`tooltip-visible`是否显示工具栏；

`legend-visible`设置是否显示图例，默认为true；

`chartData`为要展示的数据。

```javascript
//  折线图组件 ts 
import Vue from 'vue';
import Component from 'vue-class-component';
import Veline from 'v-charts/lib/line.common';  // 引入对应图表
@Component({
  props: ['lineChartProps'],    // props传递由父级来的数据
  components: { Veline },
  computed: {
    chartData: function(){      // 赋值 数据
      return this.$props.lineChartProps.data
    },
    dataEmpty: function(){       // 赋值 是否为空
      return this.$props.lineChartProps.dataEmpty
    }
  }
})
export default class EchartLine extends Vue {
  colors = [
    '#c23531',
    '#2f4554',
    '#61a0a8',
    '#d48265',
    '#c4ccd3'
  ];
  grid = {
    show: false,
    top: 30,
    left: 4,
    right: 4,
    bottom: 2
  };
  chartExtend = {  // 一些配置项
    series: {
      type: 'line',
      showSymbol: true,
      smooth: false,
      markPoint: {
        symbol: 'circle'
      },
      itemStyle: {
        normal: {
          label: {
            show: true,
            textStyle: { color: '#FE8685' },
            position: 'outside'
          }
        }
      }
    },
    xAxis: {
      show: true,
      boundaryGap: ['2%', '2%'],
      splitNumber:10,
      axisLine: {
        show: false,
        symbolSize: [10, 8],
        axisTick: {
          show: false
        }
      }
    },
    yAxis: {
      show: true,
      boundaryGap: ['2%', '2%'],
      splitNumber:10,
      axisLine: {
        show: false,
        symbolSize: [10, 8],
        axisTick: {
          show: false
        }
      }
    }
  };
  chartSettings = {
    axisSite: {  },
    xAxisName: ['日期'],     // 设置坐标轴名称
    yAxisName: ['人数']
  };
}
```

```html
<!-- 使用折线图的页面 html -->
<template>
	<div>
		<EchartLine :lineChartProps = "lineChartInfo"></EchartLine>
	</div>
</template>
```

```javascript
//  使用折线图的页面 ts 
import Component from 'vue-class-component';
import Vue from 'vue';
import EchartLine from '@/widgets/echarts-line/echarts-line.vue';
@Component({
  components: {
    EchartLine
  }
})
export default class viewPage extends Vue {
   lineChartInfo = {
    data: {
      columns: ['日期', '累计患者数量', '绿标患者数量'],
      rows: [],
    },
    dataEmpty: false
  };
	created(){
    this.getData();
  }
  getData(){
    BusinessService.getData().then(res => {
      // this.lineChartInfo 赋值data和dataEmpty
      if(res.data.list && res.data.list.length > 0) {
        this.lineChartInfo.data.rows = res.data.list.map(item => {
          return { 日期:item.date.slice(0,10),累计患者数量:item.ptCnt, 绿标患者数量: item.greenPtCnt}
        })
      }else {
        this.lineChartInfo.data.rows = [];
        this.lineChartInfo.dataEmpty = true;
      }
    }).catch(err => {
      this.$message.error(err)
    })
  }
}
```

![v-echarts2](/img/post_img/vue/v-echarts2.png)

上述中其他配置项可参考 echarts 官网或者v-echarts 文档官网。

> end!

