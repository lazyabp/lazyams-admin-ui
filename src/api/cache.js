import request from '@/utils/request'

export function getCacheTags() {
  return request({
    url: '/api/Admin/Cache/GetCacheTags',
    method: 'get'
  })
}

export function deleteCache(tag) {
  return request({
    url: `/api/Admin/Cache/Delete/${tag}`,
    method: 'delete'
  })
}

export function clearCache() {
  return request({
    url: '/api/Admin/Cache/Clear',
    method: 'delete'
  })
}
