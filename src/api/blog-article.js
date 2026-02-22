import request from '@/utils/request'

export function getBlogArticles(params) {
  return request({
    url: '/api/Admin/BlogArticle/GetByPage',
    method: 'get',
    params
  })
}

export function getBlogArticleById(id) {
  return request({
    url: `/api/Admin/BlogArticle/GetById/${id}`,
    method: 'get'
  })
}

export function addBlogArticle(data) {
  return request({
    url: '/api/Admin/BlogArticle/Add',
    method: 'post',
    data
  })
}

export function updateBlogArticle(data) {
  return request({
    url: '/api/Admin/BlogArticle/Update',
    method: 'post',
    data
  })
}

export function deleteBlogArticle(id) {
  return request({
    url: `/api/Admin/BlogArticle/Delete/${id}`,
    method: 'delete'
  })
}

export function changeBlogArticleStatus(id, data) {
  return request({
    url: `/api/Admin/BlogArticle/ChangeStatus/${id}`,
    method: 'post',
    data
  })
}

export function getArticleStatus() {
  return request({
    url: '/api/Admin/BlogArticle/GetArticleStatus',
    method: 'get'
  })
}

export function generateSlug(data) {
  return request({
    url: `/api/Admin/BlogArticle/GenerateSlug`,
    method: 'post',
    data
  })
}
