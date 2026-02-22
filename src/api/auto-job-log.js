import request from '@/utils/request'

export function getAutoJobLogs(params) {
  return request({
    url: '/api/Admin/AutoJobLog/GetByPage',
    method: 'get',
    params
  })
}

export function getAutoJobLogById(id) {
  return request({
    url: `/api/Admin/AutoJobLog/GetById/${id}`,
    method: 'get'
  })
}

export function deleteAutoJobLog(id) {
  return request({
    url: `/api/Admin/AutoJobLog/Delete/${id}`,
    method: 'delete'
  })
}

export function clearAutoJobLogs() {
  return request({
    url: '/api/Admin/AutoJobLog/Clear',
    method: 'delete'
  })
}
