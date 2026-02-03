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
        <el-form-item label="存储方式">
          <el-select v-model="config.type" placeholder="存储方式">
            <el-option
              v-for="(v, k) in types"
              :key="k"
              :label="v.title"
              :value="v.type"
            />
          </el-select>
        </el-form-item>
        <div v-if="config.type === 0">
          <el-form-item label="文件存储目录">
            <el-input v-model="config.local.uploadDir" />
          </el-form-item>
          <el-form-item label="访问基地址">
            <el-input v-model="config.local.baseUrl" />
          </el-form-item>
        </div>
        <div v-if="config.type === 1">
          <el-form-item label="ID">
            <el-input v-model="config.aliyun.accessKey" />
          </el-form-item>
          <el-form-item label="Secret">
            <el-input v-model="config.aliyun.secretKey" />
          </el-form-item>
          <el-form-item label="桶名">
            <el-input v-model="config.aliyun.bucket" />
          </el-form-item>
          <el-form-item label="区域">
            <el-input v-model="config.aliyun.region" />
          </el-form-item>
          <el-form-item label="API地址">
            <el-input v-model="config.aliyun.endPoint" />
          </el-form-item>
          <el-form-item label="访问基地址">
            <el-input v-model="config.aliyun.baseUrl" />
          </el-form-item>
        </div>
        <div v-if="config.type === 2">
          <el-form-item label="AccessKey">
            <el-input v-model="config.qiniu.accessKey" />
          </el-form-item>
          <el-form-item label="SecretKey">
            <el-input v-model="config.qiniu.secretKey" />
          </el-form-item>
          <el-form-item label="桶名">
            <el-input v-model="config.qiniu.bucket" />
          </el-form-item>
          <el-form-item label="区域">
            <el-input v-model="config.qiniu.region" />
          </el-form-item>
          <el-form-item label="API地址">
            <el-input v-model="config.qiniu.endPoint" />
          </el-form-item>
          <el-form-item label="访问基地址">
            <el-input v-model="config.qiniu.baseUrl" />
          </el-form-item>
        </div>
        <div v-if="config.type === 3">
          <el-form-item label="SecretID">
            <el-input v-model="config.tencent.accessKey" />
          </el-form-item>
          <el-form-item label="SecretKey">
            <el-input v-model="config.tencent.secretKey" />
          </el-form-item>
          <el-form-item label="桶名">
            <el-input v-model="config.tencent.bucket" />
          </el-form-item>
          <el-form-item label="区域">
            <el-input v-model="config.tencent.region" />
          </el-form-item>
          <el-form-item label="API地址">
            <el-input v-model="config.tencent.endPoint" />
          </el-form-item>
          <el-form-item label="访问基地址">
            <el-input v-model="config.tencent.baseUrl" />
          </el-form-item>
        </div>
        <div v-if="config.type === 4">
          <el-form-item label="用户名">
            <el-input v-model="config.minio.accessKey" />
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="config.minio.secretKey" />
          </el-form-item>
          <el-form-item label="桶名">
            <el-input v-model="config.minio.bucket" />
          </el-form-item>
          <el-form-item label="区域">
            <el-input v-model="config.minio.region" />
          </el-form-item>
          <el-form-item label="API地址">
            <el-input v-model="config.minio.endPoint" />
          </el-form-item>
          <el-form-item label="访问基地址">
            <el-input v-model="config.minio.baseUrl" />
          </el-form-item>
        </div>
        <div v-if="config.type === 5">
          <el-form-item label="AccessKey">
            <el-input v-model="config.awsS3.accessKey" />
          </el-form-item>
          <el-form-item label="SecretKey">
            <el-input v-model="config.awsS3.secretKey" />
          </el-form-item>
          <el-form-item label="桶名">
            <el-input v-model="config.awsS3.bucket" />
          </el-form-item>
          <el-form-item label="区域">
            <el-input v-model="config.awsS3.region" />
          </el-form-item>
          <el-form-item label="API地址">
            <el-input v-model="config.awsS3.endPoint" />
          </el-form-item>
          <el-form-item label="访问基地址">
            <el-input v-model="config.awsS3.baseUrl" />
          </el-form-item>
        </div>
        <div v-if="config.type === 99">
          <el-form-item label="文件域(file)">
            <el-input v-model="config.custom.fieldName" />
          </el-form-item>
          <el-form-item label="授权令牌">
            <el-input v-model="config.custom.token" />
          </el-form-item>
          <el-form-item label="API地址">
            <el-input v-model="config.custom.endPoint" />
          </el-form-item>
          <el-form-item label="访问基地址">
            <el-input v-model="config.custom.baseUrl" />
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
  name: 'UploadConfig',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    item: {
      type: Object,
      default: () => ({
        type: '',
        description: '',
        key: ''
      })
    }
  },
  data() {
    return {
      config: {
        type: 0,
        local: {
          uploadDir: 'uploads',
          baseUrl: 'http://localhost:9000'
        },
        aliyun: {
          accessKey: '',
          secretKey: '',
          bucket: '',
          endPoint: 'https://oss-example.oss-cn-hangzhou.aliyuncs.com',
          region: '',
          baseUrl: 'http://im.demo.com'
        },
        qiniu: {
          accessKey: '',
          secretKey: '',
          bucket: '',
          endPoint: 'http://upload.qiniup.com',
          region: '',
          baseUrl: 'http://im.demo.com'
        },
        tencent: {
          accessKey: '',
          secretKey: '',
          bucket: '',
          endPoint: 'https://cos.ap-guangzhou.myqcloud.com',
          region: '',
          baseUrl: 'http://im.demo.com'
        },
        minio: {
          accessKey: '',
          secretKey: '',
          bucket: '',
          endPoint: 'http://api.minio-server.com',
          region: '',
          baseUrl: 'http://im.demo.com'
        },
        awsS3: {
          accessKey: '',
          secretKey: '',
          bucket: '',
          endPoint: 'my-bucket.s3.us-east-1.amazonaws.com',
          region: '',
          baseUrl: 'http://im.demo.com'
        },
        custom: {
          token: '',
          endPoint: 'http://api.customer-domain.com',
          fieldName: 'file',
          baseUrl: 'http://im.demo.com'
        }
      },
      types: [
        {
          type: 0,
          title: '本地存储'
        },
        {
          type: 1,
          title: '阿里OSS'
        },
        {
          type: 2,
          title: '七牛KODO'
        },
        {
          type: 3,
          title: '腾讯COS'
        },
        {
          type: 4,
          title: 'Minio'
        },
        {
          type: 5,
          title: 'AWS S3'
        },
        {
          type: 99,
          title: '自定义'
        }
      ],
      storageName: '本地存储',
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
        if (newVal && this.item.key) {
          this.fetchConfig()
        } else if (!newVal) {
          // 对话框关闭时重置表单
          this.resetForm()
        }
      }
    },
    'config.type': {
      immediate: true,
      handler(newVal) {

      }
    }
  },
  methods: {
    async fetchConfig() {
      const res = await getConfig(this.item.key)
      if (res && res.data) {
        this.config = res.data
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
        Type: 0
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
