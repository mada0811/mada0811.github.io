<template>
  <div class="kpi-cards">
    <div class="kpi-card blue">
      <div class="kpi-value">{{ overviewData.total }}</div>
      <div class="kpi-label">问题总量</div>
    </div>
    <div class="kpi-card green">
      <div class="kpi-value">{{ overviewData.negativeRate }}%</div>
      <div class="kpi-label">消极情绪占比</div>
    </div>
    <div class="kpi-card amber">
      <div class="kpi-value">{{ overviewData.topType }}</div>
      <div class="kpi-label">TOP1问题类型</div>
    </div>
    <div class="kpi-card purple">
      <div class="kpi-value">{{ overviewData.topViews }}</div>
      <div class="kpi-label">最高浏览量</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

interface OverviewData {
  total: number
  negativeRate: number
  topType: string
  topViews: number
}

const overviewData = ref<OverviewData>({
  total: 0,
  negativeRate: 0,
  topType: '无',
  topViews: 0
})

const fetchOverviewData = async () => {
  try {
    const response = await axios.get('http://localhost:3001/api/stats/overview')
    overviewData.value = response.data
  } catch (error) {
    console.error('获取概览数据失败:', error)
  }
}

onMounted(() => {
  fetchOverviewData()
})
</script>

<style scoped>
.kpi-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.kpi-card {
  background-color: #ffffff;
  border: 1px solid #e9e9e7;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s, box-shadow 0.2s;
}

.kpi-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.kpi-card.blue {
  background-color: #e7f0fb;
}

.kpi-card.green {
  background-color: #e9f5e6;
}

.kpi-card.amber {
  background-color: #fff4e8;
}

.kpi-card.purple {
  background-color: #f3ecff;
}

.kpi-value {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.kpi-label {
  font-size: 14px;
  color: #666;
}

@media (max-width: 768px) {
  .kpi-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .kpi-cards {
    grid-template-columns: 1fr;
  }
}
</style>