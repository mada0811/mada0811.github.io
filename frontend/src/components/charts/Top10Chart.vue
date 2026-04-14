<template>
  <div class="chart">
    <div ref="chartRef" class="chart-container"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import * as echarts from 'echarts'
import axios from 'axios'

const chartRef = ref<HTMLElement>()
let chart: echarts.ECharts | null = null
const top10Data = ref<any[]>([])

const fetchTop10Data = async () => {
  try {
    const response = await axios.get('http://localhost:3001/api/stats/top10')
    top10Data.value = response.data
    renderChart()
  } catch (error) {
    console.error('获取 Top 10 数据失败:', error)
  }
}

const renderChart = () => {
  if (!chartRef.value) return
  
  if (!chart) {
    chart = echarts.init(chartRef.value)
  }
  
  const data = top10Data.value.map(item => ({
    name: item['帖子标题'],
    value: parseInt(item['浏览量']) || 0
  }))
  
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      type: 'scroll',
      formatter: function(name: string) {
        return name.length > 10 ? name.substring(0, 10) + '...' : name
      },
      textStyle: {
        fontSize: 12
      },
      itemWidth: 10,
      itemHeight: 10,
      itemGap: 8
    },
    series: [
      {
        name: '浏览量',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['65%', '50%'],
        data: data,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        label: {
          show: false
        },
        labelLine: {
          show: false
        }
      }
    ]
  }
  
  chart.setOption(option)
}

onMounted(() => {
  fetchTop10Data()
  
  window.addEventListener('resize', () => {
    chart?.resize()
  })
})

watch(top10Data, () => {
  renderChart()
})
</script>

<style scoped>
.chart {
  width: 100%;
  height: 400px;
}

.chart-container {
  width: 100%;
  height: 100%;
}
</style>