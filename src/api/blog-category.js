import request from '@/utils/request'

export function getBlogCategories(params) {
  return request({
    url: '/api/BlogCategory/GetByPage',
    method: 'get',
    params
  })
}

export function getBlogCategoryById(id) {
  return request({
    url: `/api/BlogCategory/GetById/${id}`,
    method: 'get'
  })
}

export function addBlogCategory(data) {
  return request({
    url: '/api/BlogCategory/Add',
    method: 'post',
    data
  })
}

export function updateBlogCategory(data) {
  return request({
    url: '/api/BlogCategory/Update',
    method: 'post',
    data
  })
}

export function deleteBlogCategory(id) {
  return request({
    url: `/api/BlogCategory/Delete/${id}`,
    method: 'delete'
  })
}

export function changeBlogCategoryStatus(id, data) {
  return request({
    url: `/api/BlogCategory/ChangeStatus/${id}`,
    method: 'post',
    data
  })
}

export function getCategoryTree() {
  return request({
    url: '/api/BlogCategory/GetCategoryTree',
    method: 'get'
  })
}

export function getCategoryTreeByParentId(parentId) {
  return request({
    url: '/api/BlogCategory/GetCategoryTreeByParentId',
    method: 'get',
    params: { parentId }
  })
}

export function getPublishStatus() {
  return request({
    url: '/api/BlogCategory/GetPublishStatus',
    method: 'get'
  })
}
