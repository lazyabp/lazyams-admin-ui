<template>
  <div class="app-container">
    <el-dialog
      :title="item.title"
      :visible="dialogVisible"
      :close-on-click-modal="false"
      width="700px"
      @close="handleCancel"
    >
      <el-form :model="config" label-width="160px">
        <el-tabs v-model="activeName">
          <el-tab-pane label="支付宝" name="first">
            <el-form-item label="是否启用">
              <el-switch v-model="config.alipay.isEnabled" />
            </el-form-item>
            <el-form-item label="模式">
              <el-switch v-model="config.alipay.isCertModel" active-text="证书模式" inactive-text="传统RSA2模式" />
            </el-form-item>
            <el-form-item label="支付网关地址">
              <el-input v-model="config.alipay.serverUrl" />
            </el-form-item>
            <el-form-item label="应用ID">
              <el-input v-model="config.alipay.appId" />
            </el-form-item>
            <el-form-item label="应用私钥">
              <el-input v-model="config.alipay.appPrivateKey" />
            </el-form-item>
            <el-form-item v-if="!config.alipay.isCertModel" label="支付宝公钥">
              <el-input v-model="config.alipay.alipayPublicKey" />
            </el-form-item>
            <el-form-item v-if="config.alipay.isCertModel" label="应用公钥证书序列号">
              <el-input v-model="config.alipay.appCertSN" />
            </el-form-item>
            <el-form-item v-if="config.alipay.isCertModel" label="支付宝公钥证书序列号">
              <el-input v-model="config.alipay.alipayCertSN" />
            </el-form-item>
            <el-form-item v-if="config.alipay.isCertModel" label="支付宝根证书序列号">
              <el-input v-model="config.alipay.alipayRootCertSN" />
            </el-form-item>
            <el-form-item label="加密类型（可选）">
              <el-input v-model="config.alipay.encryptType" />
            </el-form-item>
            <el-form-item v-if="config.alipay.isCertModel" label="加密密钥">
              <el-input v-model="config.alipay.encryptKey" />
            </el-form-item>
            <el-form-item label="通知地址">
              <el-input v-model="config.alipay.notifyUrl" />
            </el-form-item>
            <el-form-item label="显示顺序">
              <el-input-number v-model="config.alipay.sortOrder" :min="1" />
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="微信支付" name="second">
            <el-form-item label="是否启用">
              <el-switch v-model="config.weChatPay.isEnabled" />
            </el-form-item>
            <el-form-item label="应用ID">
              <el-input v-model="config.weChatPay.appId" />
            </el-form-item>
            <el-form-item label="商户号">
              <el-input v-model="config.weChatPay.mchId" />
            </el-form-item>
            <el-form-item label="商户证书序列号">
              <el-input v-model="config.weChatPay.mchSerialNo" />
            </el-form-item>
            <el-form-item label="商户私钥">
              <el-input v-model="config.weChatPay.mchPrivateKey" type="textarea" />
            </el-form-item>
            <el-form-item label="微信支付公钥">
              <el-input v-model="config.weChatPay.weChatPayPublicKey" type="textarea" />
            </el-form-item>
            <el-form-item label="微信支付公钥ID">
              <el-input v-model="config.weChatPay.weChatPayPublicKeyId" />
            </el-form-item>
            <el-form-item label="APIv3密钥">
              <el-input v-model="config.weChatPay.apiV3Key" />
            </el-form-item>
            <el-form-item label="通知地址">
              <el-input v-model="config.weChatPay.notifyUrl" />
            </el-form-item>
            <el-form-item label="显示顺序">
              <el-input-number v-model="config.weChatPay.sortOrder" :min="1" />
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="Stripe支付" name="third">
            <el-form-item label="是否启用">
              <el-switch v-model="config.stripe.isEnabled" />
            </el-form-item>
            <el-form-item label="可发布密钥">
              <el-input v-model="config.stripe.publishableKey" />
            </el-form-item>
            <el-form-item label="私密密钥">
              <el-input v-model="config.stripe.secretKey" />
            </el-form-item>
            <el-form-item label="Webhook签名密钥">
              <el-input v-model="config.stripe.webhookSecret" />
            </el-form-item>
            <el-form-item label="成功通知地址">
              <el-input v-model="config.stripe.successUrl" />
            </el-form-item>
            <el-form-item label="取消通知地址">
              <el-input v-model="config.stripe.cancelUrl" />
            </el-form-item>
            <!-- <el-form-item label="Webhook通知地址">
              <el-input v-model="config.stripe.webhookUrl" />
            </el-form-item> -->
            <el-form-item label="显示顺序">
              <el-input-number v-model="config.stripe.sortOrder" :min="1" />
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="PayPal支付" name="four">
            <el-form-item label="是否启用">
              <el-switch v-model="config.payPal.isEnabled" />
            </el-form-item>
            <el-form-item label="沙箱模式">
              <el-switch v-model="config.payPal.isSandbox" />
            </el-form-item>
            <el-form-item label="客户端ID">
              <el-input v-model="config.payPal.clientId" />
            </el-form-item>
            <el-form-item label="客户端密钥">
              <el-input v-model="config.payPal.clientSecret" />
            </el-form-item>
            <el-form-item label="Webhook ID">
              <el-input v-model="config.payPal.webhookId" />
            </el-form-item>
            <el-form-item label="成功通知地址">
              <el-input v-model="config.payPal.returnUrl" />
            </el-form-item>
            <el-form-item label="取消通知地址">
              <el-input v-model="config.payPal.cancelUrl" />
            </el-form-item>
            <!-- <el-form-item label="Webhook通知地址">
              <el-input v-model="config.payPal.webhookUrl" />
            </el-form-item> -->
            <el-form-item label="显示顺序">
              <el-input-number v-model="config.payPal.sortOrder" :min="1" />
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="Coinbase支付" name="five">
            <el-form-item label="是否启用">
              <el-switch v-model="config.coinbase.isEnabled" />
            </el-form-item>
            <el-form-item label="API密钥">
              <el-input v-model="config.coinbase.apiKey" />
            </el-form-item>
            <el-form-item label="状态通知地址">
              <el-input v-model="config.coinbase.redirectUrl" />
            </el-form-item>
            <el-form-item label="显示顺序">
              <el-input-number v-model="config.coinbase.sortOrder" :min="1" />
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
  name: 'PaymentConfig',
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
        alipay: {
          sortOrder: 1,
          isEnabled: true,
          serverUrl: 'https://openapi.alipay.com/gateway.do',
          appId: null,
          appPrivateKey: null,
          appCertSN: null,
          alipayPublicKey: null,
          alipayCertSN: null,
          alipayRootCertSN: null,
          encryptType: null,
          encryptKey: null,
          notifyUrl: 'http://www.demo.com/api/payment/notify/Alipay',
          isCertModel: false
        },
        weChatPay: {
          sortOrder: 2,
          isEnabled: false,
          serverUrl: 'https://api.mch.weixin.qq.com/v3/pay/transactions/native',
          appId: null,
          mchId: null,
          mchSerialNo: null,
          mchPrivateKey: null,
          weChatPayPublicKey: null,
          weChatPayPublicKeyId: null,
          apIv3Key: null,
          notifyUrl: 'http://www.demo.com/api/payment/notify/WeChatPay'
        },
        stripe: {
          sortOrder: 3,
          isEnabled: true,
          publishableKey: null,
          secretKey: null,
          webhookSecret: null,
          successUrl: 'http://www.demo.com/api/payment/notify/Stripe',
          cancelUrl: null,
          webhookUrl: 'http://www.demo.com/api/payment/notify/Stripe'
        },
        payPal: {
          sortOrder: 4,
          isEnabled: false,
          clientId: null,
          clientSecret: null,
          webhookId: null,
          isSandbox: false,
          returnUrl: 'http://www.demo.com/api/payment/notify/PayPal',
          cancelUrl: null,
          webhookUrl: 'http://www.demo.com/api/payment/notify/PayPal'
        },
        coinbase: {
          sortOrder: 5,
          isEnabled: false,
          apiKey: null,
          redirectUrl: 'http://www.demo.com/api/payment/notify/Coinbase',
          webhookSecret: null
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
        alipay: {
          sortOrder: 1,
          isEnabled: true,
          serverUrl: 'https://openapi.alipay.com/gateway.do',
          appId: null,
          appPrivateKey: null,
          appCertSN: null,
          alipayPublicKey: null,
          alipayCertSN: null,
          alipayRootCertSN: null,
          encryptType: null,
          encryptKey: null,
          notifyUrl: 'http://www.demo.com/api/payment/notify/Alipay'
        },
        weChatPay: {
          sortOrder: 2,
          isEnabled: false,
          serverUrl: 'https://api.mch.weixin.qq.com/v3/pay/transactions/native',
          appId: null,
          mchId: null,
          mchSerialNo: null,
          mchPrivateKey: null,
          weChatPayPublicKey: null,
          weChatPayPublicKeyId: null,
          apIv3Key: null,
          notifyUrl: 'http://www.demo.com/api/payment/notify/WeChatPay'
        },
        stripe: {
          sortOrder: 3,
          isEnabled: true,
          publishableKey: null,
          secretKey: null,
          webhookSecret: null,
          successUrl: 'http://www.demo.com/api/payment/notify/Stripe',
          cancelUrl: null,
          webhookUrl: 'http://www.demo.com/api/payment/notify/Stripe'
        },
        payPal: {
          sortOrder: 4,
          isEnabled: false,
          clientId: null,
          clientSecret: null,
          webhookId: null,
          isSandbox: false,
          returnUrl: 'http://www.demo.com/api/payment/notify/PayPal',
          cancelUrl: null,
          webhookUrl: 'http://www.demo.com/api/payment/notify/PayPal'
        },
        coinbase: {
          sortOrder: 5,
          isEnabled: false,
          apiKey: null,
          redirectUrl: 'http://www.demo.com/api/payment/notify/Coinbase',
          webhookSecret: null
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
