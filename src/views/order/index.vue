<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select
        v-model="listQuery.OrderStatus"
        placeholder="订单状态"
        clearable
        style="width: 150px"
        class="filter-item"
      >
        <el-option
          v-for="item in orderStatusOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-select
        v-model="listQuery.OrderType"
        placeholder="订单类型"
        clearable
        style="width: 150px"
        class="filter-item"
      >
        <el-option
          v-for="item in orderTypeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-select
        v-model="listQuery.PackageId"
        placeholder="套餐"
        clearable
        style="width: 150px"
        class="filter-item"
      >
        <el-option
          v-for="item in packages"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <el-input
        v-model="listQuery.Filter"
        placeholder="筛选条件"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-button
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        搜索
      </el-button>
      <el-button
        type="success"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        创建订单
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
      <el-table-column label="订单号" prop="orderNo" align="center" width="180">
        <template slot-scope="{row}">
          <span>{{ row.orderNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="交易号" prop="tradeNo" align="center" width="180">
        <template slot-scope="{row}">
          <span>{{ row.tradeNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户" min-width="120px">
        <template slot-scope="{row}">
          <span>{{ row.user.nickName || '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="套餐" min-width="120px">
        <template slot-scope="{row}">
          <span>{{ packageFilter(row.packageId) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单类型" width="100px">
        <template slot-scope="{row}">
          <el-tag :type="orderTypeFilter(row.orderType).type" size="mini">
            {{ orderTypeFilter(row.orderType).label }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="订单状态" width="100px">
        <template slot-scope="{row}">
          <el-tag :type="orderStatusFilter(row.orderStatus).type" size="mini" :effect="orderStatusFilter(row.orderStatus).effect">
            {{ orderStatusFilter(row.orderStatus).label }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="单价" width="100px">
        <template slot-scope="{row}">
          <span>{{ row.price }}</span>
        </template>
      </el-table-column>
      <el-table-column label="数量" width="80px">
        <template slot-scope="{row}">
          <span>{{ row.quantity }}</span>
        </template>
      </el-table-column>
      <el-table-column label="金额" width="100px">
        <template slot-scope="{row}">
          <span>{{ row.amount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="折扣后金额" width="120px">
        <template slot-scope="{row}">
          <span>{{ row.discountedAmount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="货币" width="80px">
        <template slot-scope="{row}">
          <span>{{ row.currency }}</span>
        </template>
      </el-table-column>
      <el-table-column label="支付方式" width="120px">
        <template slot-scope="{row}">
          <span>{{ paymentProviderFilter(row.paymentProvider) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="150px">
        <template slot-scope="{row}">
          <span>{{ parseTime(row.createdAt) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="120" fixed="right">
        <template slot-scope="{row}">
          <el-dropdown>
            <span class="el-dropdown-link">
              操作 <i class="el-icon-arrow-down el-icon--right" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="handleSetAsPaid(row)">
                设置为已支付
              </el-dropdown-item>
              <el-dropdown-item @click.native="handleSetAsCompleted(row)">
                设置为已完成
              </el-dropdown-item>
              <el-dropdown-item @click.native="handleSetAsCanceled(row)">
                设置为已取消
              </el-dropdown-item>
              <el-dropdown-item @click.native="handleSetAsRefund(row)">
                设置为已退款
              </el-dropdown-item>
              <el-dropdown-item @click.native="handleChangeDiscountedAmount(row)">
                修改折扣后金额
              </el-dropdown-item>
              <el-dropdown-item @click.native="handleView(row)">
                订单详细
              </el-dropdown-item>
              <el-dropdown-item @click.native="handleDelete(row)">
                删除
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.PageIndex"
      :limit.sync="listQuery.PageSize"
      @pagination="getList"
    />

    <el-dialog
      title="创建订单"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      width="600px"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="120px"
        style="width: 500px; margin-left:20px;"
      >
        <el-form-item label="用户ID" prop="userId">
          <el-input v-model.number="temp.userId" placeholder="请输入用户ID" />
        </el-form-item>
        <el-form-item label="套餐ID" prop="packageId">
          <el-select v-model="temp.packageId" placeholder="请选择">
            <el-option
              v-for="item in packages"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="数量" prop="quantity">
          <el-input v-model.number="temp.quantity" placeholder="请输入数量" />
        </el-form-item>
        <el-form-item label="货币" prop="currency">
          <el-input v-model="temp.currency" placeholder="请输入货币代码，如CNY、USD等" />
        </el-form-item>
        <el-form-item label="支付方式" prop="paymentProvider">
          <el-select v-model="temp.paymentProvider" placeholder="请选择支付方式">
            <el-option
              v-for="item in paymentProviderOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="createData()">
          确认
        </el-button>
      </div>
    </el-dialog>

    <!-- 修改折扣后金额对话框 -->
    <el-dialog
      title="修改折扣后金额"
      :visible.sync="discountDialogVisible"
      width="400px"
    >
      <el-form :model="discountTemp" label-width="120px">
        <el-form-item label="新折扣金额">
          <el-input v-model.number="discountTemp.discountedAmount" type="number" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="discountTemp.remark" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="discountDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmChangeDiscountedAmount()">确认</el-button>
      </div>
    </el-dialog>

    <!-- 设置为已支付对话框 -->
    <el-dialog
      title="设置为已支付"
      :visible.sync="paidDialogVisible"
      width="400px"
    >
      <el-form :model="paidTemp" label-width="120px">
        <el-form-item label="原因">
          <el-input v-model="paidTemp.reason" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="paidDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmSetAsPaid()">确认</el-button>
      </div>
    </el-dialog>

    <!-- 设置为已完成对话框 -->
    <el-dialog
      title="设置为已完成"
      :visible.sync="completedDialogVisible"
      width="400px"
    >
      <el-form :model="completedTemp" label-width="120px">
        <el-form-item label="原因">
          <el-input v-model="completedTemp.reason" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="completedDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmSetAsCompleted()">确认</el-button>
      </div>
    </el-dialog>

    <!-- 设置为已退款对话框 -->
    <el-dialog
      title="设置为已退款"
      :visible.sync="refundDialogVisible"
      width="400px"
    >
      <el-form :model="refundTemp" label-width="120px">
        <el-form-item label="退款金额">
          <el-input v-model.number="refundTemp.refundAmount" type="number" />
        </el-form-item>
        <el-form-item label="原因">
          <el-input v-model="refundTemp.reason" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="refundDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmSetAsRefund()">确认</el-button>
      </div>
    </el-dialog>

    <!-- 订单详情对话框 -->
    <OrderDetail
      :visible.sync="detailDialogVisible"
      :order-id="selectedOrderId"
    />

  </div>
</template>

<script>
import { getOrders, createOrder, deleteOrder, setOrderAsPaid, setOrderAsCompleted, setOrderAsCanceled, setOrderAsRefund, changeDiscountedAmount } from '@/api/order'
import { getPackages } from '@/api/package'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import OrderDetail from './components/OrderDetail.vue'
import { parseTime } from '@/utils'

export default {
  name: 'OrderTable',
  components: { Pagination, OrderDetail },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        PageIndex: 1,
        PageSize: 20,
        Filter: '',
        PackageId: undefined,
        OrderStatus: undefined,
        OrderType: undefined
      },
      temp: {
        id: undefined,
        userId: undefined,
        packageId: undefined,
        quantity: 1,
        currency: 'USD',
        paymentProvider: 11 // 默认支付宝
      },
      discountTemp: {
        id: undefined,
        discountedAmount: 0,
        remark: ''
      },
      paidTemp: {
        id: undefined,
        reason: ''
      },
      completedTemp: {
        id: undefined,
        reason: ''
      },
      refundTemp: {
        id: undefined,
        refundAmount: 0,
        reason: ''
      },
      users: [],
      packages: [],
      orderStatusOptions: [
        { value: 0, label: '待支付', type: 'info' },
        { value: 1, label: '已支付', type: 'success' },
        { value: 2, label: '已完成', type: 'primary' },
        { value: 3, label: '付款失败', type: 'danger' },
        { value: 4, label: '已取消', type: 'primary' },
        { value: 5, label: '退款中', type: 'warning' },
        { value: 6, label: '已退款', type: 'info' },
        { value: 7, label: '金额异常', type: 'danger' }
      ],
      orderTypeOptions: [
        { value: 0, label: '购买', type: 'success' },
        { value: 1, label: '续费', type: 'primary' }
      ],
      paymentProviderOptions: [
        { value: 11, label: '支付宝即时到账' },
        { value: 12, label: '微信扫码' },
        { value: 21, label: 'Stripe支付' },
        { value: 22, label: 'PayPal支付' },
        { value: 31, label: 'Coinbase支付' }
      ],
      dialogFormVisible: false,
      discountDialogVisible: false,
      paidDialogVisible: false,
      completedDialogVisible: false,
      refundDialogVisible: false,
      detailDialogVisible: false,
      selectedOrderId: null,
      rules: {
        userId: [{ required: true, message: '用户ID不能为空', trigger: 'blur' }],
        packageId: [{ required: true, message: '套餐ID不能为空', trigger: 'blur' }],
        quantity: [{ required: true, message: '数量不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    // this.loadUsers()
    this.loadPackages()
    this.getList()
  },
  methods: {
    parseTime,
    getList() {
      this.listLoading = true
      getOrders(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    // loadUsers() {
    //   getUsers({ PageIndex: 1, PageSize: 50 }).then(response => {
    //     this.users = response.data.items
    //   })
    // },
    loadPackages() {
      getPackages({}).then(response => {
        this.packages = response.data.items
      })
    },
    resetForm() {
      this.temp = {
        id: undefined,
        userId: undefined,
        packageId: undefined,
        quantity: 1,
        currency: 'USD',
        paymentProvider: 11
      }
    },
    handleFilter() {
      this.listQuery.PageIndex = 1
      this.getList()
    },
    handleCreate() {
      this.resetForm()
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createOrder(this.temp).then(() => {
            this.getList()
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '订单创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    // 订单没有通用的更新接口，因此不提供编辑功能
    handleView(row) {
      this.selectedOrderId = row.id
      this.detailDialogVisible = true
    },
    handleDelete(row) {
      this.$confirm('确定要删除此订单吗？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteOrder(row.id).then(() => {
          this.getList()
          this.$notify({
            title: '成功',
            message: '订单删除成功',
            type: 'success',
            duration: 2000
          })
        })
      })
    },
    orderStatusFilter(status) {
      const statusMap = {
        0: { label: '待支付', type: 'primary', effect: 'dark' },
        1: { label: '已支付', type: 'success', effect: 'light' },
        2: { label: '已完成', type: 'success', effect: 'dark' },
        3: { label: '付款失败', type: 'danger', effect: 'light' },
        4: { label: '已取消', type: 'primary', effect: 'light' },
        5: { label: '退款中', type: 'warning', effect: 'dark' },
        6: { label: '已退款', type: 'info', effect: 'dark' },
        7: { label: '金额异常', type: 'danger', effect: 'dark' }
      }
      return statusMap[status] || { label: '未知', type: 'info', effect: 'dark' }
    },
    orderTypeFilter(type) {
      const typeMap = {
        0: { label: '购买', type: 'success' },
        1: { label: '续费', type: 'primary' }
      }
      return typeMap[type] || { label: '未知', type: 'info' }
    },
    paymentProviderFilter(provider) {
      const providerMap = {
        11: '支付宝即时到账',
        12: '微信扫码',
        21: 'Stripe支付',
        22: 'PayPal支付',
        31: 'Coinbase支付'
      }
      return providerMap[provider] || '未知'
    },
    packageFilter(packageId) {
      for (const item of this.packages) {
        if (item.id === packageId) {
          return item.name
        }
      }
    },
    handleChangeDiscountedAmount(row) {
      this.discountTemp = {
        id: row.id,
        discountedAmount: row.discountedAmount,
        remark: ''
      }
      this.discountDialogVisible = true
    },
    confirmChangeDiscountedAmount() {
      changeDiscountedAmount(this.discountTemp.id, this.discountTemp).then(() => {
        this.discountDialogVisible = false
        this.getList()
        this.$notify({
          title: '成功',
          message: '折扣金额修改成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    handleSetAsPaid(row) {
      this.paidTemp = {
        id: row.id,
        reason: ''
      }
      this.paidDialogVisible = true
    },
    confirmSetAsPaid() {
      setOrderAsPaid(this.paidTemp.id, this.paidTemp).then(() => {
        this.paidDialogVisible = false
        this.getList()
        this.$notify({
          title: '成功',
          message: '订单状态已设置为已支付',
          type: 'success',
          duration: 2000
        })
      })
    },
    handleSetAsCompleted(row) {
      this.completedTemp = {
        id: row.id,
        reason: ''
      }
      this.completedDialogVisible = true
    },
    confirmSetAsCompleted() {
      setOrderAsCompleted(this.completedTemp.id, this.completedTemp).then(() => {
        this.completedDialogVisible = false
        this.getList()
        this.$notify({
          title: '成功',
          message: '订单状态已设置为已完成',
          type: 'success',
          duration: 2000
        })
      })
    },
    handleSetAsCanceled(row) {
      this.$confirm('确定要将此订单设置为已取消吗？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        setOrderAsCanceled(row.id, { reason: '手动取消' }).then(() => {
          this.getList()
          this.$notify({
            title: '成功',
            message: '订单状态已设置为已取消',
            type: 'success',
            duration: 2000
          })
        })
      })
    },
    handleSetAsRefund(row) {
      this.refundTemp = {
        id: row.id,
        refundAmount: row.discountedAmount,
        reason: ''
      }
      this.refundDialogVisible = true
    },
    confirmSetAsRefund() {
      setOrderAsRefund(this.refundTemp.id, this.refundTemp).then(() => {
        this.refundDialogVisible = false
        this.getList()
        this.$notify({
          title: '成功',
          message: '订单状态已设置为已退款',
          type: 'success',
          duration: 2000
        })
      })
    }
  }
}
</script>

<style>
  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
</style>
