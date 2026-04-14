<template>
  <div class="post-table">
    <div class="table-header">
      <el-button type="primary" @click="exportCSV">导出 CSV</el-button>
    </div>
    <el-table
      :data="postsData"
      style="width: 100%"
      @sort-change="handleSortChange"
    >
      <el-table-column prop="帖子标题" label="标题" width="300">
        <template #default="scope">
          <a :href="scope.row['帖子链接']" target="_blank" class="title-link">{{ scope.row['帖子标题'] }}</a>
        </template>
      </el-table-column>
      <el-table-column prop="作者" label="作者" width="120" />
      <el-table-column prop="问题类型" label="问题类型" width="150" />
      <el-table-column prop="作者态度" label="态度" width="100">
        <template #default="scope">
          <el-tag
            :type="getAttitudeType(scope.row['作者态度'])"
            size="small"
            :class="getAttitudeClass(scope.row['作者态度'])"
          >
            {{ scope.row['作者态度'] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="浏览量" label="浏览量" width="100" sortable />
      <el-table-column prop="发布时间" label="发布时间" width="180" sortable />
    </el-table>
    <div class="pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

interface Post {
  '帖子标题': string
  '帖子链接': string
  '帖子ID': number
  '作者': string
  '作者个人页链接': string
  '帖子内容（文本）': string
  '发布时间': string
  '浏览量': number
  '问题类型': string
  '作者态度': string
}

const postsData = ref<Post[]>([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(5)
const sortField = ref('')
const sortOrder = ref('')

const fetchPosts = async () => {
  try {
    const response = await axios.get('http://localhost:3001/api/posts', {
      params: {
        page: currentPage.value,
        limit: pageSize.value
      }
    })
    postsData.value = response.data.list
    total.value = response.data.total
  } catch (error) {
    console.error('获取帖子数据失败:', error)
  }
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  fetchPosts()
}

const handleCurrentChange = (current: number) => {
  currentPage.value = current
  fetchPosts()
}

const handleSortChange = (sort: any) => {
  sortField.value = sort.prop
  sortOrder.value = sort.order
  // 这里可以根据排序字段和顺序重新请求数据
  fetchPosts()
}

const getAttitudeType = (attitude: string) => {
  switch (attitude) {
    case '积极':
      return 'success'
    case '消极':
      return 'danger'
    default:
      return 'info'
  }
}

const getAttitudeClass = (attitude: string) => {
  switch (attitude) {
    case '积极':
      return 'attitude-positive'
    case '消极':
      return 'attitude-negative'
    default:
      return 'attitude-neutral'
  }
}

const exportCSV = () => {
  // 简单的 CSV 导出功能
  const headers = ['标题', '作者', '问题类型', '态度', '浏览量', '发布时间', '链接']
  const rows = postsData.value.map(post => [
    `"${post['帖子标题']}"`,
    `"${post['作者']}"`,
    `"${post['问题类型']}"`,
    `"${post['作者态度']}"`,
    post['浏览量'],
    `"${post['发布时间']}"`,
    `"${post['帖子链接']}"`
  ])
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n')
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', `posts_${new Date().toISOString().split('T')[0]}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

onMounted(() => {
  fetchPosts()
})
</script>

<style scoped>
.post-table {
  width: 100%;
}

.table-header {
  margin-bottom: 16px;
  display: flex;
  justify-content: flex-end;
}

.title-link {
  color: #409EFF;
  text-decoration: none;
}

.title-link:hover {
  text-decoration: underline;
}

.pagination {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}

.attitude-positive {
  background-color: #e9f5e6 !important;
  color: #438730 !important;
  border-color: #e9f5e6 !important;
}

.attitude-negative {
  background-color: #fbe2e0 !important;
  color: #c4291c !important;
  border-color: #fbe2e0 !important;
}

.attitude-neutral {
  background-color: #f1f1ef !important;
  color: #787774 !important;
  border-color: #f1f1ef !important;
}
</style>