<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-button v-show="weixinLoginEnabled" type="primary" class="social-sign-btn" @click="weixinHandleClick()">
          <span class="wx-svg-container"><svg-icon icon-class="wechat" class="icon" /></span>
          微信登录
        </el-button>
      </el-col>
      <el-col :span="24">
        <el-button v-show="googleLoginEnabled" type="primary" class="social-sign-btn" @click="googleHandleClick()">
          <span class="google-svg-container"><svg-icon icon-class="google" class="icon" /></span>
          Google登录
        </el-button>
      </el-col>
    </el-row>
    <el-dialog
      title="微信扫描登录"
      :visible.sync="dialogVisible"
      @close="dialogVisible = false"
    >
      <iframe
        :src="weixinLoginUrl"
        frameborder="0"
        width="300"
        height="300"
      />
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { weixinLogin, googleLogin } from '@/api/socialite'

export default {
  name: 'SocialSignin',
  data() {
    return {
      weixinLoginEnabled: false,
      googleLoginEnabled: false,
      weixinLoginUrl: '',
      dialogVisible: false
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
          this.weixinLoginEnabled = newVal.socialitelogin.WeixinLogin
          this.googleLoginEnabled = newVal.socialitelogin.GoogleLogin
        }
      }
    },
    '$route.query.callback': {
      handler(value) {
        if (value) {
          if (value === 'weixin' && this.$route.query.code) {
            this.$store.dispatch('user/weixinLogin', this.$route.query.code)
              .then(() => {
                this.$router.push({ path: '/' })
              })
              .catch(err => {
                this.$message.error(err.message || 'Weixin login failed')
              })
          } else if (value === 'google' && this.$route.query.code) {
            this.$store.dispatch('user/googleLogin', this.$route.query.code)
              .then(() => {
                this.$router.push({ path: '/' })
              })
              .catch(err => {
                this.$message.error(err.message || 'Google login failed')
              })
          }
        }
      },
      immediate: true
    }
  },
  methods: {
    weixinHandleClick() {
      weixinLogin().then(res => {
        const redirectUri = encodeURIComponent(res.data.redirectUrl)
        this.weixinLoginUrl = `https://open.weixin.qq.com/connect/qrconnect?appid=${res.data.AppId}&redirect_uri=${redirectUri}&response_type=code&scope=snsapi_login&state=STATE#wechat_redirect`
        this.dialogVisible = true
      })
    },
    googleHandleClick() {
      googleLogin().then(res => {
        const redirectUri = encodeURIComponent(res.data.redirectUrl)
        const googleLoginUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${res.data.clientId}&redirect_uri=${redirectUri}&response_type=code&scope=profile email&access_type=offline`
        window.location.href = googleLoginUrl
      })
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
