<template>
  <div class="top10-table">
    <el-table :data="top10Data" style="width: 100%" :max-height="400">
      <el-table-column prop="帖子标题" label="标题" width="250">
        <template #default="scope">
          <a :href="scope.row['帖子链接']" target="_blank" class="title-link">{{ scope.row['帖子标题'] }}</a>
        </template>
      </el-table-column>
      <el-table-column prop="浏览量" label="浏览量" width="100" />
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

interface Top10Item {
  '帖子标题': string
  '浏览量': number
  '帖子链接': string
}

const top10Data = ref<Top10Item[]>([])

const fetchTop10Data = async () => {
  try {
    const response = await axios.get('http://localhost:3001/api/stats/top10')
    top10Data.value = response.data
  } catch (error) {
    console.error('获取Top10数据失败:', error)
  }
}

onMounted(() => {
  fetchTop10Data()
})
</script>

<style scoped>
.top10-table {
  width: 100%;
}

.title-link {
  color: #409EFF;
  text-decoration: none;
}

.title-link:hover {
  text-decoration: underline;
}
</style>