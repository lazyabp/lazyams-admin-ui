<template>
  <div class="app-container">
    <el-row :gutter="20" style="margin-top:50px;">
      <el-col v-for="(row, key) in keys" :key="key" :span="6">
        <el-card class="box-card" style="margin-bottom:20px;">
          <div slot="header" class="clearfix">
            <span>{{ row.title }}</span>
          </div>
          <div class="component-item">
            <el-button type="primary" @click="handleEdit(row)">
              修改配置
            </el-button>
            <div style="margin-top:10px;color:#999;">
              {{ row.description }}
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <SiteConfig :show.sync="showSiteConfig" :item="item" @closed="showSiteConfig = false" />
    <UploadConfig :show.sync="showUploadConfig" :item="item" @closed="showUploadConfig = false" />
    <MemberConfig :show.sync="showMemberConfig" :item="item" @closed="showMemberConfig = false" />
    <StorageConfig :show.sync="showStorageConfig" :item="item" @closed="showStorageConfig = false" />
  </div>
</template>

<script>
import SiteConfig from './components/SiteConfig.vue'
import UploadConfig from './components/UploadConfig.vue'
import MemberConfig from './components/MemberConfig.vue'
import StorageConfig from './components/StorageConfig.vue'
import { getKeys } from '@/api/config'

export default {
  name: 'ConfigManagement',
  components: { SiteConfig, UploadConfig, MemberConfig, StorageConfig },
  data() {
    return {
      keys: [],
      item: {},
      showSiteConfig: false,
      showUploadConfig: false,
      showMemberConfig: false,
      showStorageConfig: false
    }
  },
  created() {
    this.fetchConfigs()
  },
  methods: {
    async fetchConfigs() {
      const res = await getKeys()
      this.keys = res.data
    },
    async handleEdit(row) {
      this.item = row
      switch (row.key) {
        case 'site':
          this.showSiteConfig = true
          break
        case 'uploadfile':
          this.showUploadConfig = true
          break
        case 'member':
          this.showMemberConfig = true
          break
        case 'storage':
          this.showStorageConfig = true
          break
        default:
          break
      }
    }
  }
}
</script>
