import request from '@/utils/request'

export function getInfo(username) {
  return request({
    url: `/api/User/Get/${username}`,
    method: 'get'
  })
}

export function getUsers(params) {
  return request({
    url: '/api/User/GetByPage',
    method: 'get',
    params
  })
}

export function addUser(data) {
  return request({
    url: '/api/User/Add',
    method: 'post',
    data
  })
}

export function updateUser(data) {
  return request({
    url: '/api/User/Update',
    method: 'post',
    data
  })
}

export function deleteUser(id) {
  return request({
    url: `/api/User/Delete/${id}`,
    method: 'delete'
  })
}

export function getUserById(id) {
  return request({
    url: `/api/User/GetUserById/${id}`,
    method: 'get'
  })
}
