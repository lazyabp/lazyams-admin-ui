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
      <el-table-column label="Cron表达式" prop="cronExpression" align="center">
        <template slot-scope="{row}">
          <span>{{ row.cronExpression }}</span>
        </template>
      </el-table-column>
      <el-table-column label="停止/运行" prop="jobStatus" align="center" width="100">
        <template slot-scope="{row}">
          <el-switch
            v-model="row.jobStatus"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="2"
            @change="handleExecute(row)"
          />
        </template>
      </el-table-column>
      <!-- <el-table-column label="下次执行时间" prop="nextStartAt" align="center" width="160">
        <template slot-scope="{row}">
          <span>{{ row.nextStartAt | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="开始时间" prop="startAt" align="center" width="160">
        <template slot-scope="{row}">
          <span>{{ row.startAt | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结束时间" prop="endAt" align="center" width="160">
        <template slot-scope="{row}">
          <span>{{ row.endAt | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" prop="remark" align="center">
        <template slot-scope="{row}">
          <span>{{ row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="160" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <!-- <el-button :type="row.jobStatus === 1 ? 'warning' : 'success'" size="mini" @click="handleExecute(row)">
            {{ row.jobStatus === 1 ? '停止' : '启动' }}
          </el-button> -->
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
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="120px" style="width:500px;margin-left:50px;">
        <el-form-item label="任务名称" prop="jobName">
          <el-input v-model="temp.jobName" placeholder="请输入任务名称" />
        </el-form-item>
        <el-form-item label="任务组名" prop="jobGroupName">
          <el-input v-model="temp.jobGroupName" placeholder="请输入任务组名" />
        </el-form-item>
        <el-form-item label="Cron表达式" prop="cronExpression">
          <el-input v-model="temp.cronExpression" placeholder="0 0 12 * * ? [秒(0-59) 分(0-59) 时(0-23) 日(1-31) 月(1-12) 星期(0-7)]" />
        </el-form-item>
        <el-form-item label="任务状态" prop="jobStatus">
          <el-select v-model="temp.jobStatus" placeholder="请选择任务状态" style="width: 100%">
            <el-option v-for="item in jobStatusOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="开始时间">
          <el-date-picker
            v-model="temp.startAt"
            type="datetime"
            placeholder="选择开始时间"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker
            v-model="temp.endAt"
            type="datetime"
            placeholder="选择结束时间"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="temp.remark" type="textarea" :rows="3" placeholder="请输入备注" />
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
import { getAutoJobs, getAutoJobById, addAutoJob, updateAutoJob, executeAutoJob, deleteAutoJob } from '@/api/auto-job'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'AutoJobTable',
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
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
        jobStatus: 0,
        cronExpression: '',
        startAt: null,
        endAt: null,
        nextStartAt: null,
        remark: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
        jobName: [{ required: true, message: '任务名称为必填项', trigger: 'blur' }],
        jobGroupName: [{ required: true, message: '任务组名为必填项', trigger: 'blur' }],
        cronExpression: [{ required: true, message: 'Cron表达式为必填项', trigger: 'blur' }]
      },
      jobStatusOptions: [
        { value: 0, label: '待启动' },
        { value: 1, label: '执行中' },
        { value: 2, label: '已停止' }
      ]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getAutoJobs({ PageIndex: this.listQuery.page, PageSize: this.listQuery.limit }).then(response => {
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
        jobStatus: 0,
        cronExpression: '',
        startAt: null,
        endAt: null,
        nextStartAt: null,
        remark: ''
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
          addAutoJob(this.temp).then(() => {
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
      getAutoJobById(row.id).then(res => {
        this.temp = res.data
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateAutoJob(tempData).then(() => {
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
    handleExecute(row) {
      const executeData = {
        id: row.id,
        jobAction: row.jobStatus
      }
      executeAutoJob(executeData).then(() => {
        this.getList()
        this.$notify({
          title: '提示',
          message: row.jobStatus === 2 ? '任务已停止' : '任务已启动',
          type: 'success',
          duration: 2000
        })
      })
    },
    handleDelete(row) {
      this.$confirm('确定要删除此定时任务吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteAutoJob(row.id).then(() => {
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
    jobStatusText(status) {
      switch (status) {
        case 0:
          return '待启动'
        case 1:
          return '运行中'
        case 2:
          return '已停止'
        default:
          return '待启动'
      }
    },
    jobStatusType(status) {
      switch (status) {
        case 0:
          return ''
        case 1:
          return 'success'
        case 2:
          return 'danger'
        default:
          return ''
      }
    }
  }
}
</script>
