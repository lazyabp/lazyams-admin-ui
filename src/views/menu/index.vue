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
      <el-table-column align="center" label="菜单名称">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="菜单类型">
        <template slot-scope="scope">
          <span
            v-for="item in menuTypes"
            :key="item.label"
          >
            <span v-if="scope.row.menuType === item.value">
              <el-tag
                v-if="scope.row.menuType === 1"
                type=""
                size="medium"
                effect="dark"
              >
                目录
              </el-tag>
              <el-tag
                v-else-if="scope.row.menuType === 2"
                type="success"
                size="medium"
                effect="dark"
              >
                菜单
              </el-tag>
              <el-tag
                v-else
                type="warning"
                size="medium"
                effect="dark"
              >
                按钮
              </el-tag>
            </span>
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="权限名称">
        <template slot-scope="scope">
          {{ scope.row.permission }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="路由">
        <template slot-scope="scope">
          {{ scope.row.route }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="部件">
        <template slot-scope="scope">
          {{ scope.row.component }}
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
        <template slot-scope="scope">
          {{ scope.row.orderNum }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="180" fixed="right">
        <template slot-scope="{row}">
          <el-button type="primary" size="small" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button type="danger" size="small" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :name="dialogType === 'edit'?'Edit Menu':'New Menu'"
    >
      <el-form :model="menu" label-width="120px" label-position="left">
        <el-form-item label="菜单类型">
          <el-select v-model="menu.menuType" placeholder="请选择">
            <el-option
              v-for="item in menuTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="menu.name" placeholder="菜单名称" />
        </el-form-item>
        <el-form-item label="图标">
          <el-input v-model="menu.icon" placeholder="Icon" />
        </el-form-item>
        <el-form-item label="权限名">
          <el-input v-model="menu.permission" placeholder="权限名" />
        </el-form-item>
        <el-form-item v-if="menu.menuType !== 3" label="路由">
          <el-input v-model="menu.route" placeholder="路由" />
        </el-form-item>
        <el-form-item v-if="menu.menuType !== 3" label="部件路径">
          <el-input v-model="menu.component" placeholder="部件路径" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model="menu.orderNum" placeholder="排序" />
        </el-form-item>
        <el-form-item label="父菜单">
          <el-cascader
            v-model="menu.parentId"
            :options="filteredTreeData"
            :props="{ value: 'id', label: 'name', children: 'children', emitPath: false, checkStrictly: true }"
            placeholder="Select Parent"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="启用" prop="isActive">
          <el-switch v-model="menu.isActive" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">
          取消
        </el-button>
        <el-button type="primary" @click="confirmMenu">
          保存
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getMenuById, addMenu, updateMenu, deleteMenu, activeMenu, getMenuTree } from '@/api/menu'

export default {
  name: 'MenuManagement',
  data() {
    return {
      list: [],
      dialogVisible: false,
      dialogType: 'new',
      menu: {
        name: '',
        permission: 'Permission.',
        icon: 'el-icon-menu',
        menuType: 2,
        description: '',
        orderNum: 2,
        route: '',
        component: '',
        parentId: null,
        isActive: true
      },
      menuTypes: [
        {
          value: 1,
          label: '目录'
        },
        {
          value: 2,
          label: '菜单'
        },
        {
          value: 3,
          label: '按钮'
        }
      ]
    }
  },
  computed: {
    // 过滤掉menuType为2的菜单项
    filteredTreeData() {
      if (!this.list || !Array.isArray(this.list)) {
        return []
      }
      const menu = JSON.parse(JSON.stringify(this.list))
      return this.filterMenuByType(menu, 3)
    }
  },
  created() {
    this.fetchMenuTree()
  },
  methods: {
    // 根据菜单类型过滤菜单数据，递归过滤掉指定类型的菜单
    filterMenuByType(data, excludeType) {
      return data
        .filter(item => item.menuType !== excludeType)
        .map(item => {
          if (item.children && Array.isArray(item.children)) {
            const children = this.filterMenuByType(item.children, excludeType)
            if (children && children.length > 0) {
              return {
                ...item,
                children: children
              }
            } else {
              delete item.children
              return { ...item }
            }
          }
          return item
        })
    },
    async fetchMenuTree() {
      const res = await getMenuTree()
      this.list = res.data
    },
    handleCreate() {
      this.menu = {
        name: '',
        permission: 'Permission.',
        icon: 'el-icon-menu',
        menuType: 2,
        description: '',
        orderNum: 2,
        route: '',
        component: '',
        parentId: null,
        isActive: true
      }
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    async handleUpdate(row) {
      const res = await getMenuById(row.id)
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.menu = res.data
    },
    handleActive(row) {
      activeMenu(row.id, { isActive: row.isActive }).then(res => {
        this.fetchMenuTree()
        this.dialogFormVisible = false
        this.$notify({
          name: 'Success',
          message: 'Created Successfully',
          type: 'success',
          duration: 2000
        })
      })
    },
    handleDelete(row) {
      this.$confirm('Confirm to delete the menu?', 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(async() => {
        await deleteMenu(row.id)
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
