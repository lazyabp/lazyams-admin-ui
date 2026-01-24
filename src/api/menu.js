import request from '@/utils/request'

export function getMenus(params) {
  return request({
    url: '/api/Menu/GetByPage',
    method: 'get',
    params
  })
}

export function addMenu(data) {
  return request({
    url: '/api/Menu/Add',
    method: 'post',
    data
  })
}

export function updateMenu(data) {
  return request({
    url: '/api/Menu/Update',
    method: 'post',
    data
  })
}

export function deleteMenu(id) {
  return request({
    url: `/api/Menu/Delete/${id}`,
    method: 'delete'
  })
}

export function getMenu(id) {
  return request({
    url: `/api/Menu/GetById/${id}`,
    method: 'get'
  })
}

export function getMenuTree() {
  return request({
    url: '/api/Menu/GetMenuTree',
    method: 'get'
  })
}

export function getMenuType() {
  return request({
    url: '/api/Menu/GetMenuType',
    method: 'get'
  })
}

export function getMenuIdsByRoleId(id) {
  return request({
    url: `/api/Menu/GetMenuIdsByRoleId/${id}`,
    method: 'get'
  })
}

export function activeMenu(id, data) {
  return request({
    url: `/api/Menu/Active/${id}`,
    method: 'post',
    data
  })
}
