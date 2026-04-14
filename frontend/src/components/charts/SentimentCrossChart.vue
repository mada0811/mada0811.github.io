<template>
  <div class="chart-container">
    <div ref="chartRef" class="chart"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'
import axios from 'axios'

const chartRef = ref<HTMLElement>()
let chart: echarts.ECharts | null = null

interface CrossData {
  '问题类型': string
  '作者态度': string
  count: number
}

const crossData = ref<CrossData[]>([])

const fetchCrossData = async () => {
  try {
    const response = await axios.get('http://localhost:3001/api/stats/distribution')
    crossData.value = response.data.crossData
    updateChart()
  } catch (error) {
    console.error('获取交叉数据失败:', error)
  }
}

const updateChart = () => {
  if (!chartRef.value) return

  if (!chart) {
    chart = echarts.init(chartRef.value)
  }

  // 提取所有问题类型
  const questionTypes = [...new Set(crossData.value.map(item => item['问题类型']))]
  
  // 提取所有情绪类型
  const attitudes = ['积极', '中性', '消极']
  
  // 准备系列数据
  const series = attitudes.map(attitude => {
    return {
      name: attitude,
      type: 'bar',
      stack: 'total',
      data: questionTypes.map(type => {
        const item = crossData.value.find(d => d['问题类型'] === type && d['作者态度'] === attitude)
        return item ? item.count : 0
      })
    }
  })

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: attitudes
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: questionTypes,
      axisLabel: {
        rotate: 45
      }
    },
    yAxis: {
      type: 'value'
    },
    series: series
  }

  chart.setOption(option)
}

const handleResize = () => {
  chart?.resize()
}

onMounted(() => {
  fetchCrossData()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  chart?.dispose()
})

watch(crossData, () => {
  updateChart()
}, { deep: true })
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 400px;
}

.chart {
  width: 100%;
  height: 100%;
}
</style>