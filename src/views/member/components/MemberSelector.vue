<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="dialogVisible"
    :before-close="handleClose"
    :close-on-click-modal="false"
    width="800px"
  >
    <div class="user-selector">
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

      <!-- 用户列表 -->
      <div class="user-list">
        <el-table
          ref="userTable"
          v-loading="loading"
          :data="userList"
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
          <el-table-column prop="userName" label="用户名" />
          <el-table-column prop="nickName" label="昵称" />
          <el-table-column prop="email" label="邮箱" />
          <el-table-column prop="isAdministrator" label="超管">
            <template slot-scope="{row}">
              <el-switch
                v-model="row.isAdministrator"
                active-color="#13ce66"
                inactive-color="#ff4949"
                disabled
              />
            </template>
          </el-table-column>
          <el-table-column prop="roles" label="角色">
            <template slot-scope="{row}">
              <el-tag
                v-for="item in row.roles"
                :key="item.id"
                effect="dark"
                size="mini"
                style="margin-right:5px;margin-bottom:5px;"
              >
                {{ item.roleName }}
              </el-tag>
            </template>
          </el-table-column>
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
import { getUsers } from '@/api/user'
import Pagination from '@/components/Pagination'

export default {
  name: 'UserSelector',
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
      default: '选择用户'
    },
    // 搜索框占位符
    searchPlaceholder: {
      type: String,
      default: '请输入用户名或邮箱'
    },
    // 是否多选
    multiple: {
      type: Boolean,
      default: false
    },
    // 初始选中的用户ID数组（用于反向绑定）
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
        limit: 20,
        access: 1
      },
      userList: [],
      loading: false,
      selectedUsers: [], // 存储选中的用户
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
        this.selectedUsers = [...newVal]
        this.$nextTick(() => {
          this.setInitialSelection()
        })
      },
      deep: true
    }
  },
  methods: {
    // 获取用户数据
    async getList() {
      this.loading = true
      try {
        const params = {
          filter: this.searchKeyword,
          page: this.listQuery.page,
          size: this.listQuery.limit,
          access: this.listQuery.access
        }
        const response = await getUsers(params)
        this.userList = response.data.items || response.data.list || [] // 根据API响应结构调整
        this.total = response.data.total || 0
        this.loading = false
      } catch (error) {
        this.loading = false
        this.$message.error('获取用户数据失败')
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
        this.selectedUsers = selection.map(item => item.id)
      }
    },
    // 行点击事件
    handleRowClick(row) {
      if (this.multiple) {
        // 多选：直接切换行的选中状态，触发 selection-change
        this.$refs.userTable.toggleRowSelection(row)
      } else {
        // 单选
        this.handleRadioChange(row)
      }
    },
    // 处理单选按钮变化
    handleRadioChange(row) {
      this.currentRadioSelection = row.id // 建议存 ID
      this.selectedUsers = [row.id]
    },
    // 设置初始选中状态
    setInitialSelection() {
      if (this.value && this.value.length > 0) {
        if (this.multiple) {
          this.selectedUsers = [...this.value]
          // 设置表格选中状态
          this.$refs.userTable.clearSelection()
          this.userList.forEach(row => {
            if (this.selectedUsers.includes(row.id)) {
              if (this.multiple) {
                this.$refs.userTable.toggleRowSelection(row, true)
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
        selectedRows = this.userList.filter(row => this.selectedUsers.includes(row.id))
      } else {
        // 单选：通过 ID 找回对象
        const target = this.userList.find(u => u.id === this.currentRadioSelection)
        selectedRows = target ? [target] : []
        // if (target) selectedRows = [target]
      }
      this.$emit('input', this.selectedUsers)
      this.$emit('changed', selectedRows)
      this.dialogVisible = false
    },
    // 清除选择
    handleClear() {
      this.selectedUsers = []
      this.currentRadioSelection = null
      // 清除表格中的选中状态
      if (this.$refs.userTable) {
        this.$refs.userTable.clearSelection()
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
.user-selector {
  padding: 20px;
}

.filter-section {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

.user-list {
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
