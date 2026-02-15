<template>
  <el-dialog
    title="选择用户"
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
          placeholder="请输入用户名或邮箱"
          :clearable="true"
          prefix-icon="el-icon-search"
          style="width: 200px;"
          class="filter-item"
          @keyup.enter.native="handleSearch"
        />
        <el-button type="primary" class="filter-item" @click="handleSearch">搜索</el-button>
      </div>

      <!-- 用户列表 -->
      <div class="user-list">
        <el-table
          v-loading="loading"
          :data="userList"
          style="width: 100%; cursor: pointer;"
          @row-click="handleRowClick"
        >
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
    // 是否多选
    multiple: {
      type: Boolean,
      default: false
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
        access: 2
      },
      userList: [],
      loading: false
    }
  },
  watch: {
    visible(val) {
      this.dialogVisible = val
      if (val) {
        this.getList()
      }
    },
    dialogVisible(val) {
      if (!val) {
        this.$emit('update:visible', false)
      }
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

    // 行点击事件
    handleRowClick(row) {
      if (this.multiple) {
        // 多选逻辑
        this.$emit('changed', row)
      } else {
        // 单选逻辑
        this.$emit('changed', row)
        this.dialogVisible = false
      }
    },

    // 关闭对话框
    handleClose() {
      this.dialogVisible = false
    },

    // 分页大小改变
    handleSizeChange(size) {
      this.pageSize = size
      this.currentPage = 1
      this.fetchUserData()
    },

    // 当前页改变
    handleCurrentChange(page) {
      this.currentPage = page
      this.fetchUserData()
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
</style>
