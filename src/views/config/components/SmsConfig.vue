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
        <el-form-item label="是否启用">
          <el-switch v-model="config.enableSms" />
        </el-form-item>
        <el-form-item label="服务商">
          <el-select v-model="config.provider" placeholder="服务商">
            <el-option
              v-for="(v, k) in providers"
              :key="k"
              :label="v.title"
              :value="v.type"
            />
          </el-select>
        </el-form-item>
        <div v-if="config.provider === 0">
          <el-form-item label="AccountSid">
            <el-input v-model="config.twilio.accountSid" />
          </el-form-item>
          <el-form-item label="AuthToken">
            <el-input v-model="config.twilio.authToken" />
          </el-form-item>
          <el-form-item label="发送人手机号">
            <el-input v-model="config.twilio.fromPhoneNumber" />
          </el-form-item>
        </div>
        <div v-if="config.provider === 1">
          <el-form-item label="KeyId">
            <el-input v-model="config.alibaba.accessKeyId" />
          </el-form-item>
          <el-form-item label="Key密钥">
            <el-input v-model="config.alibaba.accessKeySecret" />
          </el-form-item>
          <el-form-item label="签名">
            <el-input v-model="config.alibaba.signName" />
          </el-form-item>
          <el-form-item label="模板代号">
            <el-input v-model="config.alibaba.templateCode" />
          </el-form-item>
        </div>
        <div v-if="config.provider === 2">
          <el-form-item label="SecretId">
            <el-input v-model="config.tencent.secretId" />
          </el-form-item>
          <el-form-item label="Secret密钥">
            <el-input v-model="config.tencent.secretKey" />
          </el-form-item>
          <el-form-item label="SmsSdkAppId">
            <el-input v-model="config.tencent.smsSdkAppId" />
          </el-form-item>
          <el-form-item label="签名">
            <el-input v-model="config.tencent.signName" />
          </el-form-item>
          <el-form-item label="模板ID">
            <el-input v-model="config.tencent.templateId" />
          </el-form-item>
        </div>
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
  name: 'SmsConfig',
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
        enableSms: false,
        provider: 0,
        alibaba: {
          accessKeyId: '',
          accessKeySecret: '',
          signName: '',
          templateCode: ''
        },
        tencent: {
          secretId: '',
          secretKey: '',
          smsSdkAppId: '1400XXXXXX',
          signName: '',
          templateId: ''
        },
        twilio: {
          accountSid: '',
          authToken: '',
          fromPhoneNumber: ''
        }
      },
      providers: [
        {
          type: 0,
          title: 'Twilio'
        },
        {
          type: 1,
          title: '阿里短信'
        },
        {
          type: 2,
          title: '腾讯短信'
        }
      ],
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
        enableSms: false,
        provider: 0,
        alibaba: {
          accessKeyId: '',
          accessKeySecret: '',
          signName: '',
          templateCode: ''
        },
        tencent: {
          secretId: '',
          secretKey: '',
          smsSdkAppId: '1400XXXXXX',
          signName: '',
          templateId: ''
        },
        twilio: {
          accountSid: '',
          authToken: '',
          fromPhoneNumber: ''
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
