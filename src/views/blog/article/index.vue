<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.filter"
        placeholder="搜索标题或作者"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="getList"
      />
      <el-select
        v-model="listQuery.status"
        placeholder="文章状态"
        clearable
        style="width: 150px"
        class="filter-item"
      >
        <el-option
          label="草稿"
          :value="0"
        />
        <el-option
          label="已发布"
          :value="1"
        />
        <el-option
          label="已归档"
          :value="2"
        />
      </el-select>
      <el-select
        v-model="listQuery.languageCode"
        placeholder="语言"
        clearable
        style="width: 150px"
        class="filter-item"
      >
        <el-option
          v-for="item in languages"
          :key="item.code"
          :label="item.name"
          :value="item.code"
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
      <el-table-column label="图片" prop="imageId" align="center">
        <template slot-scope="{row}">
          <img v-if="row.image" :src="row.image.url" style="height: 25px;">
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="标题">
        <template slot-scope="{row}">
          <i class="el-icon-link" />
          <a :href="'/' + row.slug" target="_blank">{{ row.title }}</a>
        </template>
      </el-table-column>
      <el-table-column label="作者">
        <template slot-scope="{row}">
          <span>{{ row.author }}</span>
        </template>
      </el-table-column>
      <el-table-column label="分类">
        <template slot-scope="{row}">
          <span>{{ row.category ? row.category.name : '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="语言">
        <template slot-scope="{row}">
          <span>{{ row.languageCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="{row}">
          <el-tag :type="getStatusType(row.status)">
            {{ getStatusLabel(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="浏览量" align="center">
        <template slot-scope="{row}">
          <span>{{ row.viewCount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="120" fixed="right">
        <template slot-scope="{row}">
          <el-dropdown>
            <el-button
              type=""
              size="mini"
              class="el-dropdown-link"
            >
              操作 <i class="el-icon-arrow-down el-icon--right" />
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-if="row.status !== 0" @click.native="handleChangeStatus(row, 0)">
                设为草稿
              </el-dropdown-item>
              <el-dropdown-item v-if="row.status !== 1" @click.native="handleChangeStatus(row, 1)">
                设为待发布
              </el-dropdown-item>
              <el-dropdown-item v-if="row.status !== 2" @click.native="handleChangeStatus(row, 2)">
                发布文章
              </el-dropdown-item>
              <el-dropdown-item @click.native="handleUpdate(row)">
                编辑文章
              </el-dropdown-item>
              <el-dropdown-item @click.native="handleDelete(row)">
                删除文章
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageSize" @pagination="getList" />

    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      width="800px"
    >
      <el-form ref="dataForm" :model="temp" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="标题" prop="title">
              <el-input v-model="temp.title" placeholder="文章标题" @change="handleChangeTitle" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="Slug" prop="slug">
              <el-input v-model="temp.slug" placeholder="URL 标识符" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="封面图片" prop="imageId">
              <Upload v-model="temp.imageUrl" :is-image="true" title="上传图片" @success="handleImageUploadSuccess" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="所属分类" prop="categoryId">
              <!-- <el-select v-model="temp.categoryId" placeholder="请选择分类" style="width: 100%">
                <el-option
                  v-for="item in categoryList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select> -->
              <el-cascader
                v-model="temp.categoryId"
                :options="categoryList"
                :props="{ value: 'id', label: 'name', children: 'children', emitPath: false, checkStrictly: true }"
                clearable
                placeholder="所属分类"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="作者" prop="author">
              <el-input v-model="temp.author" placeholder="作者名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="语言编码" prop="languageCode">
              <el-select v-model="temp.languageCode" placeholder="请选择语言" style="width: 100%;">
                <el-option
                  v-for="item in languages"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="摘要" prop="summary">
              <el-input
                v-model="temp.summary"
                type="textarea"
                :rows="3"
                placeholder="文章摘要"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="内容" prop="content">
              <tinymce v-model="temp.content" :height="200" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="标签" prop="tags">
              <el-select
                v-model="temp.tags"
                multiple
                filterable
                allow-create
                default-first-option
                placeholder="请选择或输入标签"
                style="width: 100%"
              >
                <el-option
                  v-for="item in tagOptions"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="关键词" prop="keywords">
              <el-input
                v-model="temp.keywords"
                type="textarea"
                :rows="1"
                placeholder="SEO 关键词，多个用逗号分隔"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="文章状态" prop="status">
              <el-select v-model="temp.status" placeholder="请选择状态">
                <el-option
                  v-for="item in articleStatuses"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="模板" prop="template">
              <el-input v-model="temp.template" placeholder="模板文件路径" />
            </el-form-item>
          </el-col>
        </el-row>
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
import { getBlogArticles, getBlogArticleById, addBlogArticle, updateBlogArticle, deleteBlogArticle, changeBlogArticleStatus, generateSlug } from '@/api/blog-article'
import { getCategoryTree } from '@/api/blog-category'
import { getLanguages } from '@/api/language'
import Pagination from '@/components/Pagination'
import Tinymce from '@/components/Tinymce'
import Upload from '@/components/Upload/FileInput'

export default {
  name: 'BlogArticleTable',
  components: { Pagination, Tinymce, Upload },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        pageIndex: 1,
        pageSize: 20,
        filter: '',
        title: '',
        author: '',
        status: undefined,
        languageCode: '',
        beginCreatedAt: undefined,
        endCreatedAt: undefined
      },
      dateRange: [],
      temp: {
        id: undefined,
        title: '',
        author: '',
        slug: '',
        languageCode: 'zh-cn',
        categoryId: null,
        status: 0,
        summary: '',
        content: '',
        keywords: '',
        tags: [],
        template: '',
        imageId: null,
        imageUrl: ''
      },
      categoryList: [],
      tagOptions: [],
      articleStatuses: [
        {
          value: 0,
          label: '草稿'
        },
        {
          value: 1,
          label: '待发布'
        },
        {
          value: 2,
          label: '已发布'
        }
      ],
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      languages: []
    }
  },
  created() {
    this.loadCategories()
    this.fetchLanguages()
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      if (this.dateRange && this.dateRange.length === 2) {
        this.listQuery.beginCreatedAt = this.dateRange[0] + 'T00:00:00'
        this.listQuery.endCreatedAt = this.dateRange[1] + 'T23:59:59'
      } else {
        this.listQuery.beginCreatedAt = undefined
        this.listQuery.endCreatedAt = undefined
      }
      getBlogArticles(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    loadCategories() {
      getCategoryTree().then(res => {
        this.categoryList = res.data
      })
    },
    fetchLanguages() {
      getLanguages({}).then(res => {
        this.languages = res.data.items
      })
    },
    getStatusType(status) {
      const types = {
        0: 'info',
        1: 'warning',
        2: 'success'
      }
      return types[status] || 'info'
    },
    getStatusLabel(status) {
      const labels = {
        0: '草稿',
        1: '待发布',
        2: '已发布'
      }
      return labels[status] || '未知'
    },
    resetForm() {
      this.temp = {
        id: undefined,
        title: '',
        author: '',
        slug: '',
        languageCode: 'zh-cn',
        categoryId: null,
        status: 0,
        summary: '',
        content: '',
        keywords: '',
        tags: [],
        template: '',
        imageId: null,
        imageUrl: ''
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
          addBlogArticle(this.temp).then(() => {
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
      getBlogArticleById(row.id).then(res => {
        this.temp = res.data
        this.temp.imageUrl = res.data.image ? res.data.image.url : ''
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      })
    },
    handleChangeStatus(row, status) {
      changeBlogArticleStatus(row.id, { status }).then(() => {
        this.getList()
        this.$notify({
          title: '提示',
          message: '状态更新成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    handleChangeTitle() {
      if (this.temp.title) {
        generateSlug({ text: this.temp.title }).then(res => {
          this.temp.slug = res.data.text
        })
      }
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateBlogArticle(tempData).then(() => {
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
      this.$confirm('确定要删除该文章吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteBlogArticle(row.id).then(() => {
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
    handleImageUploadSuccess(imageData) {
      if (imageData) {
        this.temp.imageId = imageData.id
        this.temp.imageUrl = imageData.url
      }
    },
    resetQuery() {
      this.listQuery = {
        pageIndex: 1,
        pageSize: 20,
        filter: '',
        title: '',
        author: '',
        status: undefined,
        languageCode: '',
        beginCreatedAt: undefined,
        endCreatedAt: undefined
      }
      this.dateRange = []
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
</style>
