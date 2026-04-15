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
          <!-- 报告头部 -->
          <div class="report-header">
            <h1>影刀RPA社区用户反馈数据分析报告</h1>
            <div class="report-meta">
              <span class="report-date">生成时间：{{ currentDate }}</span>
            </div>
          </div>

          <!-- KPI 指标卡 -->
          <div class="kpi-cards">
            <KpiCards />
          </div>

          <!-- 摘要部分 -->
          <div class="report-section">
            <h2>摘要</h2>
            <div class="report-content">
              <p>💡核心发现：本次分析基于影刀RPA社区用户反馈帖子，揭示了产品使用中的关键痛点与用户情绪分布规律。</p>
              <p>界面操作与工具使用疑问合计占比41%，是用户最大的拦路虎；消极情绪占比55%，其中"程序报错排查"的消极占比最高，是负面情绪的"制造机"；生意参谋反爬限制引发群体性焦虑，包揽浏览量TOP3；循环逻辑与元素捕获是技术操作层面的"重灾区"。</p>
            </div>
          </div>

          <!-- 数据核心洞察 -->
          <div class="report-section">
            <h2>一、数据核心洞察</h2>
            <h3>1.1 问题类型分布总览</h3>
            <div class="chart-row">
              <!-- 问题类型分布 -->
              <div class="chart-item" @contextmenu.prevent="showContextMenu($event, 'typeDistribution')">
                <h4>问题类型分布</h4>
                <TypeDistributionChart />
              </div>

              <!-- 情绪-类型交叉分析 -->
              <div class="chart-item" @contextmenu.prevent="showContextMenu($event, 'sentimentCross')">
                <h4>情绪-类型交叉分析</h4>
                <SentimentCrossChart />
              </div>
            </div>
            <div class="insight-box">
              <p>💡图表解读：界面/窗口操作与工具使用疑问合计占比41%，反映出用户在前端交互和基础认知层面存在显著障碍。</p>
            </div>

            <h3>1.2 关键结论</h3>
            <div class="insight-list">
              <div class="insight-item">
                <span class="insight-icon">•</span>
                <span>前端交互是最大痛点："界面/窗口操作"是最常见的问题类型，说明用户在"元素捕获"、"窗口定位"等核心操作上频繁受阻</span>
              </div>
              <div class="insight-item">
                <span class="insight-icon">•</span>
                <span>基础认知门槛较高："工具使用疑问"占比较高，反映官方文档、系统提示或社区教程的易读性与检索效率可能不足</span>
              </div>
              <div class="insight-item">
                <span class="insight-icon">•</span>
                <span>消极情绪占比高：55%的消极情绪表明用户在使用过程中遇到了较多挫折</span>
              </div>
            </div>
          </div>

          <!-- 高频痛点分析 -->
          <div class="report-section">
            <h2>二、用户高频痛点分析</h2>
            <div class="chart-row">
              <!-- 高频词云 -->
              <div class="chart-item full-width" @contextmenu.prevent="showContextMenu($event, 'wordCloud')">
                <h4>高频词云</h4>
                <WordCloudChart />
              </div>
            </div>
            <div class="chart-row">
              <!-- 浏览量 Top 10 -->
              <div class="chart-item" @contextmenu.prevent="showContextMenu($event, 'top10')">
                <h4>浏览量 Top 10</h4>
                <Top10Table />
              </div>

              <!-- Top 10 饼图 -->
              <div class="chart-item" @contextmenu.prevent="showContextMenu($event, 'top10')">
                <h4>浏览量分布</h4>
                <Top10Chart />
              </div>
            </div>
          </div>

          <!-- 原始帖子数据 -->
          <div class="report-section" @contextmenu.prevent="showContextMenu($event, 'posts')">
            <h2>三、原始帖子数据</h2>
            <PostTable />
          </div>
        </div>

        <!-- 数据报告页面 -->
        <div v-else class="content-wrapper">
          <h2>数据报告</h2>
          
          <!-- 报告列表 -->
          <div class="report-section" v-if="!selectedReport">
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
                        <div class="report-actions">
                          <el-button size="small" @click="viewReport(report)">
                            查看
                          </el-button>
                          <el-button size="small" type="primary" @click="downloadSavedReport(report)">
                            下载
                          </el-button>
                        </div>
                      </div>
                    </div>
                  </el-list-item>
                </el-list>
              </div>
            </el-card>
          </div>

          <!-- 报告查看页面 -->
          <div class="report-section" v-else>
            <el-card>
              <template #header>
                <div class="card-header">
                  <span>{{ selectedReport.title }}</span>
                  <el-button size="small" @click="selectedReport = null">
                    返回列表
                  </el-button>
                </div>
              </template>
              <div class="report-content">
                <div class="report-viewer" v-html="selectedReport.content"></div>
                <div class="report-actions" style="margin-top: 20px;">
                  <el-button type="primary" @click="downloadSavedReport(selectedReport)">
                    下载报告
                  </el-button>
                </div>
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
const currentDate = ref(new Date().toISOString().split('T')[0])
const selectedReport = ref(null)

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
    let hasData = false
    
    // 根据类型获取对应的数据
    switch (type) {
      case 'typeDistribution':
        aiDialog.value.title = '问题类型分布 - AI 分析'
        try {
          const typeData = await axios.get('http://localhost:3001/api/stats/distribution')
          if (typeData.data && typeData.data.types && typeData.data.types.length > 0) {
            inputText = `分析以下问题类型分布数据：\n${typeData.data.types.map((item: any) => `${item['问题类型']}: ${item.count}`).join('\n')}`
            hasData = true
          }
        } catch (error) {
          console.error('获取问题类型分布数据失败:', error)
        }
        break
      case 'sentimentCross':
        aiDialog.value.title = '情绪-类型交叉分析 - AI 分析'
        try {
          const crossData = await axios.get('http://localhost:3001/api/stats/distribution')
          if (crossData.data && crossData.data.crossData && crossData.data.crossData.length > 0) {
            inputText = `分析以下情绪-类型交叉数据：\n${crossData.data.crossData.map((item: any) => `${item['问题类型']} - ${item['作者态度']}: ${item.count}`).join('\n')}`
            hasData = true
          }
        } catch (error) {
          console.error('获取情绪-类型交叉数据失败:', error)
        }
        break
      case 'wordCloud':
        aiDialog.value.title = '高频词云 - AI 分析'
        try {
          const wordData = await axios.get('http://localhost:3001/api/stats/wordcloud')
          if (wordData.data && wordData.data.length > 0) {
            inputText = `分析以下高频词数据：\n${wordData.data.slice(0, 20).map((item: any) => `${item.name}: ${item.value}`).join('\n')}`
            hasData = true
          }
        } catch (error) {
          console.error('获取高频词数据失败:', error)
        }
        break
      case 'top10':
        aiDialog.value.title = '浏览量 Top 10 - AI 分析'
        try {
          const top10Data = await axios.get('http://localhost:3001/api/stats/top10')
          if (top10Data.data && top10Data.data.length > 0) {
            inputText = `分析以下浏览量 Top 10 数据：\n${top10Data.data.map((item: any, index: number) => `${index + 1}. ${item['帖子标题']}: ${item['浏览量']}`).join('\n')}`
            hasData = true
          }
        } catch (error) {
          console.error('获取Top 10数据失败:', error)
        }
        break
      case 'posts':
        aiDialog.value.title = '原始帖子数据 - AI 分析'
        try {
          const postsData = await axios.get('http://localhost:3001/api/posts')
          if (postsData.data && postsData.data.total > 0) {
            inputText = `分析以下帖子数据统计：\n总帖子数: ${postsData.data.total}\n当前页数量: ${postsData.data.list.length}\n部分帖子标题：\n${postsData.data.list.slice(0, 5).map((item: any) => item['帖子标题']).join('\n')}`
            hasData = true
          }
        } catch (error) {
          console.error('获取帖子数据失败:', error)
        }
        break
      default:
        // 其他类型暂时不支持AI分析
        aiDialog.value.error = '该模块暂不支持AI分析'
        aiDialog.value.loading = false
        return
    }
    
    // 检查是否有数据
    if (!hasData || !inputText) {
      aiDialog.value.error = '该模块暂无数据，无法进行AI分析'
      aiDialog.value.loading = false
      return
    }
    
    // 调用 AI API
    console.log('开始调用 AI API...')
    console.log('API 地址:', "https://power-api.yingdao.com/oapi/power/v1/rest/flow/17dbe48a-a51e-4b16-b8b7-a0fa8cc53066/execute")
    console.log('输入数据:', inputText)
    
    try {
      // 尝试使用 axios 代替 fetch，可能能更好地处理跨域问题
      console.log('使用 axios 调用 API...')
      const result = await axios.post(
        "https://power-api.yingdao.com/oapi/power/v1/rest/flow/17dbe48a-a51e-4b16-b8b7-a0fa8cc53066/execute",
        { "input": { "input_text_0": inputText } },
        {
          headers: {
            'Authorization': 'Bearer AP_FwHqmDY0df7Gvx4e',
            'Content-Type': 'application/json'
          }
        }
      )
      
      console.log('API 响应状态:', result.status)
      console.log('API 响应数据:', result.data)
      
      if (result.data.code === 200 && result.data.success && result.data.data) {
        const output = result.data.data.result?.output_text_0
        if (output && typeof output === 'string') {
          // 处理换行，将 \n 替换为 <br> 标签
          aiDialog.value.result = output.replace(/\n/g, '<br>')
          console.log('AI 分析成功，结果长度:', output.length)
        } else {
          throw new Error('API 返回数据格式错误')
        }
      } else {
        throw new Error(`API 调用失败: ${result.data.msg || '未知错误'}`)
      }
    } catch (error) {
      console.error('API 调用失败:', error)
      // 显示更详细的错误信息
      if (error.response) {
        // 服务器返回错误状态码
        console.error('服务器错误:', error.response.status, error.response.data)
        aiDialog.value.error = `API 服务器错误: ${error.response.status} - ${error.response.data.msg || '未知错误'}`
      } else if (error.request) {
        // 请求已发送但没有收到响应
        console.error('网络错误: 没有收到服务器响应')
        aiDialog.value.error = '网络错误: 无法连接到 AI 服务，请检查网络连接'
      } else {
        // 请求配置出错
        console.error('请求错误:', error.message)
        aiDialog.value.error = `请求错误: ${error.message}`
      }
      aiDialog.value.loading = false
      return
    }
    
    aiDialog.value.loading = false
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

const viewReport = (report) => {
  selectedReport.value = report
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

/* 报告头部样式 */
.report-header {
  text-align: center;
  margin-bottom: 40px;
  padding: 30px 0;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.report-header h1 {
  font-size: 28px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
}

.report-meta {
  color: #666;
  font-size: 14px;
}

/* KPI 卡片样式 */
.kpi-cards {
  margin-bottom: 30px;
}

/* 报告章节样式 */
.report-section {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.report-section h2 {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 24px;
  padding-bottom: 12px;
  border-bottom: 2px solid #f0f0f0;
}

.report-section h3 {
  font-size: 18px;
  font-weight: 500;
  color: #333;
  margin: 24px 0 16px 0;
}

.report-section h4 {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-bottom: 16px;
}

.report-content {
  line-height: 1.6;
  color: #666;
}

.report-content p {
  margin-bottom: 16px;
}

/* 洞察框样式 */
.insight-box {
  background-color: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
  margin: 20px 0;
  border-left: 4px solid #409eff;
}

.insight-box p {
  margin: 0;
  font-style: italic;
}

/* 洞察列表样式 */
.insight-list {
  margin: 20px 0;
}

.insight-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 12px;
  line-height: 1.6;
  color: #666;
}

.insight-icon {
  font-size: 16px;
  margin-right: 12px;
  color: #409eff;
  margin-top: 2px;
}

/* 图表项样式调整 */
.chart-item {
  min-height: 400px;
}

.chart-item h4 {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-bottom: 16px;
  align-self: flex-start;
  width: 100%;
}

/* 报告操作按钮样式 */
.report-actions {
  display: flex;
  gap: 8px;
}

/* 报告查看器样式 */
.report-viewer {
  line-height: 1.6;
  color: #333;
  padding: 20px 0;
}

.report-viewer h1,
.report-viewer h2,
.report-viewer h3,
.report-viewer h4,
.report-viewer h5,
.report-viewer h6 {
  margin-top: 20px;
  margin-bottom: 10px;
  font-weight: 600;
}

.report-viewer p {
  margin-bottom: 10px;
}

.report-viewer ul,
.report-viewer ol {
  margin-left: 20px;
  margin-bottom: 10px;
}

.report-viewer li {
  margin-bottom: 5px;
}

.report-viewer code {
  background-color: #f5f5f5;
  padding: 2px 4px;
  border-radius: 4px;
  font-family: monospace;
}

.report-viewer pre {
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 4px;
  overflow-x: auto;
  margin-bottom: 10px;
}

.report-viewer blockquote {
  border-left: 4px solid #d9d9d9;
  padding-left: 10px;
  margin: 10px 0;
  color: #666;
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