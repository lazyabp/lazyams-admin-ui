<template>
  <div class="app-container">
    <el-row :gutter="20" style="margin-top:50px;">
      <el-col v-for="(row, key) in tags" :key="key" :span="6">
        <el-card class="box-card" style="margin-bottom:20px;">
          <div slot="header" class="clearfix">
            <span>{{ row.label }}</span>
          </div>
          <div class="component-item">
            <el-button type="warning" size="small" @click="handleDelete(row)">
              删除缓存
            </el-button>
            <div style="margin-top:10px;color:#999;">
              {{ row.description }}
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card" style="margin-bottom:20px;">
          <div slot="header" class="clearfix">
            <span>清空缓存</span>
          </div>
          <div class="component-item">
            <el-button type="danger" size="small" @click="handleDeleteAll">
              立即清空
            </el-button>
            <div style="margin-top:10px;color:#999;">
              一键清空所有缓存，谨慎操作！
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getCacheTags, deleteCache, clearCache } from '@/api/cache'

export default {
  name: 'CacheManagement',
  data() {
    return {
      tags: []
    }
  },
  created() {
    this.fetchCaches()
  },
  methods: {
    async fetchCaches() {
      const res = await getCacheTags()
      this.tags = res.data
    },
    async handleDelete(row) {
      await deleteCache(row.value)
      this.$message.success('清除缓存成功')
    },
    async handleDeleteAll() {
      await clearCache()
      this.$message.success('清空所有缓存成功')
    }
  }
}
</script>
