import request from '@/utils/request'

export function getFiles(params) {
  return request({
    url: '/api/File/GetByPage',
    method: 'get',
    params
  })
}

export function uploadFile(data) {
  return request({
    url: '/api/File/Upload',
    method: 'post',
    data
  })
}

export function uploadAvatar(data) {
  return request({
    url: '/api/File/Avatar/Upload',
    method: 'post',
    data
  })
}

export function deleteFile(id) {
  return request({
    url: `/api/File/${id}`,
    method: 'delete'
  })
}
