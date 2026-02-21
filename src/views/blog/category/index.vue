<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        新增
      </el-button>
    </div>

    <el-table
      :data="list"
      style="width: 100%;margin-top:30px;"
      row-key="id"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      :default-expand-all="true"
      border
    >
      <el-table-column label="分类名称">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label=" Slug">
        <template slot-scope="scope">
          {{ scope.row.slug }}
        </template>
      </el-table-column>
      <el-table-column label="语言编码">
        <template slot-scope="scope">
          {{ scope.row.languageCode }}
        </template>
      </el-table-column>
      <el-table-column label="发布状态">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="0"
            @change="handleChangeStatus(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="关键词">
        <template slot-scope="scope">
          {{ scope.row.keywords }}
        </template>
      </el-table-column>
      <el-table-column label="描述">
        <template slot-scope="scope">
          {{ scope.row.description }}
        </template>
      </el-table-column>
      <el-table-column label="排序">
        <template slot-scope="scope">
          {{ scope.row.sortOrder }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="200" fixed="right">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button type="danger" size="mini" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :title="dialogType === 'edit' ? '编辑分类' : '新增分类'"
    >
      <el-form :model="category" label-width="120px">
        <el-form-item label="分类名称">
          <el-input v-model="category.name" placeholder="分类名称" @change="generateCategorySlug" />
        </el-form-item>
        <el-form-item label="Slug">
          <el-input v-model="category.slug" placeholder="URL 标识符" />
        </el-form-item>
        <el-form-item label="语言编码">
          <el-select v-model="category.languageCode" placeholder="请选择语言编码">
            <el-option
              v-for="item in languages"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            v-model="category.parentId"
            :options="filteredTreeData"
            :props="{ value: 'id', label: 'name', children: 'children', emitPath: false, checkStrictly: true }"
            clearable
            placeholder="所属父级分类"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="发布状态">
          <el-select v-model="category.status" placeholder="请选择">
            <el-option
              v-for="item in publishStatuses"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="关键词">
          <el-input v-model="category.keywords" type="textarea" placeholder="SEO 关键词" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="category.description" type="textarea" placeholder="分类描述" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="category.sortOrder" :min="0" placeholder="排序值" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">
          取消
        </el-button>
        <el-button type="primary" @click="confirmCategory">
          保存
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getCategoryTree, getBlogCategoryById, addBlogCategory, updateBlogCategory, deleteBlogCategory, changeBlogCategoryStatus } from '@/api/blog-category'
import { getLanguages } from '@/api/language'
import { generateSlug } from '@/api/blog-article'

export default {
  name: 'BlogCategoryManagement',
  data() {
    return {
      list: [],
      dialogVisible: false,
      dialogType: 'new',
      category: {
        id: null,
        name: '',
        slug: '',
        languageCode: 'zh-cn',
        parentId: null,
        status: 1,
        keywords: '',
        description: '',
        sortOrder: 0
      },
      publishStatuses: [
        {
          value: 0,
          label: '未发布'
        },
        {
          value: 1,
          label: '已发布'
        }
      ],
      languages: []
    }
  },
  computed: {
    filteredTreeData() {
      if (!this.list || !Array.isArray(this.list)) {
        return []
      }
      const category = JSON.parse(JSON.stringify(this.list))
      return this.filterCategory(category)
    }
  },
  created() {
    this.fetchCategoryTree()
    this.fetchLanguages()
  },
  methods: {
    filterCategory(data) {
      return data.map(item => {
        if (item.children && Array.isArray(item.children)) {
          const children = this.filterCategory(item.children)
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
    async fetchCategoryTree() {
      const res = await getCategoryTree()
      this.list = res.data
    },
    async fetchLanguages() {
      const res = await getLanguages({})
      this.languages = res.data.items
    },
    handleCreate() {
      this.category = {
        id: null,
        name: '',
        slug: '',
        languageCode: 'zh-cn',
        parentId: null,
        status: 1,
        keywords: '',
        description: '',
        sortOrder: 0
      }
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    async handleUpdate(row) {
      const res = await getBlogCategoryById(row.id)
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.category = res.data
    },
    async handleChangeStatus(row) {
      await changeBlogCategoryStatus(row.id, { status: row.status })
      this.fetchCategoryTree()
      this.$notify({
        title: '提示',
        message: '状态更新成功',
        type: 'success',
        duration: 2000
      })
    },
    handleDelete(row) {
      this.$confirm('确定要删除该分类吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await deleteBlogCategory(row.id)
        this.fetchCategoryTree()
        this.$message({
          type: 'success',
          message: '删除成功'
        })
      }).catch(err => { console.error(err) })
    },
    async confirmCategory() {
      const isEdit = this.dialogType === 'edit'

      if (isEdit) {
        await updateBlogCategory(this.category)
      } else {
        await addBlogCategory(this.category)
      }

      this.fetchCategoryTree()
      this.dialogVisible = false
      this.$message({
        type: 'success',
        message: '保存成功'
      })
    },
    async generateCategorySlug() {
      if (this.category.name) {
        try {
          const res = await generateSlug({ text: this.category.name })
          this.category.slug = res.data.text
        } catch (error) {
          console.error('生成 slug 失败:', error)
        }
      }
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
</style>
