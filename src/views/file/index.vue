<template>
  <div class="app-container">
    <div class="filter-container">
      <el-upload
        class="filter-item"
        :action="fileUploadUrl"
        :headers="uploadHeaders"
        :on-success="handleUploadSuccess"
        :on-error="handleUploadError"
        :show-file-list="false"
        accept="*/*"
      >
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-upload">
          上传文件
        </el-button>
      </el-upload>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="文件名" prop="fileName" align="center">
        <template slot-scope="{row}">
          <el-link :href="row.baseUrl + row.filePath" target="_blank">{{ row.fileName }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="文件类型" prop="fileType" align="center" width="120">
        <template slot-scope="{row}">
          <el-tag :type="fileTypeTagType(row.fileType)">
            {{ fileTypeText(row.fileType) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="MIME类型" prop="mimeType" align="center">
        <template slot-scope="{row}">
          <span>{{ row.mimeType }}</span>
        </template>
      </el-table-column>
      <el-table-column label="文件大小" prop="fileSize" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{ formatFileSize(row.fileSize) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="扩展名" prop="fileExt" align="center" width="100">
        <template slot-scope="{row}">
          <span>{{ row.fileExt }}</span>
        </template>
      </el-table-column>
      <el-table-column label="存储类型" prop="storage" align="center" width="120">
        <template slot-scope="{row}">
          <el-tag :type="storageTypeTagType(row.storage)">
            {{ storageTypeText(row.storage) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createdAt" align="center" width="160">
        <template slot-scope="{row}">
          <span>{{ row.createdAt | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="80" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="{row}">
          <el-button size="mini" type="danger" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import { getFiles, deleteFile } from '@/api/file'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'FileTable',
  components: { Pagination },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20
      },
      fileUploadUrl: `${process.env.VUE_APP_BASE_API}/api/File/Upload`,
      uploadHeaders: {
        Authorization: 'Bearer ' + this.$store.getters.token
      },
      fileTypeOptions: [
        { value: 0, label: '头像' },
        { value: 1, label: '图片' },
        { value: 2, label: '视频' },
        { value: 5, label: '其他' }
      ],
      storageTypeOptions: [
        { value: 0, label: '本地' },
        { value: 1, label: '阿里云OSS' },
        { value: 2, label: '七牛云Kodo' },
        { value: 3, label: '腾讯云COS' },
        { value: 4, label: 'MinIO' },
        { value: 5, label: 'AwsS3' },
        { value: 99, label: '自定义' }
      ]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getFiles({ PageIndex: this.listQuery.page, PageSize: this.listQuery.limit }).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleDelete(row) {
      this.$confirm('确定要删除此文件吗？此操作不可恢复！', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteFile(row.id).then(() => {
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
    handleUploadSuccess(response, file, fileList) {
      this.getList()
      this.$notify({
        title: '提示',
        message: '上传成功',
        type: 'success',
        duration: 2000
      })
    },
    handleUploadError(err, file, fileList) {
      this.$notify({
        title: '提示',
        message: '上传失败：' + err.message,
        type: 'error',
        duration: 2000
      })
    },
    fileTypeText(type) {
      switch (type) {
        case 0:
          return '头像'
        case 1:
          return '图片'
        case 2:
          return '视频'
        case 3:
        default:
          return '其他'
      }
    },
    fileTypeTagType(type) {
      switch (type) {
        case 0:
          return 'primary'
        case 1:
          return 'success'
        case 2:
          return 'warning'
        case 3:
        default:
          return 'info'
      }
    },
    storageTypeText(type) {
      switch (type) {
        case 0:
          return '本地'
        case 1:
          return '阿里云OSS'
        case 2:
          return '腾讯云COS'
        case 3:
          return '七牛云Kodo'
        case 4:
          return 'MinIO'
        default:
          return '未知'
      }
    },
    storageTypeTagType(type) {
      switch (type) {
        case 0:
          return 'primary'
        case 1:
          return 'success'
        case 2:
          return 'warning'
        case 3:
          return 'danger'
        case 4:
        default:
          return 'info'
      }
    },
    formatFileSize(size) {
      if (!size) return '0 Bytes'
      const units = ['Bytes', 'KB', 'MB', 'GB', 'TB']
      let index = 0
      let newSize = size
      while (newSize >= 1024 && index < units.length - 1) {
        newSize /= 1024
        index++
      }
      return newSize.toFixed(2) + ' ' + units[index]
    }
  }
}
</script>
