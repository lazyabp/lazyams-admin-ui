<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        Add
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
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Role Name" min-width="150px">
        <template slot-scope="{row}">
          <span>{{ row.roleName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Description" min-width="150px">
        <template slot-scope="{row}">
          <span>{{ row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column label="IsActive" min-width="100px">
        <template slot-scope="{row}">
          <el-switch
            v-model="row.isActive"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="handleActive(row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="Actions" align="center" width="300" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            Edit
          </el-button>
          <el-button type="info" size="mini" @click="handlePermission(row)">
            Permission
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row)">
            Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :model="tempRole" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="Role Name" prop="roleName">
          <el-input v-model="tempRole.roleName" />
        </el-form-item>
        <el-form-item label="Description" prop="description">
          <el-input
            v-model="tempRole.description"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="Role Description"
          />
        </el-form-item>
        <el-form-item label="IsActive" prop="isActive">
          <el-switch v-model="tempRole.isActive" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          Confirm
        </el-button>
      </div>
    </el-dialog>

    <el-dialog title="Assign Permissions" :visible.sync="dialogPermissionVisible">
      <el-tree
        ref="menuTree"
        :data="menuTree"
        show-checkbox
        node-key="id"
        highlight-current
        :props="{ children: 'children', label: 'title' }"
        default-expand-all
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogPermissionVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="confirmPermission">
          Confirm
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getRoles, addRole, updateRole, deleteRole, activeRole, batchDeleteRoles, getMenuTree, getMenuIdsByRoleId, rolePermission } from '@/api/role'
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
        update: 'Edit',
        create: 'Create'
      },
      downloadLoading: false,
      selectedRoles: [], // For batch delete
      menuTree: [], // All menus for permission assignment
      checkedMenuKeys: [], // Menus currently assigned to the role
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
              title: 'Success',
              message: 'Created Successfully',
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
          title: 'Success',
          message: 'Created Successfully',
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
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row) {
      this.$confirm('This will permanently delete the role. Continue?', 'Warning', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        deleteRole(row.id).then(() => {
          this.getList()
          this.$notify({
            title: 'Success',
            message: 'Delete Successfully',
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
          message: 'Please select at least one role',
          type: 'warning'
        })
        return
      }
      this.$confirm('This will permanently delete the selected roles. Continue?', 'Warning', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        batchDeleteRoles(this.selectedRoles).then(() => {
          this.getList()
          this.$notify({
            title: 'Success',
            message: 'Batch Delete Successfully',
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
      this.menuTree = this.normalizeMenuTree(menuRes.data.items)

      // Fetch currently assigned menu IDs
      const checkedRes = await getMenuIdsByRoleId(row.id)
      this.checkedMenuKeys = checkedRes.data.items

      this.$nextTick(() => {
        this.$refs.menuTree.setCheckedKeys(this.checkedMenuKeys)
      })
    },
    normalizeMenuTree(menuList) {
      // Assuming menuList is a flat array or has a structure that needs to be
      // converted to Element UI's tree format (children, label)
      // This is a placeholder and might need adjustment based on actual menu data structure
      const map = {}
      menuList.forEach(item => {
        item.children = []
        map[item.id] = item
      })

      const tree = []
      menuList.forEach(item => {
        if (item.parentId === 0) { // Assuming 0 is the root parent ID
          tree.push(item)
        } else {
          if (map[item.parentId]) {
            map[item.parentId].children.push(item)
          }
        }
      })
      return tree
    },
    confirmPermission() {
      const checkedKeys = this.$refs.menuTree.getCheckedKeys()
      const halfCheckedKeys = this.$refs.menuTree.getHalfCheckedKeys()
      const menuIds = [...checkedKeys, ...halfCheckedKeys] // Include half-checked for parent permissions

      rolePermission({ roleId: this.currentRoleId, menuIds: menuIds }).then(() => {
        this.dialogPermissionVisible = false
        this.$notify({
          title: 'Success',
          message: 'Permissions Updated Successfully',
          type: 'success',
          duration: 2000
        })
      })
    },
    handleDownload() {
      // This is a placeholder for export functionality
      this.$message({
        message: 'Export functionality not yet implemented.',
        type: 'info'
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
