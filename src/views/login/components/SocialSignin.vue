<template>
  <el-row>
    <el-col :span="24">
      <el-button v-show="weixinLogin" type="primary" class="social-sign-btn" @click="weixinHandleClick()">
        <span class="wx-svg-container"><svg-icon icon-class="wechat" class="icon" /></span>
        微信登录
      </el-button>
    </el-col>
    <el-col :span="24">
      <el-button v-show="googleLogin" type="primary" class="social-sign-btn" @click="googleHandleClick()">
        <span class="google-svg-container"><svg-icon icon-class="google" class="icon" /></span>
        Google登录
      </el-button>
    </el-col>
  </el-row>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'SocialSignin',
  data() {
    return {
      weixinLogin: false,
      googleLogin: false
    }
  },
  computed: {
    ...mapGetters([
      'settings'
    ])
  },
  watch: {
    settings: {
      immediate: true,
      handler(newVal) {
        if (newVal && newVal.socialitelogin) {
          this.weixinLogin = newVal.socialitelogin.WeixinLogin
          this.googleLogin = newVal.socialitelogin.GoogleLogin
        }
      }
    }
  },
  methods: {
    weixinHandleClick() {
      alert('ok')
    },
    googleHandleClick() {
      alert('ok')
    }
  }
}
</script>

<style lang="scss" scoped>
  .social-sign-btn {
    width: 100%;
    margin-top: 15px;
    justify-content: center;
    .icon {
      color: #fff;
      font-size: 16px;
    }
  }

  .wx-svg-container,
  .google-svg-container {
    display: inline-block;
    width: 16px;
  }
</style>
