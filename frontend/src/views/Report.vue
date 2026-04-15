<template>
  <el-container class="dashboard-container">
    <!-- 顶部导航栏 -->
    <el-header height="70px" class="header">
      <div class="header-left">
        <el-button type="primary" plain @click="toggleSidebar" class="menu-button">
          <el-icon><Menu /></el-icon>
        </el-button>
        <h1 class="title">影刀社区反馈数据报告</h1>
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
          <el-menu-item index="1" @click="$router.push('/'); showReportPage = false">
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
        <div class="content-wrapper" @contextmenu.prevent="showContextMenu($event, 'report')">
          <div class="report-header">
            <h2>影刀RPA社区用户反馈数据分析报告</h2>
            <div class="report-meta">
              <span class="report-date">生成时间：2026-04-12</span>
            </div>
          </div>

          <div class="kpi-cards">
            <el-card class="kpi-card">
              <div class="kpi-item">
                <div class="kpi-label">问题总量</div>
                <div class="kpi-value">100</div>
                <div class="kpi-desc">覆盖7大问题类型</div>
              </div>
            </el-card>
            <el-card class="kpi-card">
              <div class="kpi-item">
                <div class="kpi-label">消极情绪占比</div>
                <div class="kpi-value">38%</div>
                <div class="kpi-desc">存在潜在流失风险</div>
              </div>
            </el-card>
            <el-card class="kpi-card">
              <div class="kpi-item">
                <div class="kpi-label">TOP1问题类型</div>
                <div class="kpi-value">24%</div>
                <div class="kpi-desc">界面/窗口操作</div>
              </div>
            </el-card>
            <el-card class="kpi-card">
              <div class="kpi-item">
                <div class="kpi-label">最高浏览量</div>
                <div class="kpi-value">241</div>
                <div class="kpi-desc">生意参谋限制问题</div>
              </div>
            </el-card>
          </div>

          <div class="report-section">
            <h3>摘要</h3>
            <div class="report-content">
              <p>💡核心发现：本次分析基于影刀RPA社区100条用户反馈帖子，揭示了产品使用中的关键痛点与用户情绪分布规律。</p>
              <p>界面操作 与 工具使用疑问 合计占比 41%，是用户最大的拦路虎；消极情绪高达38%，其中"程序报错排查"的消极占比达 88.89%，是负面情绪的"制造机"；生意参谋反爬限制 引发群体性焦虑，包揽浏览量TOP3；循环逻辑 与 元素捕获 是技术操作层面的"重灾区"。</p>
            </div>
          </div>

          <div class="report-section">
            <h3>一、数据核心洞察</h3>
            <h4>1.1 问题类型分布总览</h4>
            <div class="report-content">
              <p>通过对社区100条帖子的问题类型进行分类统计，呈现出明显的"头部集中"特征。前端交互类问题与基础认知类问题占据了问题总量的主导地位，而深度技术问题（如程序报错、功能需求）反而相对较少。</p>
              <div class="table-container">
                <el-table :data="problemTypes" style="width: 100%">
                  <el-table-column prop="type" label="问题类型" />
                  <el-table-column prop="count" label="数量" />
                  <el-table-column prop="percentage" label="占比" />
                </el-table>
              </div>
              <p class="insight">💡图表解读：界面/窗口操作（24%）与工具使用疑问（17%）合计占比41%，反映出用户在前端交互和基础认知层面存在显著障碍。</p>
            </div>

            <h4>1.2 关键结论</h4>
            <div class="report-content">
              <ul>
                <li>前端交互是最大痛点："界面/窗口操作"以24%的占比位居第一，说明用户在"元素捕获"、"窗口定位"等核心操作上频繁受阻</li>
                <li>基础认知门槛较高："工具使用疑问"占比17%，反映官方文档、系统提示或社区教程的易读性与检索效率可能不足</li>
                <li>深度问题占比较低："程序报错排查"（9%）和"功能需求实现"（10%）占比最少，说明大多数用户尚未进入深度使用阶段</li>
              </ul>
              <p class="insight">🎯 业务影响：影刀作为RPA工具，其核心受众包含大量非技术背景的业务人员。大量用户卡在"界面捕获"、"元素定位"等前端交互操作上，说明产品的"所见即所得"体验在复杂场景下仍有痛点，新手引导（Onboarding）在关键环节不够直观。</p>
            </div>
          </div>

          <div class="report-section">
            <h3>二、用户高频痛点TOP5</h3>
            <h4>2.1 基于浏览量TOP10与词频统计的痛点提炼</h4>
            <div class="report-content">
              <p>综合分析浏览量TOP10帖子的主题分布与词频统计结果，我们提炼出用户最关注、最困扰的五大核心痛点。这些痛点直接影响用户的日常工作效率和产品使用体验。</p>
            </div>
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
import { Menu, HomeFilled, Document, ChatDotRound, Loading, Warning } from '@element-plus/icons-vue'
import axios from 'axios'

const isSidebarCollapsed = ref(false)
const activeMenu = ref('2')
const showReportPage = ref(true)
const reports = ref([])

const contextMenu = ref({
  visible: false,
  x: 0,
  y: 0,
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

const problemTypes = ref([
  { type: '界面/窗口操作', count: 24, percentage: '24.0%' },
  { type: '工具使用疑问', count: 17, percentage: '17.0%' },
  { type: '系统/环境问题', count: 15, percentage: '15.0%' },
  { type: '流程逻辑问题', count: 14, percentage: '14.0%' },
  { type: '数据读取/写入', count: 11, percentage: '11.0%' },
  { type: '功能需求实现', count: 10, percentage: '10.0%' },
  { type: '程序报错排查', count: 9, percentage: '9.0%' }
])

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

const closeContextMenu = () => {
  contextMenu.value.visible = false
  document.removeEventListener('click', closeContextMenu)
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
      case 'report':
        aiDialog.value.title = '数据报告 - AI 分析'
        inputText = `分析以下影刀社区用户反馈数据分析报告：\n问题总量：100\n消极情绪占比：38%\nTOP1问题类型：界面/窗口操作 (24%)\n最高浏览量：241\n\n问题类型分布：\n界面/窗口操作：24 (24.0%)\n工具使用疑问：17 (17.0%)\n系统/环境问题：15 (15.0%)\n流程逻辑问题：14 (14.0%)\n数据读取/写入：11 (11.0%)\n功能需求实现：10 (10.0%)\n程序报错排查：9 (9.0%)`
        break
    }
    
    // 调用 AI 分析 API
    const response = await fetch(
      "https://power-api.yingdao.com/oapi/power/v1/rest/flow/17dbe48a-a51e-4b16-b8b7-a0fa8cc53066/execute/stream",
      {
        headers: {
          'Authorization': 'Bearer AP_FwHqmDY0df7Gvx4e',
          'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify({ input: { input_text_0: inputText } }),
      }
    )
    
    const reader = response.body?.getReader()
    if (!reader) {
      throw new Error('No response body')
    }
    
    let result = ''
    
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      
      const decoder = new TextDecoder('utf-8')
      const chunk = decoder.decode(value)
      
      // 处理流式数据
      const lines = chunk.split('\n')
      for (const line of lines) {
        if (line.startsWith('data:')) {
          const dataStr = line.substring(5)
          if (dataStr === '[DONE') continue
          
          try {
            const data = JSON.parse(dataStr)
            if (data.code === 200 && data.data?.result?.output_text_0) {
              if (typeof data.data.result.output_text_0 === 'string') {
                result += data.data.result.output_text_0
                aiDialog.value.result = result.replace(/\\n/g, '<br>')
              }
            }
          } catch (e) {
            console.error('解析流式数据失败:', e)
          }
        }
      }
    }
    
    aiDialog.value.loading = false
  } catch (error) {
    console.error('AI 分析失败:', error)
    aiDialog.value.loading = false
    aiDialog.value.error = 'AI 分析失败，请重试'
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

const downloadSavedReport = (report: any) => {
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

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
}

.report-header {
  margin-bottom: 30px;
  text-align: center;
}

.report-header h2 {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
}

.report-meta {
  color: #666;
  font-size: 14px;
}

.kpi-cards {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.kpi-card {
  flex: 1;
  min-width: 200px;
}

.kpi-item {
  text-align: center;
}

.kpi-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.kpi-value {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.kpi-desc {
  font-size: 12px;
  color: #999;
}

.report-section {
  background-color: #ffffff;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.report-section h3 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
}

.report-section h4 {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin: 16px 0 12px 0;
}

.report-content {
  line-height: 1.6;
  color: #666;
}

.report-content p {
  margin-bottom: 12px;
}

.report-content ul {
  margin-left: 20px;
  margin-bottom: 12px;
}

.report-content li {
  margin-bottom: 8px;
}

.table-container {
  margin: 16px 0;
  overflow-x: auto;
}

.insight {
  background-color: #f8f9fa;
  padding: 12px;
  border-radius: 4px;
  margin-top: 16px;
  font-style: italic;
}

/* 右键菜单样式 */
.context-menu {
  position: fixed;
  z-index: 10000;
  background: white;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  padding: 4px 0;
}

.context-menu-content {
  min-width: 150px;
}

.context-menu-item {
  padding: 8px 16px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.context-menu-item:hover {
  background-color: #f5f5f5;
}

.context-menu-divider {
  height: 1px;
  background-color: #e8e8e8;
  margin: 4px 0;
}

.ai-analysis-item {
  color: #409eff;
}

.ai-icon {
  margin-left: 8px;
}

/* AI 分析弹窗样式 */
.ai-analysis-content {
  min-height: 300px;
}

.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: #666;
}

.loading-state .is-loading {
  margin-right: 12px;
  font-size: 20px;
}

.error-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: #f56c6c;
}

.error-state el-icon {
  margin-right: 12px;
  font-size: 20px;
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: #999;
}

.empty-state el-icon {
  margin-right: 12px;
  font-size: 20px;
}

.result-state {
  max-height: 400px;
  overflow-y: auto;
}

.result-content {
  line-height: 1.6;
}

.result-content h1, .result-content h2, .result-content h3, .result-content h4, .result-content h5, .result-content h6 {
  margin-top: 20px;
  margin-bottom: 10px;
  font-weight: 600;
}

.result-content p {
  margin-bottom: 10px;
}

.result-content ul, .result-content ol {
  margin-left: 20px;
  margin-bottom: 10px;
}

.result-content li {
  margin-bottom: 5px;
}

.result-content code {
  background-color: #f5f5f5;
  padding: 2px 4px;
  border-radius: 4px;
  font-family: monospace;
}

.result-content pre {
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 4px;
  overflow-x: auto;
  margin-bottom: 10px;
}

.result-content blockquote {
  border-left: 4px solid #d9d9d9;
  padding-left: 10px;
  margin: 10px 0;
  color: #666;
}

.dialog-footer {
  width: 100%;
  display: flex;
  justify-content: flex-end;
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
</style>