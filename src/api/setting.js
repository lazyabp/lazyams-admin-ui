import request from '@/utils/request'

export function allSettings() {
  return request({
    url: '/api/Setting/all',
    method: 'get'
  })
}

export function getSetting(key) {
  return request({
    url: '/api/Setting/get',
    method: 'get',
    params: { key }
  })
}

export function setSetting(key, value) {
  return request({
    url: '/api/Setting/set',
    method: 'post',
    params: { key },
    data: value
  })
}
