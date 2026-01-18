import request from '@/utils/request'

export function weixinLogin() {
  return request({
    url: '/api/socialite/weixin/login',
    method: 'get'
  })
}

export function weixinMiniLogin() {
  return request({
    url: '/api/socialite/weixin-mini/login',
    method: 'get'
  })
}

export function googleLogin() {
  return request({
    url: '/api/socialite/google/login',
    method: 'get'
  })
}

export function weixinCallback(code) {
  return request({
    url: '/api/socialite/weixin/callback',
    method: 'get',
    params: { code }
  })
}

export function weixinMiniCallback(data) {
  return request({
    url: '/api/socialite/weixin-mini/callback',
    method: 'post',
    data
  })
}

export function googleCallback(code) {
  return request({
    url: '/api/socialite/google/callback',
    method: 'get',
    params: { code }
  })
}
