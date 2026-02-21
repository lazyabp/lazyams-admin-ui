import request from '@/utils/request'

export function getBlogArticles(params) {
  return request({
    url: '/api/BlogArticle/GetByPage',
    method: 'get',
    params
  })
}

export function getBlogArticleById(id) {
  return request({
    url: `/api/BlogArticle/GetById/${id}`,
    method: 'get'
  })
}

export function addBlogArticle(data) {
  return request({
    url: '/api/BlogArticle/Add',
    method: 'post',
    data
  })
}

export function updateBlogArticle(data) {
  return request({
    url: '/api/BlogArticle/Update',
    method: 'post',
    data
  })
}

export function deleteBlogArticle(id) {
  return request({
    url: `/api/BlogArticle/Delete/${id}`,
    method: 'delete'
  })
}

export function changeBlogArticleStatus(id, data) {
  return request({
    url: `/api/BlogArticle/ChangeStatus/${id}`,
    method: 'post',
    data
  })
}

export function getArticleStatus() {
  return request({
    url: '/api/BlogArticle/GetArticleStatus',
    method: 'get'
  })
}

export function generateSlug(data) {
  return request({
    url: `/api/BlogArticle/GenerateSlug`,
    method: 'post',
    data
  })
}
