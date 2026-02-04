import request from '@/utils/request'

export function getAllConfigs() {
  return request({
    url: '/api/Config/GetAll',
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

export function getKeys() {
  return request({
    url: '/api/Config/GetKeys',
    method: 'get'
  })
}

export function testMailer(data) {
  return request({
    url: '/api/Config/TestMailer',
    method: 'post',
    data
  })
}

export function testSms(data) {
  return request({
    url: '/api/Config/TestSms',
    method: 'post',
    data
  })
}
