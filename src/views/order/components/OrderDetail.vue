<template>
  <el-dialog
    title="订单详情"
    :visible.sync="dialogVisible"
    :before-close="handleClose"
    :close-on-click-modal="false"
    width="800px"
  >
    <div v-if="orderDetail" class="order-detail-content">
      <table class="detail-table">
        <tr>
          <td class="label">订单ID</td>
          <td class="content">{{ orderDetail.id }}</td>
        </tr>
        <tr>
          <td class="label">订单号</td>
          <td class="content">{{ orderDetail.orderNo }}</td>
        </tr>
        <tr>
          <td class="label">交易号</td>
          <td class="content">{{ orderDetail.tradeNo }}</td>
        </tr>
        <tr>
          <td class="label">用户</td>
          <td class="content">
            <span v-if="orderDetail.user">{{ orderDetail.user.nickName }}</span>
            <span v-else>-</span>
          </td>
        </tr>
        <tr>
          <td class="label">套餐</td>
          <td class="content">
            <span v-if="orderDetail.package">{{ orderDetail.package.name }}</span>
            <span v-else>-</span>
          </td>
        </tr>
        <tr>
          <td class="label">订单类型</td>
          <td class="content">
            <el-tag :type="orderTypeFilter(orderDetail.orderType).type" size="small">
              {{ orderTypeFilter(orderDetail.orderType).label }}
            </el-tag>
          </td>
        </tr>
        <tr>
          <td class="label">订单状态</td>
          <td class="content">
            <el-tag :type="orderStatusFilter(orderDetail.orderStatus).type" size="small">
              {{ orderStatusFilter(orderDetail.orderStatus).label }}
            </el-tag>
          </td>
        </tr>
        <tr>
          <td class="label">价格</td>
          <td class="content">{{ orderDetail.price }}</td>
        </tr>
        <tr>
          <td class="label">数量</td>
          <td class="content">{{ orderDetail.quantity }}</td>
        </tr>
        <tr>
          <td class="label">金额</td>
          <td class="content">{{ orderDetail.amount }}</td>
        </tr>
        <tr>
          <td class="label">折后金额</td>
          <td class="content">{{ orderDetail.discountedAmount }}</td>
        </tr>
        <tr>
          <td class="label">货币</td>
          <td class="content">{{ orderDetail.currency }}</td>
        </tr>
        <tr>
          <td class="label">支付方式</td>
          <td class="content">{{ paymentProviderFilter(orderDetail.paymentProvider) }}</td>
        </tr>
        <tr>
          <td class="label">创建时间</td>
          <td colspan="3" class="content">{{ parseTime(orderDetail.createdAt) }}</td>
        </tr>
      </table>

      <div v-if="orderDetail.logs && orderDetail.logs.length > 0" class="section">
        <h3>订单日志</h3>
        <el-table :data="orderDetail.logs" style="width: 100%" border size="mini">
          <el-table-column prop="orderAction" label="动作" width="120">
            <template slot-scope="{row}">
              <el-tag size="mini">{{ orderActionFilter(row.orderAction) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="content" label="内容" />
          <el-table-column prop="createdAt" label="时间" width="180">
            <template slot-scope="{row}">
              {{ parseTime(row.createdAt) }}
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <div v-else class="empty-placeholder">
      <i class="el-icon-document-delete" style="font-size: 40px; color: #dcdfe6;" />
      <p>暂无数据</p>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">关 闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getOrderById } from '@/api/order'
import { parseTime } from '@/utils'

export default {
  name: 'OrderDetail',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    orderId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      orderDetail: null,
      loading: false
    }
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible
      },
      set(value) {
        this.$emit('update:visible', value)
      }
    }
  },
  watch: {
    visible: {
      handler(newVal) {
        if (newVal) {
          this.fetchData()
        }
      },
      immediate: true
    }
  },
  methods: {
    parseTime,
    fetchData() {
      if (!this.orderId) {
        this.$message.error('缺少订单ID参数')
        return
      }
      this.loading = true
      getOrderById(this.orderId).then(response => {
        this.orderDetail = response.data
      }).catch(error => {
        console.log(error)
        this.$message.error('获取订单信息失败')
      }).finally(() => {
        this.loading = false
      })
    },
    handleClose() {
      this.orderDetail = null
      this.$emit('update:visible', false)
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
    genderFilter(gender) {
      const genderMap = {
        0: '其他',
        1: '男',
        2: '女'
      }
      return genderMap[gender] || '未知'
    },
    durationUnitFilter(unit) {
      const unitMap = {
        1: '天',
        2: '周',
        3: '月',
        4: '年'
      }
      return unitMap[unit] || '未知'
    },
    orderActionFilter(action) {
      const actionMap = {
        0: '创建订单',
        1: '支付成功',
        2: '订单已完成',
        3: '付款失败',
        4: '订单取消',
        5: '申请退款',
        6: '退款成功',
        90: '金额异常',
        91: '管理确认',
        92: '修改OrderNo',
        100: '其他'
      }
      return actionMap[action] || '未知'
    }
  }
}
</script>

<style lang="scss" scoped>
.detail-table {
  width: 100%;
  td {
    padding: 5px 0;
    border-bottom: 1px solid #efefef;
  }
  .label {
    font-weight: 600;
  }
}
.section {
  margin-top: 30px;
  h3 {
    border-bottom: 1px solid #eee;
    padding-bottom: 10px;
    margin-bottom: 20px;
  }
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.order-detail-content {
  max-height: 60vh;
  overflow-y: auto;
}
</style>
