<template>
  <div class="app-container">
    <el-dialog
      :title="item.title"
      :visible="dialogVisible"
      :close-on-click-modal="false"
      width="600px"
      @close="handleCancel"
    >
      <el-form :model="config" label-width="160px">
        <el-tabs v-model="activeName">
          <el-tab-pane label="图片上传设置" name="first">
            <el-form-item label="允许上传图片">
              <el-switch v-model="config.ImageUploadEnabled" />
            </el-form-item>
            <el-form-item label="允许的图片格式">
              <el-input v-model="config.ImageExtensions" />
            </el-form-item>
            <el-form-item label="最大图片大小 (Bytes)">
              <el-input v-model.number="config.ImageMaxSize" type="number" />
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="视频上传设置" name="second">
            <el-form-item label="允许上传视频">
              <el-switch v-model="config.VideoUploadEnabled" />
            </el-form-item>
            <el-form-item label="允许的视频格式">
              <el-input v-model="config.VideoExtensions" />
            </el-form-item>
            <el-form-item label="最大视频大小 (Bytes)">
              <el-input v-model.number="config.VideoMaxSize" type="number" />
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="附件上传设置" name="third">
            <el-form-item label="允许上传附件">
              <el-switch v-model="config.FileUploadEnabled" />
            </el-form-item>
            <el-form-item label="允许的附件格式">
              <el-input v-model="config.FileExtensions" />
            </el-form-item>
            <el-form-item label="最大附件大小 (Bytes)">
              <el-input v-model.number="config.FileMaxSize" type="number" />
            </el-form-item>
          </el-tab-pane>
        </el-tabs>
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
import { getConfig, setConfig } from '@/api/config'

export default {
  name: 'UploadConfig',
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
        ImageUploadEnabled: true,
        ImageExtensions: '.jpg,.jpeg,.png,.gif,.webp',
        ImageMaxSize: 1024000,
        VideoUploadEnabled: false,
        VideoExtensions: '.mp4',
        VideoMaxSize: 102400000,
        FileUploadEnabled: false,
        FileExtensions: '.pdf,.doc,.docx,.xls,.xlsx,.txt,.zip',
        FileMaxSize: 2048000
      },
      loading: false,
      activeName: 'first'
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
        ImageUploadEnabled: true,
        ImageExtensions: '.jpg,.jpeg,.png,.gif,.webp',
        ImageMaxSize: 1024000,
        VideoUploadEnabled: false,
        VideoExtensions: '.mp4',
        VideoMaxSize: 102400000,
        FileUploadEnabled: false,
        FileExtensions: '.pdf,.doc,.docx,.xls,.xlsx,.txt,.zip',
        FileMaxSize: 2048000
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
