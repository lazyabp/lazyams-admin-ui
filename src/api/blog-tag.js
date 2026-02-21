import request from '@/utils/request'

export function getBlogTags(params) {
  return request({
    url: '/api/BlogTag/GetByPage',
    method: 'get',
    params
  })
}

export function getBlogTagById(id) {
  return request({
    url: `/api/BlogTag/GetById/${id}`,
    method: 'get'
  })
}

export function addBlogTag(data) {
  return request({
    url: '/api/BlogTag/Add',
    method: 'post',
    data
  })
}

export function updateBlogTag(data) {
  return request({
    url: '/api/BlogTag/Update',
    method: 'post',
    data
  })
}

export function deleteBlogTag(id) {
  return request({
    url: `/api/BlogTag/Delete/${id}`,
    method: 'delete'
  })
}
