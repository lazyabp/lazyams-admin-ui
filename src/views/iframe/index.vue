<template>
  <div class="iframe-container">
    <iframe
      :src="src"
      frameborder="0"
      class="iframe-content"
      @load="onLoad"
    />
  </div>
</template>

<script>
export default {
  name: 'IframePage',
  data() {
    return {
      src: ''
    }
  },
  watch: {
    // 监听路由变化，更新iframe的src
    '$route'(to) {
      this.src = to.query.url || to.params.url
    }
  },
  created() {
    // 从路由参数获取URL
    this.src = this.$route.query.url || this.$route.params.url
  },
  methods: {
    onLoad() {
      console.log('Iframe loaded')
    }
  }
}
</script>

<style lang="scss" scoped>
.iframe-container {
  width: 100%;
  height: 100vh;

  .iframe-content {
    width: 100%;
    height: 100%;
    overflow: auto;
  }
}
</style>
