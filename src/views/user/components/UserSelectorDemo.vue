<template>
  <div class="demo-user-selector">
    <h2>用户选择组件演示</h2>
    <div style="margin-bottom: 20px;">
      <el-button type="primary" @click="showSingleUserSelector">单选用户</el-button>
      <el-button type="success" @click="showMultiUserSelector">多选用户</el-button>
      <el-button @click="setInitialValue">设置初始值</el-button>
    </div>
    <div class="selected-info">
      <h3>已选择用户（单选）：</h3>
      <div v-if="singleSelectedUser">
        <p><strong>用户名：</strong>{{ singleSelectedUser.userName }}</p>
        <p><strong>邮箱：</strong>{{ singleSelectedUser.email }}</p>
      </div>
      <p v-else>暂无选择</p>
    </div>
    <div class="selected-info" style="margin-top: 20px;">
      <h3>已选择用户（多选）：</h3>
      <div v-if="multiSelectedUsers.length > 0">
        <div v-for="user in multiSelectedUsers" :key="user.id" style="margin-bottom: 10px;">
          <p><strong>用户名：</strong>{{ user.userName }} | <strong>邮箱：</strong>{{ user.email }}</p>
        </div>
      </div>
      <p v-else>暂无选择</p>
    </div>
    <!-- 单选用户选择组件 -->
    <user-selector
      v-model="singleSelectedIds"
      :visible.sync="singleSelectorVisible"
      :multiple="false"
      dialog-title="请选择用户（单选）"
      search-placeholder="请输入用户名或邮箱进行搜索"
      @changed="handleSingleUserSelect"
      @cleared="handleSingleUserClear"
    />
    <!-- 多选用户选择组件 -->
    <user-selector
      v-model="multiSelectedIds"
      :visible.sync="multiSelectorVisible"
      :multiple="true"
      dialog-title="请选择用户（多选）"
      search-placeholder="请输入用户名或邮箱进行搜索"
      @changed="handleMultiUserSelect"
      @cleared="handleMultiUserClear"
    />
  </div>
</template>

<script>
import UserSelector from '@/views/user/components/UserSelector.vue'

export default {
  name: 'DemoUserSelector',
  components: {
    UserSelector
  },
  data() {
    return {
      singleSelectorVisible: false,
      multiSelectorVisible: false,
      singleSelectedIds: [], // 存储单选用户ID
      multiSelectedIds: [], // 存储多选用户ID
      singleSelectedUser: null, // 存储单选用户对象
      multiSelectedUsers: [] // 存储多选用户对象数组
    }
  },
  methods: {
    showSingleUserSelector() {
      this.singleSelectorVisible = true
    },
    showMultiUserSelector() {
      this.multiSelectorVisible = true
    },
    handleSingleUserSelect(users) {
      if (users && users.length > 0) {
        this.singleSelectedUser = users[0]
        this.$message.success(`已选择用户: ${users[0].userName}`)
        console.log('Selected single user:', users[0])
      }
    },
    handleMultiUserSelect(users) {
      this.multiSelectedUsers = users
      this.$message.success(`已选择 ${users.length} 个用户`)
      console.log('Selected multi users:', users)
    },
    handleSingleUserClear() {
      this.singleSelectedUser = null
      this.$message.info('已清除单选用户选择')
    },
    handleMultiUserClear() {
      this.multiSelectedUsers = []
      this.$message.info('已清除多选用户选择')
    },
    setInitialValue() {
      // 设置初始值，例如默认选择ID为1和2的用户
      this.singleSelectedIds = [1] // 假设ID为1的用户存在
      this.multiSelectedIds = [1, 2] // 假设ID为1和2的用户存在
      this.$message.info('已设置初始选择值')
    }
  }
}
</script>

<style scoped>
.demo-user-selector {
  padding: 20px;
}

.selected-info {
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 15px;
  background-color: #f9f9f9;
  margin-top: 20px;
}

.selected-info p {
  margin: 5px 0;
}
</style>
