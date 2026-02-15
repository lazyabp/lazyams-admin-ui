<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.filter"
        placeholder="筛选条件"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="getList"
      />
      <el-select
        v-model="listQuery.userId"
        placeholder="用户"
        clearable
        style="width: 150px"
        class="filter-item"
      >
        <el-option
          v-for="item in users"
          :key="item.id"
          :label="item.userName"
          :value="item.id"
        />
      </el-select>
      <el-select
        v-model="listQuery.packageId"
        placeholder="套餐"
        clearable
        style="width: 150px"
        class="filter-item"
      >
        <el-option
          v-for="item in packages"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <el-select
        v-model="listQuery.status"
        placeholder="状态"
        clearable
        style="width: 150px"
        class="filter-item"
      >
        <el-option
          v-for="item in subscriptionStatusOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-date-picker
        v-model="dateRange"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        class="filter-item"
        style="width: 240px;"
      />
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="getList"
      >
        搜索
      </el-button>
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-refresh"
        @click="resetQuery"
      >
        重置
      </el-button>
      <el-button class="filter-item" type="success" icon="el-icon-edit" @click="handleCreate">
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
      <!-- <el-table-column label="ID" prop="id" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="用户" min-width="120px">
        <template slot-scope="{row}">
          <span>{{ row.user ? row.user.userName : '' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="套餐" min-width="120px">
        <template slot-scope="{row}">
          <span>{{ row.package ? row.package.name : '' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="开始时间" width="160px">
        <template slot-scope="{row}">
          <span>{{ row.startAt | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结束时间" width="160px">
        <template slot-scope="{row}">
          <span>{{ row.endAt | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="120px">
        <template slot-scope="{row}">
          <el-tag
            :type="statusTagType(row.status)"
            effect="dark"
          >
            {{ statusText(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="120" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="{row}">
          <el-dropdown trigger="click" placement="bottom">
            <el-button type="primary" size="mini">
              操作
              <i class="el-icon-arrow-down el-icon--right" />
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :disabled="row.status === 0" @click.native="handleSetActive(row)">设为激活</el-dropdown-item>
              <el-dropdown-item :disabled="row.status !== 0" @click.native="handleSetFreezed(row)">设为冻结</el-dropdown-item>
              <el-dropdown-item :disabled="row.status !== 0" @click.native="handleSetExpired(row)">设为过期</el-dropdown-item>
              <el-dropdown-item @click.native="handleUpdate(row)">编辑</el-dropdown-item>
              <el-dropdown-item @click.native="handleDelete(row)">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
    >
      <el-form ref="dataForm" :model="temp" label-width="120px" style="width: 400px;">
        <el-form-item label="用户" prop="userId">
          <el-tag
            v-if="temp.nickName"
            style="margin-right: 10px;"
            effect="dark"
          >
            {{ temp.nickName }}
          </el-tag>
          <el-button type="info" size="mini" @click="userSelectorVisible = true">选择用户</el-button>
        </el-form-item>
        <el-form-item label="套餐" prop="packageId">
          <el-select v-model="temp.packageId" placeholder="请选择套餐" style="width: 100%">
            <el-option
              v-for="item in packages"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="开始时间" prop="startAt">
          <el-date-picker
            v-model="temp.startAt"
            type="date"
            placeholder="选择开始时间"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-ddTHH:mm:ss"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="结束时间" prop="endAt">
          <el-date-picker
            v-model="temp.endAt"
            type="date"
            placeholder="选择结束时间"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-ddTHH:mm:ss"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="temp.status" placeholder="请选择状态" style="width: 100%">
            <el-option
              v-for="item in subscriptionStatusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" :disabled="listLoading" @click="handleSave">
          确认
        </el-button>
      </div>
    </el-dialog>

    <member-selector
      :visible.sync="userSelectorVisible"
      :value="temp.userId ? [temp.userId] : []"
      @changed="handleUserSelected"
    />
  </div>
</template>

<script>
import { getUserSubscriptions, getUserSubscriptionById, addUserSubscription, updateUserSubscription, setUserSubscriptionExpired, setUserSubscriptionFreezed, setUserSubscriptionActive, deleteUserSubscription } from '@/api/user-subscription'
import { getPackages } from '@/api/package'
import Pagination from '@/components/Pagination'
import MemberSelector from '../member/components/MemberSelector.vue'

export default {
  name: 'UserSubscriptionTable',
  components: { Pagination, MemberSelector },
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: 'danger',
        1: 'success',
        2: 'warning'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        filter: '',
        userId: undefined,
        packageId: undefined,
        status: undefined,
        beginStartAt: undefined,
        lastStartAt: undefined,
        beginEndAt: undefined,
        lastEndAt: undefined
      },
      dateRange: [], // 用于存储日期范围选择器的值
      temp: {
        id: undefined,
        userId: undefined,
        nickName: '',
        packageId: undefined,
        startAt: undefined,
        endAt: undefined,
        status: 0
      },
      users: [],
      packages: [],
      subscriptionStatusOptions: [
        { value: 0, label: '激活中' },
        { value: 1, label: '已过期' },
        { value: 2, label: '已冻结' }
      ],
      dialogFormVisible: false,
      dialogStatus: '',
      userSelectorVisible: false,
      textMap: {
        update: '编辑',
        create: '创建'
      }
    }
  },
  created() {
    this.getList()
    this.loadPackages()
  },
  methods: {
    getList() {
      this.listLoading = true
      // 处理日期范围筛选
      if (this.dateRange && this.dateRange.length === 2) {
        this.listQuery.beginStartAt = this.dateRange[0] + 'T00:00:00'
        this.listQuery.lastStartAt = this.dateRange[1] + 'T23:59:59'
      } else {
        this.listQuery.beginStartAt = undefined
        this.listQuery.lastStartAt = undefined
      }
      getUserSubscriptions(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    resetQuery() {
      this.listQuery.filter = ''
      this.listQuery.userId = undefined
      this.listQuery.packageId = undefined
      this.listQuery.status = undefined
      this.dateRange = []
      this.getList()
    },
    loadPackages() {
      getPackages({ PageIndex: 1, PageSize: 1000 }).then(response => {
        this.packages = response.data.items
      })
    },
    statusTagType(status) {
      const statusMap = {
        0: 'success',
        1: 'danger',
        2: 'warning'
      }
      return statusMap[status] || 'info'
    },
    statusText(status) {
      const statusMap = {
        0: '激活中',
        1: '已过期',
        2: '已冻结'
      }
      return statusMap[status] || '未知'
    },
    resetForm() {
      this.temp = {
        id: undefined,
        userId: undefined,
        nickName: '',
        packageId: undefined,
        startAt: undefined,
        endAt: undefined,
        status: 0
      }
    },
    handleSave() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.dialogStatus === 'create') {
            addUserSubscription(this.temp).then(() => {
              this.resetForm()
              this.getList()
              this.dialogFormVisible = false
              this.$notify({
                title: '提示',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
            })
          } else if (this.dialogStatus === 'update') {
            updateUserSubscription(this.temp).then(() => {
              this.resetForm()
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
        }
      })
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
      getUserSubscriptionById(row.id).then(response => {
        this.temp = response.data
        this.temp.nickName = this.temp.user ? this.temp.user.nickName || this.temp.user.userName : ''
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      })
    },
    handleSetActive(row) {
      this.$confirm(`确定要将此订阅设置为激活状态吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        setUserSubscriptionActive(row.id).then(() => {
          this.getList()
          this.$notify({
            title: '提示',
            message: '设置成功',
            type: 'success',
            duration: 2000
          })
        })
      })
    },
    handleSetFreezed(row) {
      this.$confirm(`确定要将此订阅设置为冻结状态吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        setUserSubscriptionFreezed(row.id).then(() => {
          this.getList()
          this.$notify({
            title: '提示',
            message: '设置成功',
            type: 'success',
            duration: 2000
          })
        })
      })
    },
    handleSetExpired(row) {
      this.$confirm(`确定要将此订阅设置为过期状态吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        setUserSubscriptionExpired(row.id).then(() => {
          this.getList()
          this.$notify({
            title: '提示',
            message: '设置成功',
            type: 'success',
            duration: 2000
          })
        })
      })
    },
    handleDelete(row) {
      this.$confirm('确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUserSubscription(row.id).then(() => {
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
    handleUserSelected(selectedRows) {
      if (selectedRows && selectedRows.length > 0) {
        const user = selectedRows[0] // 获取数组第一个用户对象
        this.temp.userId = user.id
        this.temp.nickName = user.nickName || user.userName
      } else {
        this.temp.userId = undefined
        this.temp.nickName = ''
      }
      this.userSelectorVisible = false
    }
  }
}
</script>
