import request from '@/utils/request'

export function getAutoJobLogs(params) {
  return request({
    url: '/api/AutoJobLog/GetByPage',
    method: 'get',
    params
  })
}

export function getAutoJobLogById(id) {
  return request({
    url: `/api/AutoJobLog/GetById/${id}`,
    method: 'get'
  })
}

export function deleteAutoJobLog(id) {
  return request({
    url: `/api/AutoJobLog/Delete/${id}`,
    method: 'delete'
  })
}

export function clearAutoJobLogs() {
  return request({
    url: '/api/AutoJobLog/Clear',
    method: 'delete'
  })
}
