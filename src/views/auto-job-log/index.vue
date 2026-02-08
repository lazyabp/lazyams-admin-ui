<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" style="margin-left: 10px;" type="danger" icon="el-icon-delete" @click="handleClearAll">
        清空日志
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
      <el-table-column label="任务名称" prop="jobName" align="center">
        <template slot-scope="{row}">
          <span>{{ row.jobName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="任务组名" prop="jobGroupName" align="center">
        <template slot-scope="{row}">
          <span>{{ row.jobGroupName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="日志状态" prop="logStatus" align="center" width="100">
        <template slot-scope="{row}">
          <el-tag :type="logStatusType(row.logStatus)" size="mini" effect="dark">
            {{ logStatusText(row.logStatus) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createdAt" align="center" width="160">
        <template slot-scope="{row}">
          <span>{{ row.createdAt | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" prop="remark" align="center">
        <template slot-scope="{row}">
          <span>{{ row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="120" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="{row}">
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
      width="600px"
    >
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="120px" style="width:500px;margin-left:50px;">
        <el-form-item label="任务名称">
          <el-input v-model="temp.jobName" :disabled="true" />
        </el-form-item>
        <el-form-item label="任务组名">
          <el-input v-model="temp.jobGroupName" :disabled="true" />
        </el-form-item>
        <el-form-item label="日志状态">
          <el-select v-model="temp.logStatus" placeholder="请选择日志状态" style="width: 100%" :disabled="true">
            <el-option v-for="item in logStatusOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="temp.remark" type="textarea" :rows="3" :disabled="true" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          关闭
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getAutoJobLogs, getAutoJobLogById, deleteAutoJobLog, clearAutoJobLogs } from '@/api/auto-job-log'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'AutoJobLogTable',
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
      temp: {
        id: undefined,
        jobName: '',
        jobGroupName: '',
        logStatus: null,
        createdAt: null,
        remark: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        detail: '日志详情'
      },
      logStatusOptions: [
        { value: 0, label: '失败' },
        { value: 1, label: '成功' },
        { value: 2, label: '运行中' }
      ]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getAutoJobLogs({ PageIndex: this.listQuery.page, PageSize: this.listQuery.limit }).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    resetForm() {
      this.temp = {
        id: undefined,
        jobName: '',
        jobGroupName: '',
        logStatus: null,
        createdAt: null,
        remark: ''
      }
    },
    handleDetail(row) {
      getAutoJobLogById(row.id).then(res => {
        this.temp = res.data
        this.dialogStatus = 'detail'
        this.dialogFormVisible = true
      })
    },
    handleDelete(row) {
      this.$confirm('确定要删除此日志记录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteAutoJobLog(row.id).then(() => {
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
    handleClearAll() {
      this.$confirm('确定要清空所有日志记录吗？此操作不可恢复！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        clearAutoJobLogs().then(() => {
          this.getList()
          this.$notify({
            title: '提示',
            message: '清空成功',
            type: 'success',
            duration: 2000
          })
        })
      })
    },
    logStatusText(status) {
      switch (status) {
        case 0:
          return '失败'
        case 1:
          return '成功'
        default:
          return '未知'
      }
    },
    logStatusType(status) {
      switch (status) {
        case 0:
          return 'danger'
        case 1:
          return 'success'
        default:
          return ''
      }
    }
  }
}
</script>
