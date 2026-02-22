import request from '@/utils/request'

export function getMenus(params) {
  return request({
    url: '/api/Admin/Menu/GetByPage',
    method: 'get',
    params
  })
}

export function addMenu(data) {
  return request({
    url: '/api/Admin/Menu/Add',
    method: 'post',
    data
  })
}

export function updateMenu(data) {
  return request({
    url: '/api/Admin/Menu/Update',
    method: 'post',
    data
  })
}

export function deleteMenu(id) {
  return request({
    url: `/api/Admin/Menu/Delete/${id}`,
    method: 'delete'
  })
}

export function getMenuById(id) {
  return request({
    url: `/api/Admin/Menu/GetById/${id}`,
    method: 'get'
  })
}

export function getMenuTree() {
  return request({
    url: '/api/Admin/Menu/GetMenuTree',
    method: 'get'
  })
}

export function activeMenu(id, data) {
  return request({
    url: `/api/Admin/Menu/Active/${id}`,
    method: 'post',
    data
  })
}

export function getMenuTypes() {
  return request({
    url: '/api/Admin/Menu/GetMenuType',
    method: 'get'
  })
}

export function getMenuIdsByRoleId(id) {
  return request({
    url: `/api/Admin/Menu/GetMenuIdsByRoleId/${id}`,
    method: 'get'
  })
}
