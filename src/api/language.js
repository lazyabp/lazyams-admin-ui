import request from '@/utils/request'

export function getLanguages(params) {
  return request({
    url: '/api/Admin/Language/GetByPage',
    method: 'get',
    params
  })
}

export function getLanguageById(id) {
  return request({
    url: `/api/Admin/Language/GetById/${id}`,
    method: 'get'
  })
}

export function addLanguage(data) {
  return request({
    url: '/api/Admin/Language/Add',
    method: 'post',
    data
  })
}

export function updateLanguage(data) {
  return request({
    url: '/api/Admin/Language/Update',
    method: 'post',
    data
  })
}

export function setDefaultLanguage(id) {
  return request({
    url: `/api/Admin/Language/SetDefault/${id}`,
    method: 'post'
  })
}

export function deleteLanguage(id) {
  return request({
    url: `/api/Admin/Language/Delete/${id}`,
    method: 'delete'
  })
}

export function getPublishStatus() {
  return request({
    url: '/api/Language/GetPublishStatus',
    method: 'get'
  })
}

export function getTextDirection() {
  return request({
    url: '/api/Language/GetTextDirection',
    method: 'get'
  })
}
