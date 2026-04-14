<template>
  <div class="chart-container">
    <div ref="chartRef" class="chart"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'
import 'echarts-wordcloud'
import axios from 'axios'

const chartRef = ref<HTMLElement>()
let chart: echarts.ECharts | null = null

interface WordCloudData {
  name: string
  value: number
}

const wordCloudData = ref<WordCloudData[]>([])

const fetchWordCloudData = async () => {
  try {
    const response = await axios.get('http://localhost:3001/api/stats/wordcloud')
    wordCloudData.value = response.data
    updateChart()
  } catch (error) {
    console.error('获取词云数据失败:', error)
  }
}

const updateChart = () => {
  if (!chartRef.value) return

  if (!chart) {
    chart = echarts.init(chartRef.value)
  }

  const option = {
    tooltip: {},
    series: [
      {
        type: 'wordCloud',
        shape: 'circle',
        left: 'center',
        top: 'center',
        width: '80%',
        height: '80%',
        right: null,
        bottom: null,
        sizeRange: [12, 60],
        rotationRange: [-45, 45],
        rotationStep: 45,
        gridSize: 8,
        drawOutOfBound: false,
        textStyle: {
          fontFamily: 'sans-serif',
          fontWeight: 'bold',
          color: function () {
            return 'rgb(' + [
              Math.round(Math.random() * 160),
              Math.round(Math.random() * 160),
              Math.round(Math.random() * 160)
            ].join(',') + ')'
          }
        },
        emphasis: {
          focus: 'self',
          textStyle: {
            shadowBlur: 10,
            shadowColor: '#333'
          }
        },
        data: wordCloudData.value
      }
    ]
  }

  chart.setOption(option)
}

const handleResize = () => {
  chart?.resize()
}

onMounted(() => {
  fetchWordCloudData()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  chart?.dispose()
})

watch(wordCloudData, () => {
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