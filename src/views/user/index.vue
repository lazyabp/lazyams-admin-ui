<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.filter"
        placeholder="用户名或邮箱"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="getList"
      />
      <el-select
        v-model="listQuery.isActive"
        placeholder="状态"
        clearable
        style="width: 150px"
        class="filter-item"
      >
        <el-option
          label="启用"
          :value="true"
        />
        <el-option
          label="禁用"
          :value="false"
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
      <el-table-column label="用户名">
        <template slot-scope="{row}">
          <span>{{ row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="昵称">
        <template slot-scope="{row}">
          <span>{{ row.nickName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Email" min-width="150px">
        <template slot-scope="{row}">
          <span>{{ row.email }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="类型">
        <template slot-scope="{row}">
          <span v-for="item in types" :key="item.value">
            <span v-if="item.value === row.access">
              {{ item.label }}
            </span>
          </span>
        </template>
      </el-table-column> -->
      <el-table-column label="所属角色">
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
      <el-table-column label="性别" min-width="80px">
        <template slot-scope="{row}">
          <span v-for="item in genders" :key="item.value">
            <span v-if="item.value === row.gender">
              {{ item.label }}
            </span>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="超级管理员">
        <template slot-scope="{row}">
          <el-switch
            v-model="row.isAdministrator"
            :disabled="true"
            active-color="#13ce66"
            inactive-color="#ff4949"
          />
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
      <el-table-column label="操作" align="center" width="160" class-name="small-padding fixed-width" fixed="right">
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

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageSize" @pagination="getList" />

    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
    >
      <el-form ref="dataForm" :model="temp" label-width="100px" style="width:400px;">
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="temp.userName" />
        </el-form-item>
        <el-form-item label="昵称" prop="nickName">
          <el-input v-model="temp.nickName" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="temp.password" type="password" />
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input v-model="temp.email" />
        </el-form-item>
        <!-- <el-form-item label="类型" prop="access">
          <el-select v-model="temp.access" placeholder="请选择">
            <el-option
              v-for="t in types"
              :key="t.value"
              :label="t.label"
              :value="t.value"
            />
          </el-select>
        </el-form-item> -->
        <el-form-item label="所属角色" prop="roleIds">
          <el-select v-model="temp.roleIds" multiple placeholder="请选择">
            <el-option
              v-for="item in roles"
              :key="item.id"
              :label="item.description"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-select v-model="temp.gender" placeholder="请选择">
            <el-option
              v-for="t in genders"
              :key="t.value"
              :label="t.label"
              :value="t.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="超级管理员" prop="isAdministrator">
          <el-switch v-model="temp.isAdministrator" />
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
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getUsers, getUserById, addUser, updateUser, activeUser, deleteUser } from '@/api/user'
import { getRoles } from '@/api/role'
import Pagination from '@/components/Pagination'

export default {
  name: 'UserTable',
  components: { Pagination },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        pageIndex: 1,
        pageSize: 20,
        access: 2,
        isActive: undefined,
        filter: '',
        createBegin: undefined,
        createEnd: undefined
      },
      dateRange: [], // 用于存储日期范围选择器的值
      temp: {
        id: undefined,
        isAdministrator: false,
        isActive: false,
        userName: '',
        nickName: '',
        email: '',
        password: '',
        access: 2,
        gender: 0,
        roleIds: [],
        address: ''
      },
      roles: [],
      types: [
        {
          value: 0,
          label: '游客'
        },
        {
          value: 1,
          label: '会员'
        },
        {
          value: 2,
          label: '管理员'
        }
      ],
      genders: [
        {
          value: 0,
          label: '其它'
        },
        {
          value: 1,
          label: '男'
        },
        {
          value: 2,
          label: '女'
        }
      ],
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      }
    }
  },
  created() {
    this.loadRoles()
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      // 处理日期范围筛选
      if (this.dateRange && this.dateRange.length === 2) {
        this.listQuery.createBegin = this.dateRange[0] + 'T00:00:00'
        this.listQuery.createEnd = this.dateRange[1] + 'T23:59:59'
      } else {
        this.listQuery.createBegin = undefined
        this.listQuery.createEnd = undefined
      }
      getUsers(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    loadRoles() {
      getRoles({})
        .then(res => {
          this.roles = res.data.items
        })
    },
    resetForm() {
      this.temp = {
        id: undefined,
        isAdministrator: false,
        isActive: true,
        userName: '',
        nickName: '',
        email: '',
        password: '',
        access: 2,
        gender: 0,
        roleIds: [],
        address: ''
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
          addUser(this.temp).then(() => {
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
      getUserById(row.id).then(res => {
        this.temp = res.data
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      })
    },
    handleActive(row) {
      activeUser(row.id, { isActive: row.isActive }).then(_ => {
        this.getList()
        this.dialogFormVisible = false
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
          updateUser(tempData).then(() => {
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
        deleteUser(row.id).then(() => {
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
    resetQuery() {
      this.listQuery = {
        pageIndex: 1,
        pageSize: 20,
        access: 2,
        isActive: undefined,
        filter: '',
        createBegin: undefined,
        createEnd: undefined
      }
      this.dateRange = []
      this.getList()
    }
  }
}
</script>
