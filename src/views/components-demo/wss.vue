<template>
  <div class="components-container">
    <el-form ref="form" label-width="80px">
      <el-form-item label="内容">
        <ul class="message-box" v-html="detail" />
      </el-form-item>
      <el-form-item label="消息">
        <el-input v-model="message" type="textarea" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSend">发送</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import signalR from '@/utils/signalr'

export default {
  name: 'WssDemo',
  data() {
    return {
      message: '',
      detail: ''
    }
  },
  created() {
    signalR.start('chat', this.receiveMsg)
  },
  methods: {
    async handleSend() {
      await signalR.SR.invoke('SendMessage', this.message)
      this.detail += `<li><div style="margin-left:200px;width:400px;background:#13ce66;color:#fff;padding: 15px;border-radius: 15px;float:right;">${this.message}</div></li><div style="clear:both;"></div>`
      this.message = ''
    },
    receiveMsg(connection) {
      connection.on('ReceiveMessage', (message) => {
        this.detail += `<li><div style="width:400px;background:#1890ff;color:#fff;padding: 15px;border-radius: 15px;">${message}</div></li>`
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.message-box {
  list-style-type: none;
  margin: 0;
  padding: 0;
}
.message-box li {
  list-style-type: none;
  margin: 15px 15px;
  clear: both;
}
</style>
