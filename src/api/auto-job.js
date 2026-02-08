import request from '@/utils/request'

export function getAutoJobs(params) {
  return request({
    url: '/api/AutoJob/GetByPage',
    method: 'get',
    params
  })
}

export function getAutoJobById(id) {
  return request({
    url: `/api/AutoJob/GetById/${id}`,
    method: 'get'
  })
}

export function addAutoJob(data) {
  return request({
    url: '/api/AutoJob/Add',
    method: 'post',
    data
  })
}

export function updateAutoJob(data) {
  return request({
    url: '/api/AutoJob/Update',
    method: 'post',
    data
  })
}

export function executeAutoJob(data) {
  return request({
    url: '/api/AutoJob/Execute',
    method: 'post',
    data
  })
}

export function deleteAutoJob(id) {
  return request({
    url: `/api/AutoJob/Delete/${id}`,
    method: 'delete'
  })
}
