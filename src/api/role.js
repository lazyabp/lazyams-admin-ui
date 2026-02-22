import request from '@/utils/request'

export function getRoles(params) {
  return request({
    url: '/api/Admin/Role/GetByPage',
    method: 'get',
    params
  })
}

export function addRole(data) {
  return request({
    url: '/api/Admin/Role/Add',
    method: 'post',
    data
  })
}

export function updateRole(data) {
  return request({
    url: '/api/Admin/Role/Update',
    method: 'post',
    data
  })
}

export function activeRole(id, data) {
  return request({
    url: `/api/Admin/Role/Active/${id}`,
    method: 'post',
    data
  })
}

export function deleteRole(id) {
  return request({
    url: `/api/Admin/Role/Delete/${id}`,
    method: 'delete'
  })
}

export function batchDeleteRoles(ids) {
  return request({
    url: '/api/Admin/Role/BatchDelete',
    method: 'delete',
    data: ids
  })
}

export function getRoleById(id) {
  return request({
    url: `/api/Admin/Role/GetById/${id}`,
    method: 'get'
  })
}

export function rolePermission(data) {
  return request({
    url: '/api/Admin/Role/RolePermission',
    method: 'post',
    data
  })
}
