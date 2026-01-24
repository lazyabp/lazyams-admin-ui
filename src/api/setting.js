import request from '@/utils/request'

export function allSettings() {
  return request({
    url: '/api/Setting/All',
    method: 'get'
  })
}

export function getSetting(key) {
  return request({
    url: '/api/Setting/Get',
    method: 'get',
    params: { key }
  })
}

export function setSetting(key, value) {
  return request({
    url: '/api/Setting/Set',
    method: 'post',
    params: { key },
    data: value
  })
}
