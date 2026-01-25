import request from '@/utils/request'

export function getAllConfigs() {
  return request({
    url: '/api/Config/All',
    method: 'get'
  })
}

export function getConfig(key) {
  return request({
    url: '/api/Config/Get',
    method: 'get',
    params: { key }
  })
}

export function setConfig(key, data) {
  return request({
    url: '/api/Config/Set',
    method: 'post',
    params: { key },
    data
  })
}
