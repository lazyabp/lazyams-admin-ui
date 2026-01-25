<template>
  <div class="app-container">
    <el-form ref="form" :model="settings" label-width="120px">
      <el-form-item v-for="(value, key) in settings" :key="key" :label="key">
        <el-input v-model="settings[key]" />
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
import { getAllSettings, setSetting } from '@/api/setting'

export default {
  name: 'SettingManagement',
  data() {
    return {
      settings: {}
    }
  },
  created() {
    this.fetchSettings()
  },
  methods: {
    async fetchSettings() {
      const res = await getAllSettings()
      this.settings = res
    },
    async onSubmit() {
      for (const key in this.settings) {
        if (Object.prototype.hasOwnProperty.call(this.settings, key)) {
          await setSetting(key, this.settings[key])
        }
      }
      this.$message({
        message: 'Settings saved successfully',
        type: 'success'
      })
      this.fetchSettings()
    }
  }
}
</script>
