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
        <el-form-item label="发送方式">
          <el-select v-model="config.mailer" placeholder="发送方式">
            <el-option
              v-for="(v, k) in mailers"
              :key="k"
              :label="v.title"
              :value="v.type"
            />
          </el-select>
        </el-form-item>
        <div v-if="config.mailer === 0">
          <el-form-item label="邮件服务器">
            <el-input v-model="config.smtp.host" />
          </el-form-item>
          <el-form-item label="端口">
            <el-input v-model="config.smtp.port" />
          </el-form-item>
          <el-form-item label="开启SSL">
            <el-switch v-model="config.smtp.enableSsl" />
          </el-form-item>
          <el-form-item label="用户名">
            <el-input v-model="config.smtp.userName" />
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="config.smtp.password" />
          </el-form-item>
          <el-form-item label="发件人Email">
            <el-input v-model="config.smtp.fromAddress" />
          </el-form-item>
        </div>
        <div v-if="config.mailer === 1">
          <el-form-item label="Api Token">
            <el-input v-model="config.resend.apiToken" />
          </el-form-item>
          <el-form-item label="发送人Email">
            <el-input v-model="config.resend.fromAddress" />
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
  name: 'SmtpConfig',
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
        mailer: 0,
        smtp: {
          host: '',
          port: 25,
          enableSsl: false,
          userName: '',
          password: '',
          fromAddress: ''
        },
        resend: {
          apiToken: '',
          fromAddress: ''
        }
      },
      mailers: [
        {
          type: 0,
          title: 'SMTP'
        },
        {
          type: 1,
          title: 'RESEND'
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
        mailer: 0,
        smtp: {
          host: '',
          port: 25,
          enableSsl: false,
          userName: '',
          password: '',
          fromAddress: ''
        },
        resend: {
          apiToken: '',
          fromAddress: ''
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
