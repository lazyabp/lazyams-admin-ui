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
        <el-tabs v-model="activeName">
          <el-tab-pane label="微信登录" name="first">
            <el-form-item label="是否启用">
              <el-switch v-model="config.weixinLogin" />
            </el-form-item>
            <el-form-item label="AppId">
              <el-input v-model="config.weixinConfig.appId" />
            </el-form-item>
            <el-form-item label="AppSecret">
              <el-input v-model="config.weixinConfig.appSecret" />
            </el-form-item>
            <el-form-item label="跳转地址">
              <el-input v-model="config.weixinConfig.redirectUrl" />
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="微信小程序登录" name="second">
            <el-form-item label="是否启用">
              <el-switch v-model="config.weixinMiniLogin" />
            </el-form-item>
            <el-form-item label="AppId">
              <el-input v-model="config.weixinMiniConfig.appId" />
            </el-form-item>
            <el-form-item label="AppSecret">
              <el-input v-model="config.weixinMiniConfig.appSecret" />
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="Google登录" name="third">
            <el-form-item label="是否启用">
              <el-switch v-model="config.googleLogin" />
            </el-form-item>
            <el-form-item label="ClientId">
              <el-input v-model="config.googleConfig.clientId" />
            </el-form-item>
            <el-form-item label="ClientSecret">
              <el-input v-model="config.googleConfig.clientSecret" />
            </el-form-item>
            <el-form-item label="跳转地址">
              <el-input v-model="config.googleConfig.redirectUrl" />
            </el-form-item>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" :loading="loading" @click="handelSave">
          确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getConfig, setConfig } from '@/api/config'

export default {
  name: 'SocialiteLoginConfig',
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
        weixinLogin: false,
        weixinMiniLogin: false,
        googleLogin: false,
        weixinConfig: {
          appId: '',
          appSecret: '',
          redirectUrl: ''
        },
        weixinMiniConfig: {
          appId: '',
          appSecret: ''
        },
        googleConfig: {
          clientId: '',
          clientSecret: '',
          redirectUrl: ''
        }
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
    async handelSave() {
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
        weixinLogin: false,
        weixinMiniLogin: false,
        googleLogin: false,
        weixinConfig: {
          appId: '',
          appSecret: '',
          redirectUrl: ''
        },
        weixinMiniConfig: {
          appId: '',
          appSecret: ''
        },
        googleConfig: {
          clientId: '',
          clientSecret: '',
          redirectUrl: ''
        }
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
