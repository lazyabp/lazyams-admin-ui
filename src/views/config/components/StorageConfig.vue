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
          <el-select v-model="config.Type" placeholder="存储方式" @change="handleTypeChanged">
            <el-option
              v-for="(v, k) in types"
              :key="k"
              :label="v.title"
              :value="v.type"
            />
          </el-select>
        </el-form-item>
        <el-divider>{{ storageName }}</el-divider>
        <div v-if="config.Type === 0">
          <el-form-item label="文件存储目录">
            <el-input v-model="localStorage.UploadDir" />
          </el-form-item>
          <el-form-item label="访问基地址">
            <el-input v-model="localStorage.BaseUrl" />
          </el-form-item>
        </div>
        <div v-if="config.Type === 1">
          <el-form-item label="ID">
            <el-input v-model="storage.AccessKey" />
          </el-form-item>
          <el-form-item label="Secret">
            <el-input v-model="storage.SecretKey" />
          </el-form-item>
          <el-form-item label="桶名">
            <el-input v-model="storage.Bucket" />
          </el-form-item>
          <el-form-item label="区域">
            <el-input v-model="storage.Region" />
          </el-form-item>
          <el-form-item label="API地址">
            <el-input v-model="storage.EndPoint" />
          </el-form-item>
          <el-form-item label="访问基地址">
            <el-input v-model="storage.BaseUrl" />
          </el-form-item>
        </div>
        <div v-if="config.Type === 2">
          <el-form-item label="AccessKey">
            <el-input v-model="storage.AccessKey" />
          </el-form-item>
          <el-form-item label="SecretKey">
            <el-input v-model="storage.SecretKey" />
          </el-form-item>
          <el-form-item label="桶名">
            <el-input v-model="storage.Bucket" />
          </el-form-item>
          <el-form-item label="区域">
            <el-input v-model="storage.Region" />
          </el-form-item>
          <el-form-item label="API地址">
            <el-input v-model="storage.EndPoint" />
          </el-form-item>
          <el-form-item label="访问基地址">
            <el-input v-model="storage.BaseUrl" />
          </el-form-item>
        </div>
        <div v-if="config.Type === 3">
          <el-form-item label="SecretID">
            <el-input v-model="storage.AccessKey" />
          </el-form-item>
          <el-form-item label="SecretKey">
            <el-input v-model="storage.SecretKey" />
          </el-form-item>
          <el-form-item label="桶名">
            <el-input v-model="storage.Bucket" />
          </el-form-item>
          <el-form-item label="区域">
            <el-input v-model="storage.Region" />
          </el-form-item>
          <el-form-item label="API地址">
            <el-input v-model="storage.EndPoint" />
          </el-form-item>
          <el-form-item label="访问基地址">
            <el-input v-model="storage.BaseUrl" />
          </el-form-item>
        </div>
        <div v-if="config.Type === 4">
          <el-form-item label="用户名">
            <el-input v-model="storage.AccessKey" />
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="storage.SecretKey" />
          </el-form-item>
          <el-form-item label="桶名">
            <el-input v-model="storage.Bucket" />
          </el-form-item>
          <el-form-item label="区域">
            <el-input v-model="storage.Region" />
          </el-form-item>
          <el-form-item label="API地址">
            <el-input v-model="storage.EndPoint" />
          </el-form-item>
          <el-form-item label="访问基地址">
            <el-input v-model="storage.BaseUrl" />
          </el-form-item>
        </div>
        <div v-if="config.Type === 5">
          <el-form-item label="AccessKey">
            <el-input v-model="storage.AccessKey" />
          </el-form-item>
          <el-form-item label="SecretKey">
            <el-input v-model="storage.SecretKey" />
          </el-form-item>
          <el-form-item label="桶名">
            <el-input v-model="storage.Bucket" />
          </el-form-item>
          <el-form-item label="区域">
            <el-input v-model="storage.Region" />
          </el-form-item>
          <el-form-item label="API地址">
            <el-input v-model="storage.EndPoint" />
          </el-form-item>
          <el-form-item label="访问基地址">
            <el-input v-model="storage.BaseUrl" />
          </el-form-item>
        </div>
        <div v-if="config.Type === 99">
          <el-form-item label="文件域(file)">
            <el-input v-model="customStorage.FieldName" />
          </el-form-item>
          <el-form-item label="授权令牌">
            <el-input v-model="customStorage.Token" />
          </el-form-item>
          <el-form-item label="API地址">
            <el-input v-model="customStorage.EndPoint" />
          </el-form-item>
          <el-form-item label="访问基地址">
            <el-input v-model="customStorage.BaseUrl" />
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
        Type: 0
      },
      types: [
        {
          type: 0,
          key: 'storage.local',
          title: '本地存储'
        },
        {
          type: 1,
          key: 'storage.aliyunoss',
          title: '阿里OSS'
        },
        {
          type: 2,
          key: 'storage.qiniukodo',
          title: '七牛KODO'
        },
        {
          type: 3,
          key: 'storage.tencentcos',
          title: '腾讯COS'
        },
        {
          type: 4,
          key: 'storage.minio',
          title: 'Minio'
        },
        {
          type: 5,
          key: 'storage.awss3',
          title: 'AWS S3'
        },
        {
          type: 99,
          key: 'storage.custom',
          title: '自定义'
        }
      ],
      storage: {
        AccessKey: '',
        SecretKey: '',
        Bucket: '',
        EndPoint: '',
        Region: '',
        BaseUrl: ''
      },
      localStorage: {
        UploadDir: '',
        BaseUrl: ''
      },
      customStorage: {
        Token: '',
        EndPoint: '',
        FieldName: '',
        BaseUrl: ''
      },
      storageKey: '',
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
      const res = await getConfig(this.item.key)
      if (res && res.data) {
        this.config = res.data
        this.handleTypeChanged(this.config.Type)
      }
    },
    async handleTypeChanged(value) {
      const type = this.types.find(x => x.type === value)
      const key = type.key
      // console.log('type', type)
      for (const d of this.types) {
        if (d.key === key) {
          this.storageKey = d.key
          this.storageName = d.title
        }
      }
      this.loading = true
      const res = await getConfig(key)
      if (res && res.data) {
        switch (key) {
          case 'storage.local':
            this.localStorage = res.data
            break
          case 'storage.custom':
            this.customStorage = res.data
            break
          default:
            this.storage = res.data
            break
        }
      }
      this.loading = false
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
        switch (this.storageKey) {
          case 'storage.local':
            await setConfig(this.storageKey, this.localStorage)
            break
          case 'storage.custom':
            await setConfig(this.storageKey, this.customStorage)
            break
          default:
            await setConfig(this.storageKey, this.storage)
            break
        }
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
