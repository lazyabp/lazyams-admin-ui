import request from '@/utils/request'

export function uploadFile(data) {
  return request({
    url: '/api/File/upload',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export function uploadAvatar(data) {
  return request({
    url: '/api/File/avatar/upload',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
