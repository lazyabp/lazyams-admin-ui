<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        Add
      </el-button>
    </div>

    <el-table
      :data="list"
      style="width: 100%;margin-top:30px;"
      row-key="id"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      border
    >
      <el-table-column align="center" label="Name">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Type">
        <template slot-scope="scope">
          {{ scope.row.menuType }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Permission">
        <template slot-scope="scope">
          {{ scope.row.permission }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Route">
        <template slot-scope="scope">
          {{ scope.row.route }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Component">
        <template slot-scope="scope">
          {{ scope.row.component }}
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
      <el-table-column align="center" label="Actions" width="180" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleUpdate(scope)">
            Edit
          </el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope)">
            Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'Edit Menu':'New Menu'">
      <el-form :model="menu" label-width="120px" label-position="left">
        <el-form-item label="Name">
          <el-input v-model="menu.title" placeholder="Menu Name" />
        </el-form-item>
        <el-form-item label="Menu Type">
          <el-input v-model="menu.menuType" placeholder="Menu Type" />
        </el-form-item>
        <el-form-item label="Route">
          <el-input v-model="menu.route" placeholder="Route" />
        </el-form-item>
        <el-form-item label="Permission">
          <el-input v-model="menu.permission" placeholder="Permission" />
        </el-form-item>
        <el-form-item label="Component">
          <el-input v-model="menu.component" placeholder="Component" />
        </el-form-item>
        <el-form-item label="Parent">
          <el-select v-model="menu.parentId" placeholder="Select Parent Menu">
            <el-option
              v-for="item in list"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            >
              <el-tree
                :data="[item]"
                :props="{ value: 'id', label: 'title', children: 'children' }"
                @node-click="(data) => { menu.parentId = data.id }"
              />
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="IsActive" prop="isActive">
          <el-switch v-model="menu.isActive" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">
          Cancel
        </el-button>
        <el-button type="primary" @click="confirmMenu">
          Confirm
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addMenu, updateMenu, deleteMenu, activeMenu, getMenuTree } from '@/api/menu'

export default {
  name: 'MenuManagement',
  data() {
    return {
      list: [],
      dialogVisible: false,
      dialogType: 'new',
      menu: {}
    }
  },
  created() {
    this.fetchMenuTree()
  },
  methods: {
    async fetchMenuTree() {
      const res = await getMenuTree()
      this.list = res.data.items
    },
    handleCreate() {
      this.menu = {}
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    handleUpdate(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.menu = { ...scope.row }
    },
    handleActive(row) {
      activeMenu(row.id, { isActive: row.isActive }).then(res => {
        this.fetchMenuTree()
        this.dialogFormVisible = false
        this.$notify({
          title: 'Success',
          message: 'Created Successfully',
          type: 'success',
          duration: 2000
        })
      })
    },
    handleDelete(scope) {
      this.$confirm('Confirm to delete the menu?', 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(async() => {
        await deleteMenu(scope.row.id)
        this.fetchMenuTree()
        this.$message({
          type: 'success',
          message: 'Delete succed!'
        })
      }).catch(err => { console.error(err) })
    },
    async confirmMenu() {
      const isEdit = this.dialogType === 'edit'

      if (isEdit) {
        await updateMenu(this.menu)
      } else {
        await addMenu(this.menu)
      }

      this.fetchMenuTree()
      this.dialogVisible = false
      this.$message({
        type: 'success',
        message: 'Save succed!'
      })
    }
  }
}
</script>
