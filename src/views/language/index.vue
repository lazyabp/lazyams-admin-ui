<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.filter"
        placeholder="搜索名称或编码"
        style="width: 200px;"
        class="filter-item"
        clearable
        @keyup.enter.native="getList"
      />
      <el-select
        v-model="listQuery.status"
        placeholder="发布状态"
        clearable
        style="width: 150px"
        class="filter-item"
      >
        <el-option
          label="发布"
          :value="0"
        />
        <el-option
          label="不发布"
          :value="1"
        />
      </el-select>
      <el-select
        v-model="listQuery.isDefault"
        placeholder="是否默认"
        clearable
        style="width: 150px"
        class="filter-item"
      >
        <el-option
          label="是"
          :value="true"
        />
        <el-option
          label="否"
          :value="false"
        />
      </el-select>
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
      <el-button class="filter-item" style="margin-left: 10px;" type="success" icon="el-icon-edit" @click="handleCreate">
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
      <el-table-column label="名称">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="编码">
        <template slot-scope="{row}">
          <span>{{ row.code }}</span>
        </template>
      </el-table-column>
      <el-table-column label="区域编码">
        <template slot-scope="{row}">
          <span>{{ row.localeCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="文本方向">
        <template slot-scope="{row}">
          <span v-for="item in textDirections" :key="item.value">
            <span v-if="item.value === row.textDirection">
              {{ item.label }}
            </span>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="发布状态">
        <template slot-scope="{row}">
          <el-tag :type="row.status === 0 ? 'primary' : 'info'" effect="dark">
            <span v-for="item in publishStatuses" :key="item.value">
              <span v-if="item.value === row.status">
                {{ item.label }}
              </span>
            </span>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="默认排序" align="center">
        <template slot-scope="{row}">
          <span>{{ row.sortOrder }}</span>
        </template>
      </el-table-column>
      <el-table-column label="图标" align="center">
        <template slot-scope="{row}">
          <i v-if="row.icon" :class="row.icon" style="font-size: 18px;" />
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="默认" align="center">
        <template slot-scope="{row}">
          <el-switch
            v-model="row.isDefault"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="handleSetDefault(row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width" fixed="right">
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
      <el-form ref="dataForm" :model="temp" label-width="120px" style="width:450px;">
        <el-form-item label="名称" prop="name">
          <el-input v-model="temp.name" placeholder="例如：中文" />
        </el-form-item>
        <el-form-item label="编码" prop="code">
          <el-input v-model="temp.code" placeholder="例如：zh" />
        </el-form-item>
        <el-form-item label="区域编码" prop="localeCode">
          <el-input v-model="temp.localeCode" placeholder="例如：zh-CN" />
        </el-form-item>
        <el-form-item label="文本方向" prop="textDirection">
          <el-select v-model="temp.textDirection" placeholder="请选择">
            <el-option
              v-for="t in textDirections"
              :key="t.value"
              :label="t.label"
              :value="t.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="发布状态" prop="status">
          <el-select v-model="temp.status" placeholder="请选择">
            <el-option
              v-for="t in publishStatuses"
              :key="t.value"
              :label="t.label"
              :value="t.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="默认排序" prop="sortOrder">
          <el-input-number v-model="temp.sortOrder" :min="0" :max="999" />
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-input v-model="temp.icon" placeholder="例如：el-icon-language" />
        </el-form-item>
        <el-form-item label="默认语言" prop="isDefault">
          <el-switch v-model="temp.isDefault" />
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
import { getLanguages, getLanguageById, addLanguage, updateLanguage, setDefaultLanguage, deleteLanguage } from '@/api/language'
import Pagination from '@/components/Pagination'

export default {
  name: 'LanguageTable',
  components: { Pagination },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        pageIndex: 1,
        pageSize: 20,
        filter: '',
        code: '',
        name: '',
        status: undefined,
        isDefault: undefined
      },
      temp: {
        id: undefined,
        name: '',
        code: '',
        localeCode: '',
        textDirection: 0,
        status: 0,
        isDefault: false,
        sortOrder: 0,
        icon: ''
      },
      publishStatuses: [
        {
          value: 0,
          label: '发布'
        },
        {
          value: 1,
          label: '不发布'
        }
      ],
      textDirections: [
        {
          value: 0,
          label: '从左到右'
        },
        {
          value: 1,
          label: '从右到左'
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
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getLanguages(this.listQuery).then(response => {
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
        localeCode: '',
        textDirection: 0,
        status: 0,
        isDefault: false,
        sortOrder: 0,
        icon: ''
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
          addLanguage(this.temp).then(() => {
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
      getLanguageById(row.id).then(res => {
        this.temp = res.data
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      })
    },
    handleSetDefault(row) {
      setDefaultLanguage(row.id).then(() => {
        this.getList()
        this.$notify({
          title: '提示',
          message: '设置成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateLanguage(tempData).then(() => {
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
      if (row.isDefault) {
        this.$message.warning('默认语言不能删除')
        return
      }
      this.$confirm('确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteLanguage(row.id).then(() => {
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
        filter: '',
        code: '',
        name: '',
        status: undefined,
        isDefault: undefined
      }
      this.getList()
    }
  }
}
</script>

<style scoped>
.filter-container {
  margin-bottom: 20px;
}

.filter-item {
  display: inline-block;
  vertical-align: middle;
  margin-bottom: 10px;
}

::v-deep .el-table .cell {
  line-height: 24px;
}
</style>
