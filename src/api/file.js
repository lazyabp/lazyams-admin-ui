import request from '@/utils/request'

export function uploadFile(data) {
  return request({
    url: '/api/File/Upload',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export function uploadAvatar(data) {
  return request({
    url: '/api/File/Avatar/Upload',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
