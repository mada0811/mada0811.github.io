<template>
  <el-container class="dashboard-container">
    <!-- 顶部导航栏 -->
    <el-header height="70px" class="header">
      <div class="header-left">
        <el-button type="primary" plain @click="toggleSidebar" class="menu-button">
          <el-icon><Menu /></el-icon>
        </el-button>
        <h1 class="title">影刀社区反馈数据看板</h1>
      </div>
      <div class="header-right">
        <el-dropdown>
          <span class="user">
            <el-avatar size="medium">管理</el-avatar>
          </span>
        </el-dropdown>
      </div>
    </el-header>

    <el-container>
      <!-- 侧边栏菜单 -->
      <el-aside width="200px" :width="isSidebarCollapsed ? '64px' : '200px'" class="sidebar">
        <el-menu
          :default-active="activeMenu"
          class="sidebar-menu"
          :collapse="isSidebarCollapsed"
        >
          <el-menu-item index="1" @click="activeMenu = '1'; showReportPage = false">
            <el-icon><HomeFilled /></el-icon>
            <template #title>数据看板</template>
          </el-menu-item>
          <el-menu-item index="2" @click="activeMenu = '2'; showReportPage = true">
            <el-icon><Document /></el-icon>
            <template #title>数据报告</template>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <!-- 内容区 -->
      <el-main class="content">
        <!-- 数据看板页面 -->
        <div v-if="!showReportPage" class="content-wrapper">
          <!-- KPI 指标卡 -->
          <KpiCards />

          <div class="chart-row">
            <!-- 问题类型分布 -->
            <div class="chart-item" @contextmenu.prevent="showContextMenu($event, 'typeDistribution')">
              <h3>问题类型分布</h3>
              <TypeDistributionChart />
            </div>

            <!-- 情绪-类型交叉分析 -->
            <div class="chart-item" @contextmenu.prevent="showContextMenu($event, 'sentimentCross')">
              <h3>情绪-类型交叉分析</h3>
              <SentimentCrossChart />
            </div>
          </div>

          <div class="chart-row">
            <!-- 高频词云 -->
            <div class="chart-item full-width" @contextmenu.prevent="showContextMenu($event, 'wordCloud')">
              <h3>高频词云</h3>
              <WordCloudChart />
            </div>
          </div>

          <div class="chart-row">
            <!-- 浏览量 Top 10 -->
            <div class="chart-item" @contextmenu.prevent="showContextMenu($event, 'top10')">
              <h3>浏览量 Top 10</h3>
              <Top10Table />
            </div>

            <!-- Top 10 饼图 -->
            <div class="chart-item" @contextmenu.prevent="showContextMenu($event, 'top10')">
              <h3>浏览量分布</h3>
              <Top10Chart />
            </div>
          </div>

          <div class="chart-row">
            <!-- 原始帖子表格 -->
            <div class="chart-item full-width" @contextmenu.prevent="showContextMenu($event, 'posts')">
              <h3>原始帖子数据</h3>
              <PostTable />
            </div>
          </div>
        </div>

        <!-- 数据报告页面 -->
        <div v-else class="content-wrapper">
          <h2>数据报告</h2>
          
          <!-- 报告列表 -->
          <div class="report-section">
            <el-card>
              <template #header>
                <div class="card-header">
                  <span>保存的分析报告</span>
                </div>
              </template>
              <div class="report-content">
                <el-empty v-if="reports.length === 0" description="暂无保存的报告">
                  <el-button type="primary" @click="showReportPage = false">去生成报告</el-button>
                </el-empty>
                <el-list v-else>
                  <el-list-item v-for="report in reports" :key="report.id">
                    <template #prefix>
                      <el-icon><Document /></el-icon>
                    </template>
                    <div class="report-item">
                      <div class="report-title">{{ report.title }}</div>
                      <div class="report-meta">
                        <span>{{ new Date(report.timestamp).toLocaleString() }}</span>
                        <el-button size="small" type="primary" @click="viewSavedReport(report)">
                          查看
                        </el-button>
                      </div>
                    </div>
                  </el-list-item>
                </el-list>
              </div>
            </el-card>
          </div>
        </div>

        <!-- 右键菜单弹窗 -->
        <div v-if="contextMenu.visible" class="context-menu" :style="{ left: contextMenu.x + 'px', top: contextMenu.y + 'px' }">
          <div class="context-menu-content">
            <div class="context-menu-item ai-analysis-item" @click="startAIAnalysis(contextMenu.currentType)">
              <span class="item-label">AI 数据分析</span>
              <el-icon class="ai-icon"><ChatDotRound /></el-icon>
            </div>
          </div>
        </div>

        <!-- AI分析结果弹窗 -->
        <el-dialog
          v-model="aiDialog.visible"
          :title="aiDialog.title"
          width="800px"
          :close-on-click-modal="false"
        >
          <div class="ai-analysis-content">
            <div v-if="aiDialog.loading" class="loading-state">
              <el-icon class="is-loading"><Loading /></el-icon>
              <span>正在分析数据，请稍候...</span>
            </div>
            <div v-else-if="aiDialog.error" class="error-state">
              <el-icon><Warning /></el-icon>
              <span>{{ aiDialog.error }}</span>
            </div>
            <div v-else-if="aiDialog.result" class="result-state">
              <div class="result-content" v-html="aiDialog.result"></div>
            </div>
            <div v-else class="empty-state">
              <el-icon><Document /></el-icon>
              <span>点击"立即分析"开始AI数据分析</span>
            </div>
          </div>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="aiDialog.visible = false">取消</el-button>
              <el-button v-if="!aiDialog.loading && aiDialog.result" type="primary" @click="downloadReport">
                下载报告
              </el-button>
              <el-button v-if="!aiDialog.loading && !aiDialog.result" type="primary" @click="startAIAnalysis(aiDialog.currentType)">
                立即分析
              </el-button>
            </span>
          </template>
        </el-dialog>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Menu, HomeFilled, Document, Setting, ChatDotRound, Loading, Warning } from '@element-plus/icons-vue'
import KpiCards from '../components/KpiCards.vue'
import TypeDistributionChart from '../components/charts/TypeDistributionChart.vue'
import SentimentCrossChart from '../components/charts/SentimentCrossChart.vue'
import WordCloudChart from '../components/charts/WordCloudChart.vue'
import Top10Table from '../components/Top10Table.vue'
import Top10Chart from '../components/charts/Top10Chart.vue'
import PostTable from '../components/PostTable.vue'
import axios from 'axios'

const isSidebarCollapsed = ref(false)
const activeMenu = ref('1')
const showReportPage = ref(false)
const reports = ref([])

const contextMenu = ref({
  visible: false,
  x: 0,
  y: 0,
  title: '',
  data: [] as { label: string; value: string }[],
  currentType: ''
})

const aiDialog = ref({
  visible: false,
  title: 'AI 数据分析',
  loading: false,
  error: '',
  result: '',
  currentType: ''
})

const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
  // 切换侧边栏折叠状态的类名
  const sidebar = document.querySelector('.sidebar')
  if (sidebar) {
    if (isSidebarCollapsed.value) {
      sidebar.classList.add('collapsed')
    } else {
      sidebar.classList.remove('collapsed')
    }
  }
}

const showContextMenu = (event: MouseEvent, type: string) => {
  contextMenu.value.x = event.clientX
  contextMenu.value.y = event.clientY
  contextMenu.value.currentType = type
  contextMenu.value.visible = true
  
  // 点击其他地方关闭弹窗
  setTimeout(() => {
    document.addEventListener('click', closeContextMenu)
  }, 100)
}

const startAIAnalysis = async (type: string) => {
  contextMenu.value.visible = false
  aiDialog.value.visible = true
  aiDialog.value.loading = true
  aiDialog.value.error = ''
  aiDialog.value.result = ''
  aiDialog.value.currentType = type
  
  try {
    let inputText = ''
    
    // 根据类型获取对应的数据
    switch (type) {
      case 'typeDistribution':
        aiDialog.value.title = '问题类型分布 - AI 分析'
        const typeData = await axios.get('http://localhost:3001/api/stats/distribution')
        inputText = `分析以下问题类型分布数据：\n${typeData.data.types.map((item: any) => `${item['问题类型']}: ${item.count}`).join('\n')}`
        break
      case 'sentimentCross':
        aiDialog.value.title = '情绪-类型交叉分析 - AI 分析'
        const crossData = await axios.get('http://localhost:3001/api/stats/distribution')
        inputText = `分析以下情绪-类型交叉数据：\n${crossData.data.crossData.map((item: any) => `${item['问题类型']} - ${item['作者态度']}: ${item.count}`).join('\n')}`
        break
      case 'wordCloud':
        aiDialog.value.title = '高频词云 - AI 分析'
        const wordData = await axios.get('http://localhost:3001/api/stats/wordcloud')
        inputText = `分析以下高频词数据：\n${wordData.data.slice(0, 20).map((item: any) => `${item.name}: ${item.value}`).join('\n')}`
        break
      case 'top10':
        aiDialog.value.title = '浏览量 Top 10 - AI 分析'
        const top10Data = await axios.get('http://localhost:3001/api/stats/top10')
        inputText = `分析以下浏览量 Top 10 数据：\n${top10Data.data.map((item: any, index: number) => `${index + 1}. ${item['帖子标题']}: ${item['浏览量']}`).join('\n')}`
        break
      case 'posts':
        aiDialog.value.title = '原始帖子数据 - AI 分析'
        const postsData = await axios.get('http://localhost:3001/api/posts')
        inputText = `分析以下帖子数据统计：\n总帖子数: ${postsData.data.total}\n当前页数量: ${postsData.data.list.length}\n部分帖子标题：\n${postsData.data.list.slice(0, 5).map((item: any) => item['帖子标题']).join('\n')}`
        break
    }
    
    // 调用 AI API
    const response = await fetch(
      "https://power-api.yingdao.com/oapi/power/v1/rest/flow/17dbe48a-a51e-4b16-b8b7-a0fa8cc53066/execute/stream",
      {
        headers: {
          'Authorization': 'Bearer AP_FwHqmDY0df7Gvx4e',
          'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify({ "input": { "input_text_0": inputText } }),
      }
    )
    
    if (!response.ok) {
      throw new Error(`API 请求失败: ${response.status}`)
    }
    
    const reader = response.body?.getReader()
    if (!reader) {
      throw new Error('无法获取响应流')
    }
    
    let currentResult = ''
    let isSuccess = false
    
    async function read() {
      const { done, value } = await reader.read()
      if (done) {
        aiDialog.value.loading = false
        return
      }
      
      const decoder = new TextDecoder('utf-8')
      const chunk = decoder.decode(value)
      
      // 解析流式数据
      const lines = chunk.split('\n')
      for (const line of lines) {
        if (line.startsWith('data:')) {
          const dataStr = line.substring(5).trim()
          if (dataStr === '[DONE') continue
          
          try {
            const data = JSON.parse(dataStr)
            if (data.code === 200 && data.success && data.data) {
              const result = data.data.result
              if (result) {
                // 实时更新结果
                let outputText = result.output_text_0 || result.text || result.content || ''
                if (typeof outputText === 'string') {
                  // 直接使用原始字符串，处理换行
                  currentResult = outputText
                  // 处理换行，将 \n 替换为 <br> 标签
                  aiDialog.value.result = currentResult.replace(/\n/g, '<br>')
                }
                
                // 标记成功状态
                if (result.status === 'success') {
                  isSuccess = true
                }
              }
            }
          } catch (e) {
            console.error('解析数据失败:', e)
          }
        }
      }
      
      read()
    }
    
    await read()
  } catch (error) {
    console.error('AI 分析失败:', error)
    aiDialog.value.error = 'AI 分析失败，请稍后重试'
    aiDialog.value.loading = false
  }
}

const downloadReport = () => {
  if (!aiDialog.value.result) return
  
  const content = aiDialog.value.result
  const blob = new Blob([content], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  const fileName = `AI分析报告_${new Date().toISOString().split('T')[0]}.html`
  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
  
  // 保存报告到数组
  reports.value.push({
    id: Date.now(),
    title: aiDialog.value.title,
    fileName: fileName,
    content: content,
    timestamp: new Date().toISOString()
  })
}

const downloadSavedReport = (report) => {
  const content = report.content
  const blob = new Blob([content], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = report.fileName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

const viewSavedReport = (report) => {
  const content = report.content
  const blob = new Blob([content], { type: 'text/html; charset=utf-8' })
  const url = URL.createObjectURL(blob)
  window.open(url, '_blank', 'width=800,height=600')
}

const closeContextMenu = () => {
  contextMenu.value.visible = false
  document.removeEventListener('click', closeContextMenu)
}


</script>

<style scoped>
.dashboard-container {
  min-height: 100vh;
  position: relative;
}

.header {
  background-color: #ffffff;
  border-bottom: 1px solid #e9e9e7;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9999;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.header-right {
  display: flex;
  align-items: center;
}

.user {
  cursor: pointer;
}

.sidebar {
  background-color: #ffffff;
  border-right: 1px solid #e9e9e7;
  transition: width 0.3s;
  margin-top: 70px;
  position: fixed;
  top: 70px;
  left: 0;
  bottom: 0;
  z-index: 9998;
  overflow-y: auto;
  width: 200px;
}

.sidebar.collapsed {
  width: 64px;
}

.sidebar-menu {
  height: 100%;
  border-right: none;
}

.content {
  background-color: #f5f5f5;
  padding: 20px;
  overflow-y: auto;
  margin-top: 70px;
  margin-left: 200px;
  transition: margin-left 0.3s;
}

.sidebar.collapsed + .content {
  margin-left: 64px;
}

/* 数据报告页面样式 */
h2 {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 24px;
}

.report-section {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.report-content {
  padding: 20px 0;
  line-height: 1.6;
}

.report-content p {
  margin-bottom: 16px;
  color: #666;
}

.report-item {
  width: 100%;
}

.report-title {
  font-weight: 500;
  margin-bottom: 4px;
}

.report-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #999;
}

.el-list {
  width: 100%;
}

.el-list-item {
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.el-list-item:last-child {
  border-bottom: none;
}

.content-wrapper {
  max-width: 1400px;
  margin: 0 auto;
  gap: 20px;
}

.chart-row {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.chart-item {
  background-color: #ffffff;
  border: 1px solid #e9e9e7;
  border-radius: 8px;
  padding: 20px;
  flex: 1;
  min-width: 400px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.chart-item h3 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
  align-self: flex-start;
  width: 100%;
}

.chart-item.full-width {
  flex: 100%;
  min-width: 100%;
}



.chart-item h3 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
}

@media (max-width: 768px) {
  .chart-item {
    min-width: 100%;
  }

  .sidebar {
    position: fixed;
    left: 0;
    top: 60px;
    height: calc(100vh - 60px);
    z-index: 1000;
    transition: transform 0.3s;
    transform: translateX(-100%);
  }

  .sidebar.open {
    transform: translateX(0);
  }
}

/* 右键菜单样式 */
.context-menu {
  position: fixed;
  z-index: 10000;
  background-color: white;
  border: 1px solid #e9e9e7;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 8px;
  min-width: 200px;
  max-width: 300px;
  max-height: 400px;
  overflow-y: auto;
}

.context-menu-content h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  border-bottom: 1px solid #e9e9e7;
  padding-bottom: 8px;
}

.context-menu-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 8px;
  font-size: 13px;
  color: #666;
  cursor: default;
}

.context-menu-item:hover {
  background-color: #f5f5f5;
  border-radius: 4px;
}

.context-menu-divider {
  height: 1px;
  background-color: #e9e9e7;
  margin: 8px 0;
}

.ai-analysis-item {
  color: #409EFF;
  font-weight: 500;
  cursor: pointer !important;
}

.ai-analysis-item:hover {
  background-color: #ecf5ff;
}

.ai-icon {
  font-size: 16px;
  margin-left: 8px;
}

.item-label {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-value {
  margin-left: 12px;
  font-weight: 500;
  color: #333;
}

/* AI分析弹窗样式 */
.ai-analysis-content {
  min-height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.loading-state,
.error-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 40px 0;
}

.loading-state .el-icon,
.error-state .el-icon,
.empty-state .el-icon {
  font-size: 48px;
  color: #909399;
}

.error-state .el-icon {
  color: #f56c6c;
}

.result-state {
  text-align: left;
  width: 100%;
  max-height: 500px;
  overflow-y: auto;
  padding: 20px 0;
}

.result-content {
  line-height: 1.6;
  color: #333;
}

.result-content h1,
.result-content h2,
.result-content h3 {
  margin-top: 20px;
  margin-bottom: 10px;
}

.result-content p {
  margin-bottom: 10px;
}
</style>