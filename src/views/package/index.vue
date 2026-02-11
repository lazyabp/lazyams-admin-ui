<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        新增
      </el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <!-- <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="套餐名称">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="套餐编号">
        <template slot-scope="{row}">
          <span>{{ row.code }}</span>
        </template>
      </el-table-column>
      <el-table-column label="周期">
        <template slot-scope="{row}">
          <span>{{ getDurationUnitName(row.durationUnit) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="价格">
        <template slot-scope="{row}">
          <span>{{ row.price }}</span>
        </template>
      </el-table-column>
      <el-table-column label="折扣价">
        <template slot-scope="{row}">
          <span>{{ row.discountedPrice }}</span>
        </template>
      </el-table-column>
      <el-table-column label="启用">
        <template slot-scope="{row}">
          <el-switch
            v-model="row.isActive"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="handleActive(row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="排序">
        <template slot-scope="{row}">
          <span>{{ row.sortOrder }}</span>
        </template>
      </el-table-column>
      <el-table-column label="套餐描述" min-width="150px">
        <template slot-scope="{row}">
          <span>{{ row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="240" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button type="info" size="mini" @click="handleFeatures(row)">
            功能
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
    >
      <el-form ref="dataForm" :model="temp" label-width="100px" style="width: 400px;">
        <el-form-item label="套餐名称" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="套餐编号" prop="code">
          <el-input v-model="temp.code" />
        </el-form-item>
        <el-form-item label="版本" prop="version">
          <el-input v-model="temp.version" />
        </el-form-item>
        <el-form-item label="周期" prop="durationUnit">
          <el-select v-model="temp.durationUnit" placeholder="请选择">
            <el-option
              v-for="item in durationUnits"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input-number v-model="temp.price" :precision="2" :step="0.01" />
        </el-form-item>
        <el-form-item label="折扣价" prop="discountedPrice">
          <el-input-number v-model="temp.discountedPrice" :precision="2" :step="0.01" />
        </el-form-item>
        <el-form-item label="排序" prop="sortOrder">
          <el-input-number v-model="temp.sortOrder" :min="1" />
        </el-form-item>
        <el-form-item label="套餐描述" prop="description">
          <el-input
            v-model="temp.description"
            type="textarea"
            :rows="3"
            placeholder="套餐描述"
          />
        </el-form-item>
        <el-form-item label="启用" prop="isActive">
          <el-switch v-model="temp.isActive" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确定
        </el-button>
      </div>
    </el-dialog>

    <!-- 功能分配对话框 -->
    <el-dialog
      title="套餐功能"
      :visible.sync="dialogFeaturesVisible"
      :close-on-click-modal="false"
      width="60%"
    >
      <div>
        <el-table
          :data="allFeatures"
          style="width: 100%"
          @selection-change="handleFeatureSelectionChange"
        >
          <el-table-column type="selection" width="55" :selectable="featureSelectable" />
          <el-table-column prop="name" label="功能名称" width="200" />
          <el-table-column prop="description" label="功能描述" />
          <el-table-column prop="isEnabled" label="已启用" width="100">
            <template slot-scope="{row}">
              <el-tag :type="row.isEnabled ? 'success' : 'info'">
                {{ row.isEnabled ? '是' : '否' }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFeaturesVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="confirmFeatures">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { activePackage, getPackages, getPackageById, addPackage, updatePackage, deletePackage } from '@/api/package'
import { getPackageFeatures, getPackageFeaturesByPackageId, batchAddPackageFeatures, batchDeletePackageFeatures } from '@/api/package-feature'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'PackageTable',
  components: { Pagination },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      },
      temp: {
        id: undefined,
        name: '',
        code: '',
        version: '',
        description: '',
        price: 0,
        discountedPrice: 0,
        durationUnit: 3,
        sortOrder: 1,
        isActive: true
      },
      durationUnits: [
        {
          label: '天',
          value: 1
        },
        {
          label: '周',
          value: 2
        },
        {
          label: '月',
          value: 3
        },
        {
          label: '年',
          value: 4
        }
      ],
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      // 功能相关数据
      dialogFeaturesVisible: false,
      currentPackageId: undefined,
      allFeatures: [], // 所有可用功能
      selectedFeatures: [], // 当前选中的功能
      packageFeatures: [] // 当前套餐已有的功能
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getPackages({ PageIndex: this.listQuery.page, PageSize: this.listQuery.limit }).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    resetForm() {
      this.temp = {
        id: undefined,
        name: '',
        code: '',
        version: '',
        description: '',
        price: 0,
        discountedPrice: 0,
        durationUnit: 3,
        sortOrder: 1,
        isActive: true
      }
    },
    getDurationUnitName(durationUnit) {
      for (const item of this.durationUnits) {
        if (item.value === durationUnit) {
          return item.label
        }
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
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          addPackage(this.temp).then(() => {
            this.getList()
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
    handleUpdate(row) {
      getPackageById(row.id).then(res => {
        this.temp = res.data
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      })
    },
    handleActive(row) {
      // 更新激活状态的逻辑
      const data = { isActive: row.isActive }
      activePackage(row.id, data).then(() => {
        this.getList()
        this.$notify({
          title: '提示',
          message: '更新成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updatePackage(tempData).then(() => {
            this.getList()
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
    handleDelete(row) {
      this.$confirm('确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deletePackage(row.id).then(() => {
          this.getList()
          this.$notify({
            title: '提示',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
        })
      })
    },
    // 功能管理相关方法
    async handleFeatures(row) {
      this.currentPackageId = row.id
      this.dialogFeaturesVisible = true

      try {
        // 获取所有功能和当前套餐的功能
        const [allFeaturesRes, packageFeaturesRes] = await Promise.all([
          getPackageFeatures({ PageIndex: 1, PageSize: 1000 }),
          getPackageFeaturesByPackageId(row.id)
        ])

        this.allFeatures = allFeaturesRes.data.items || []
        this.packageFeatures = packageFeaturesRes.data || []

        // 设置默认选中状态
        this.$nextTick(() => {
          this.allFeatures.forEach(feature => {
            const isSelected = this.packageFeatures.some(pf => pf.featureId === feature.id)
            if (isSelected) {
              this.$refs['dataForm']?.toggleRowSelection?.(feature, true)
            }
          })
        })
      } catch (error) {
        console.error('加载功能失败:', error)
        this.$message.error('加载功能失败')
      }
    },

    handleFeatureSelectionChange(selection) {
      this.selectedFeatures = selection
    },

    featureSelectable(row) {
      // 如果功能已被禁用，则不允许选择
      return row.isEnabled !== false
    },

    async confirmFeatures() {
      try {
        // 计算需要添加和删除的功能
        const currentFeatureIds = this.packageFeatures.map(f => f.featureId)
        const selectedFeatureIds = this.selectedFeatures.map(f => f.id)

        // 需要添加的功能
        const toAdd = selectedFeatureIds.filter(id => !currentFeatureIds.includes(id))
        // 需要删除的功能
        const toRemove = currentFeatureIds.filter(id => !selectedFeatureIds.includes(id))

        // 执行添加操作
        if (toAdd.length > 0) {
          const featuresToAdd = toAdd.map(featureId => ({
            packageId: this.currentPackageId,
            featureId: featureId,
            isEnabled: true
          }))

          await batchAddPackageFeatures(this.currentPackageId, featuresToAdd)
        }

        // 执行删除操作
        if (toRemove.length > 0) {
          await batchDeletePackageFeatures(toRemove)
        }

        this.dialogFeaturesVisible = false
        this.$notify({
          title: '提示',
          message: '功能更新成功',
          type: 'success',
          duration: 2000
        })
      } catch (error) {
        console.error('更新功能失败:', error)
        this.$message.error('更新功能失败')
      }
    }
  }
}
</script>
