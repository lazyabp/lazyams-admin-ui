<template>
  <div class="app-container">
    <el-dialog
      :title="item.title"
      :visible="dialogVisible"
      :close-on-click-modal="false"
      width="600px"
      @close="handleCancel"
    >
      <el-form :model="config" label-width="120px">
        <el-form-item label="App名称">
          <el-input v-model="config.AppName" />
        </el-form-item>
        <el-form-item label="Logo">
          <Upload v-model="config.Logo" :is-image="true" title="上传Logo" />
        </el-form-item>
        <el-form-item label="Logo (深色)">
          <Upload v-model="config.LogoDark" :is-image="true" title="上传深色Logo" />
        </el-form-item>
        <el-form-item label="App标题">
          <el-input v-model="config.Title" />
        </el-form-item>
        <el-form-item label="App关键词">
          <el-input v-model="config.Keywords" />
        </el-form-item>
        <el-form-item label="App描述">
          <el-input v-model="config.Description" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="版权信息">
          <el-input v-model="config.Copyright" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" :loading="loading" @click="handleSave">
          确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Upload from '@/components/Upload/FileInput'
import { getConfig, setConfig } from '@/api/config'

export default {
  name: 'SiteConfig',
  components: { Upload },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    item: {
      type: Object,
      default: () => ({
        title: '',
        description: '',
        key: ''
      })
    }
  },
  data() {
    return {
      config: {
        AppName: '',
        Title: '',
        Keywords: '',
        Description: '',
        Logo: '',
        LogoDark: '',
        Copyright: ''
      },
      loading: false
    }
  },
  computed: {
    dialogVisible: {
      get() {
        return this.show
      },
      set(value) {
        this.$emit('update:show', value)
      }
    }
  },
  watch: {
    // 监听对话框显示状态
    show: {
      immediate: true,
      handler(newVal) {
        // console.log('show 变化:', newVal, 'item.key:', this.item.key)
        if (newVal && this.item.key) {
          this.fetchConfig()
        } else if (!newVal) {
          // 对话框关闭时重置表单
          this.resetForm()
        }
      }
    }
  },
  methods: {
    async fetchConfig() {
      try {
        // console.log('正在获取配置，key:', this.item.key)
        this.loading = true
        const res = await getConfig(this.item.key)
        // console.log('配置获取成功:', res)

        if (res && res.data) {
          // 合并数据，确保所有字段都有值
          this.config = {
            ...this.config,
            ...res.data
          }
        }
      } catch (error) {
        // console.error('获取配置失败:', error)
        this.$message.error('获取配置失败: ' + (error.message || '未知错误'))
      } finally {
        this.loading = false
      }
    },
    handleCancel() {
      this.dialogVisible = false
      this.$emit('closed')
    },
    async handleSave() {
      try {
        this.loading = true
        // console.log('正在保存配置:', this.config)
        await setConfig(this.item.key, this.config)
        this.$message.success('配置保存成功')
        this.dialogVisible = false
        // 触发保存成功事件
        this.$emit('saved', this.config)
      } catch (error) {
        // console.error('保存配置失败:', error)
        this.$message.error('保存配置失败: ' + (error.message || '未知错误'))
      } finally {
        this.loading = false
      }
    },
    resetForm() {
      this.config = {
        AppName: '',
        Title: '',
        Keywords: '',
        Description: '',
        Logo: '',
        LogoDark: '',
        Copyright: ''
      }
    }
  }
}
</script>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
