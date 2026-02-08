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
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <!-- <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="角色名" min-width="150px">
        <template slot-scope="{row}">
          <span>{{ row.roleName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色描述" min-width="150px">
        <template slot-scope="{row}">
          <span>{{ row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column label="启用" min-width="100px">
        <template slot-scope="{row}">
          <el-switch
            v-model="row.isActive"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="handleActive(row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="300" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button type="info" size="mini" @click="handlePermission(row)">
            权限
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
      <el-form ref="dataForm" :model="tempRole" label-width="100px" style="width: 400px;">
        <el-form-item label="角色名" prop="roleName">
          <el-input v-model="tempRole.roleName" />
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input
            v-model="tempRole.description"
            placeholder="角色描述"
          />
        </el-form-item>
        <el-form-item label="启用" prop="isActive">
          <el-switch v-model="tempRole.isActive" />
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

    <el-dialog
      title="角色权限"
      :visible.sync="dialogPermissionVisible"
      :close-on-click-modal="false"
    >
      <div style="height: 520px; overflow:auto">
        <el-tree
          ref="menuTree"
          :data="menuTree"
          show-checkbox
          node-key="id"
          highlight-current
          :props="{ children: 'children', label: 'title' }"
          default-expand-all
        />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogPermissionVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="confirmPermission">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getRoles, addRole, updateRole, deleteRole, activeRole, batchDeleteRoles, rolePermission } from '@/api/role'
import { getMenuTree, getMenuIdsByRoleId } from '@/api/menu'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'RoleList',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      },
      tempRole: {
        id: undefined,
        roleName: '',
        description: '',
        isActive: true
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      downloadLoading: false,
      selectedRoles: [], // For batch delete
      menuTree: [], // All menus for permission assignment
      // checkedMenuKeys: [], // Menus currently assigned to the role
      dialogPermissionVisible: false,
      currentRoleId: undefined // ID of the role for which permissions are being edited
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getRoles({ PageIndex: this.listQuery.page, PageSize: this.listQuery.limit }).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    resetTempRole() {
      this.tempRole = {
        id: undefined,
        roleName: '',
        description: '',
        isActive: true
      }
    },
    handleCreate() {
      this.resetTempRole()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          addRole(this.tempRole).then(() => {
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
      this.tempRole = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleActive(row) {
      activeRole(row.id, { isActive: row.isActive }).then(res => {
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
          const tempData = Object.assign({}, this.tempRole)
          updateRole(tempData).then(() => {
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
      this.$confirm('确定要删除此角色吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteRole(row.id).then(() => {
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
    handleSelectionChange(selection) {
      this.selectedRoles = selection.map(item => item.id)
    },
    handleBatchDelete() {
      if (this.selectedRoles.length === 0) {
        this.$message({
          message: '没有选择任何角色',
          type: 'warning'
        })
        return
      }
      this.$confirm('删除选择的角色，确定吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        batchDeleteRoles(this.selectedRoles).then(() => {
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
    async handlePermission(row) {
      this.currentRoleId = row.id
      this.dialogPermissionVisible = true
      // Fetch menu tree
      const menuRes = await getMenuTree()
      this.menuTree = menuRes.data

      // Fetch currently assigned menu IDs
      const checkedRes = await getMenuIdsByRoleId(row.id)
      for (const id of checkedRes.data) {
        this.$refs.menuTree.setChecked(id, true, false)
      }
    },
    confirmPermission() {
      const checkedKeys = this.$refs.menuTree.getCheckedKeys()
      const halfCheckedKeys = this.$refs.menuTree.getHalfCheckedKeys()
      const menuIds = [...checkedKeys, ...halfCheckedKeys] // Include half-checked for parent permissions

      rolePermission({ id: this.currentRoleId, menuIds: menuIds }).then(() => {
        this.dialogPermissionVisible = false
        this.$notify({
          title: '提示',
          message: '更新权限成功',
          type: 'success',
          duration: 2000
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .filter-container {
    padding-bottom: 10px;
  }
}
</style>
