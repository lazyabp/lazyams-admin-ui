<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="dialogVisible"
    :before-close="handleClose"
    :close-on-click-modal="false"
    width="800px"
  >
    <div class="package-selector">
      <!-- 搜索筛选区域 -->
      <div class="filter-container">
        <el-input
          v-model="searchKeyword"
          :placeholder="searchPlaceholder"
          :clearable="true"
          prefix-icon="el-icon-search"
          style="width: 200px"
          class="filter-item"
          @keyup.enter.native="handleSearch"
        />
        <el-button type="primary" class="filter-item" @click="handleSearch">搜索</el-button>
      </div>

      <!-- 套餐列表 -->
      <div class="package-list">
        <el-table
          ref="packageTable"
          v-loading="loading"
          :data="packageList"
          :highlight-current-row="!multiple"
          style="width: 100%; cursor: pointer;"
          @selection-change="handleSelectionChange"
          @row-click="handleRowClick"
        >
          <el-table-column
            v-if="multiple"
            type="selection"
            width="55"
            :reserve-selection="true"
          />
          <el-table-column
            v-else
            label="选择"
            width="55"
          >
            <template slot-scope="{row}">
              <el-radio
                v-model="currentRadioSelection"
                :label="row.id"
                class="single-radio"
                @change.native.stop="handleRadioChange(row)"
              />
            </template>
          </el-table-column>
          <el-table-column prop="name" label="套餐名称" />
          <el-table-column prop="code" label="套餐编号" />
          <el-table-column prop="version" label="版本" />
          <el-table-column prop="price" label="价格" />
          <el-table-column prop="discountedPrice" label="折扣价" />
          <el-table-column prop="currency" label="货币" />
          <el-table-column prop="isActive" label="启用">
            <template slot-scope="{row}">
              <el-switch
                v-model="row.isActive"
                active-color="#13ce66"
                inactive-color="#ff4949"
                disabled
              />
            </template>
          </el-table-column>
          <el-table-column prop="sortOrder" label="排序" />
        </el-table>
      </div>

      <!-- 分页 -->
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

      <!-- 底部按钮 -->
      <div class="dialog-footer" style="text-align: right; margin-top: 20px;">
        <el-button @click="handleClear">清除</el-button>
        <el-button type="primary" @click="handleConfirm">确定</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { getPackages } from '@/api/package'
import Pagination from '@/components/Pagination'

export default {
  name: 'PackageSelector',
  components: { Pagination },
  props: {
    // 控制对话框显示隐藏
    visible: {
      type: Boolean,
      default: false
    },
    // 对话框标题
    dialogTitle: {
      type: String,
      default: '选择套餐'
    },
    // 搜索框占位符
    searchPlaceholder: {
      type: String,
      default: '请输入套餐名称或描述'
    },
    // 是否多选
    multiple: {
      type: Boolean,
      default: false
    },
    // 初始选中的套餐ID数组（用于反向绑定）
    value: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      dialogVisible: false,
      searchKeyword: '',
      total: 0,
      listQuery: {
        page: 1,
        limit: 20
      },
      packageList: [],
      loading: false,
      selectedPackages: [], // 存储选中的套餐
      currentRadioSelection: null // 单选时存储当前选中项
    }
  },
  watch: {
    visible(val) {
      this.dialogVisible = val
      if (val) {
        this.getList()
        this.$nextTick(() => {
          // 在数据加载完成后设置初始选中状态
          this.$nextTick(() => {
            this.setInitialSelection()
          })
        })
      }
    },
    dialogVisible(val) {
      if (!val) {
        this.$emit('update:visible', false)
      }
    },
    value: {
      handler(newVal) {
        this.selectedPackages = [...newVal]
        this.$nextTick(() => {
          this.setInitialSelection()
        })
      },
      deep: true
    }
  },
  methods: {
    // 获取套餐数据
    async getList() {
      this.loading = true
      try {
        const params = {
          filter: this.searchKeyword,
          PageIndex: this.listQuery.page,
          PageSize: this.listQuery.limit
        }
        const response = await getPackages(params)
        this.packageList = response.data.items || response.data.list || [] // 根据API响应结构调整
        this.total = response.data.total || 0
        this.loading = false
      } catch (error) {
        this.loading = false
        this.$message.error('获取套餐数据失败')
        console.error(error)
      }
    },
    // 处理搜索
    handleSearch() {
      this.listQuery.page = 1
      this.getList()
    },
    // 重置筛选条件
    resetFilter() {
      this.searchKeyword = ''
      this.listQuery.page = 1
      this.getList()
    },
    // 处理表格选择变化（多选）
    handleSelectionChange(selection) {
      if (this.multiple) {
        // 修正：存储 ID 数组
        this.selectedPackages = selection.map(item => item.id)
      }
    },
    // 行点击事件
    handleRowClick(row) {
      if (this.multiple) {
        // 多选：直接切换行的选中状态，触发 selection-change
        this.$refs.packageTable.toggleRowSelection(row)
      } else {
        // 单选
        this.handleRadioChange(row)
      }
    },
    // 处理单选按钮变化
    handleRadioChange(row) {
      this.currentRadioSelection = row.id // 建议存 ID
      this.selectedPackages = [row.id]
    },
    // 设置初始选中状态
    setInitialSelection() {
      if (this.value && this.value.length > 0) {
        if (this.multiple) {
          this.selectedPackages = [...this.value]
          // 设置表格选中状态
          this.$refs.packageTable.clearSelection()
          this.packageList.forEach(row => {
            if (this.selectedPackages.includes(row.id)) {
              if (this.multiple) {
                this.$refs.packageTable.toggleRowSelection(row, true)
              } else {
                this.currentRadioSelection = row.id // 单选回显
              }
            }
          })
        } else {
          this.currentRadioSelection = this.value[0] // 单选只取第一个
        }
      }
    },
    // 确认选择
    handleConfirm() {
      let selectedRows = []
      if (this.multiple) {
        selectedRows = this.packageList.filter(row => this.selectedPackages.includes(row.id))
      } else {
        // 单选：通过 ID 找回对象
        const target = this.packageList.find(p => p.id === this.currentRadioSelection)
        selectedRows = target ? [target] : []
        // if (target) selectedRows = [target]
      }
      this.$emit('input', this.selectedPackages)
      this.$emit('changed', selectedRows)
      this.dialogVisible = false
    },
    // 清除选择
    handleClear() {
      this.selectedPackages = []
      this.currentRadioSelection = null
      // 清除表格中的选中状态
      if (this.$refs.packageTable) {
        this.$refs.packageTable.clearSelection()
      }
      // 触发清除事件
      this.$emit('input', [])
      this.$emit('cleared')
    },
    // 关闭对话框
    handleClose() {
      this.dialogVisible = false
    },
    // 分页大小改变
    handleSizeChange(size) {
      this.listQuery.limit = size
      this.getList()
    },
    // 当前页改变
    handleCurrentChange(page) {
      this.listQuery.page = page
      this.getList()
    }
  }
}
</script>

<style scoped>
.package-selector {
  padding: 20px;
}

.filter-section {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

.package-list {
  min-height: 300px;
}

.pagination {
  margin-top: 20px;
  text-align: center;
}

.single-radio {
  margin-right: 0;
  display: inline-block;
  vertical-align: middle;
  line-height: 1;
}

.single-radio ::v-deep .el-radio__label {
  display: none !important;
}
</style>
