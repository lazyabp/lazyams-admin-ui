<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      @open="onOpen"
      @close="onClose"
    >
      <div class="filter-container">
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
          新增
        </el-button>
      </div>
      <div>
        <el-table
          :data="features"
          style="width: 100%"
        >
          <el-table-column prop="featureKey" label="功能名" />
          <el-table-column prop="featureValue" label="功能值" />
          <el-table-column prop="featureType" label="类型">
            <template slot-scope="{row}">
              <span>{{ getFeatureTypeName(row.featureType) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="description" label="功能描述" />
          <el-table-column label="操作" width="150" align="center">
            <template slot-scope="{row}">
              <el-button type="primary" size="mini" @click="handleUpdate(row)">
                编辑
              </el-button>
              <el-button size="mini" type="danger" @click="handleDelete(row)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">
          取消
        </el-button>
        <el-button type="primary" @click="confirm">
          确定
        </el-button>
      </div>
    </el-dialog>

    <!-- 功能编辑对话框 -->
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
    >
      <el-form ref="dataForm" :model="feature" label-width="100px" style="width: 400px;">
        <el-form-item label="功能键值" prop="featureKey">
          <el-input v-model="feature.featureKey" />
        </el-form-item>
        <el-form-item label="功能值" prop="featureValue">
          <el-input v-model="feature.featureValue" />
        </el-form-item>
        <el-form-item label="功能类型" prop="featureType">
          <el-select v-model="feature.featureType" placeholder="请选择">
            <el-option
              v-for="item in featureTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="功能描述" prop="description">
          <el-input
            v-model="feature.description"
            type="textarea"
            :rows="3"
            placeholder="功能描述"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="handleSave">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getPackageFeaturesByPackageId, addPackageFeature, updatePackageFeature, deletePackageFeature } from '@/api/package-feature'

export default {
  name: 'PackageFeature',
  props: {
    packageId: {
      type: Number,
      required: false,
      default: null
    },
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '套餐功能'
    }
  },
  data() {
    return {
      feature: {
        id: undefined,
        packageId: 0,
        featureKey: '',
        featureValue: '',
        featureType: 0,
        description: ''
      },
      featureTypes: [
        {
          value: 0,
          label: '字符串'
        },
        {
          value: 1,
          label: '整型'
        },
        {
          value: 2,
          label: '浮点型'
        },
        {
          value: 3,
          label: '布尔型'
        },
        {
          value: 4,
          label: '日期'
        }
      ],
      dialogVisible: this.visible,
      features: [], // 当前套餐的功能
      selectedFeatures: [],
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      dialogFormVisible: false
    }
  },
  watch: {
    visible(val) {
      this.dialogVisible = val
    },
    dialogVisible(val) {
      this.$emit('update:visible', val)
    }
  },
  methods: {
    async loadFeatures() {
      try {
        // 获取当前套餐的所有功能
        const res = await getPackageFeaturesByPackageId(this.packageId)
        this.features = res.data
      } catch (error) {
        console.error('加载功能失败:', error)
        this.$message.error('加载功能失败')
      }
    },
    getFeatureTypeName(featureType) {
      for (const item of this.featureTypes) {
        if (item.value === featureType) {
          return item.label
        }
      }
    },
    handleSave() {
      if (this.dialogStatus === 'create') {
        this.createData()
      } else {
        this.updateData()
      }
    },
    handleCreate() {
      this.resetForm()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(row) {
      this.feature = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleDelete(row) {
      this.$confirm('确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        try {
          await deletePackageFeature(row.id)
          this.features = this.features.filter(item => item.id !== row.id)
          this.$notify({
            title: '提示',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
        } catch (error) {
          console.error('删除失败:', error)
          this.$message.error('删除失败')
        }
      })
    },
    resetForm() {
      this.feature = {
        id: undefined,
        packageId: this.packageId,
        featureKey: '',
        featureValue: '',
        featureType: 0,
        description: ''
      }
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          addPackageFeature(this.feature).then(() => {
            this.loadFeatures()
            this.dialogFormVisible = false
            this.$notify({
              title: '提示',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.feature)
          updatePackageFeature(tempData).then(() => {
            this.loadFeatures()
            this.dialogFormVisible = false
            this.$notify({
              title: '提示',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    confirm() {
      this.dialogVisible = false
      this.$emit('confirm')
    },
    cancel() {
      this.dialogVisible = false
      this.$emit('cancel')
    },
    onOpen() {
      this.loadFeatures()
    },
    onClose() {
      // 重置数据
      this.features = []
      this.selectedFeatures = []
    }
  }
}
</script>

<style scoped>

</style>
