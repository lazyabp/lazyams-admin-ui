<template>
  <div class="app-container">
    <el-form ref="form" :model="configs" label-width="120px">
      <el-form-item v-for="(value, key) in configs" :key="key" :label="key">
        <el-input v-model="configs[key]" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">
          Save
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getAllConfigs, setConfig } from '@/api/config'

export default {
  name: 'ConfigManagement',
  data() {
    return {
      configs: {}
    }
  },
  created() {
    this.fetchConfigs()
  },
  methods: {
    async fetchConfigs() {
      const res = await getAllConfigs()
      this.configs = res
    },
    async onSubmit() {
      for (const key in this.configs) {
        if (Object.prototype.hasOwnProperty.call(this.configs, key)) {
          await setConfig(key, this.configs[key])
        }
      }
      this.$message({
        message: 'Configs saved successfully',
        type: 'success'
      })
      this.fetchConfigs()
    }
  }
}
</script>
