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

    <!-- 套餐功能管理 -->
    <PackageFeature
      :package-id="currentPackageId"
      :visible.sync="dialogFeaturesVisible"
    />
  </div>
</template>

<script>
import { activePackage, getPackages, getPackageById, addPackage, updatePackage, deletePackage } from '@/api/package'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import PackageFeature from './components/PackageFeature.vue'

export default {
  name: 'PackageTable',
  components: { Pagination, PackageFeature },
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
      currentPackageId: undefined
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
    // 显示功能分配对话框
    handleFeatures(row) {
      this.currentPackageId = row.id
      this.dialogFeaturesVisible = true
    }
  }
}
</script>
