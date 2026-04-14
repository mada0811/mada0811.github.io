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

interface TypeData {
  '问题类型': string
  count: number
}

const typeData = ref<TypeData[]>([])

const fetchTypeData = async () => {
  try {
    const response = await axios.get('http://localhost:3001/api/stats/distribution')
    typeData.value = response.data.types
    updateChart()
  } catch (error) {
    console.error('获取类型分布数据失败:', error)
  }
}

const updateChart = () => {
  if (!chartRef.value) return

  if (!chart) {
    chart = echarts.init(chartRef.value)
  }

  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      data: typeData.value.map(item => item['问题类型']),
      textStyle: {
        fontSize: 12
      }
    },
    series: [
      {
        name: '问题类型',
        type: 'pie',
        radius: '50%',
        center: ['60%', '50%'],
        data: typeData.value.map(item => ({
          value: item.count,
          name: item['问题类型']
        })),
        label: {
          fontSize: 11,
          formatter: '{b}\n{c} ({d}%)'
        },
        labelLine: {
          length: 10,
          length2: 20
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }

  chart.setOption(option)
}

const handleResize = () => {
  chart?.resize()
}

onMounted(() => {
  fetchTypeData()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  chart?.dispose()
})

watch(typeData, () => {
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