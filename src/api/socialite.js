import request from '@/utils/request'

export function weixinLogin() {
  return request({
    url: '/api/Socialite/Weixin/Login',
    method: 'get'
  })
}

export function weixinMiniLogin() {
  return request({
    url: '/api/Socialite/WeixinMini/Login',
    method: 'get'
  })
}

export function googleLogin() {
  return request({
    url: '/api/Socialite/Google/Login',
    method: 'get'
  })
}

export function weixinCallback(code) {
  return request({
    url: '/api/Socialite/Weixin/Callback',
    method: 'get',
    params: { code }
  })
}

export function weixinMiniCallback(data) {
  return request({
    url: '/api/Socialite/WeixinMini/Callback',
    method: 'post',
    data
  })
}

export function googleCallback(code) {
  return request({
    url: '/api/Socialite/Google/Callback',
    method: 'get',
    params: { code }
  })
}
