import request from '@/utils/request'

export function getUserSubscriptions(params) {
  return request({
    url: '/api/Admin/UserSubscription/GetByPage',
    method: 'get',
    params
  })
}

export function getUserSubscriptionById(id) {
  return request({
    url: `/api/Admin/UserSubscription/GetById/${id}`,
    method: 'get'
  })
}

export function addUserSubscription(data) {
  return request({
    url: '/api/Admin/UserSubscription/Add',
    method: 'post',
    data
  })
}

export function updateUserSubscription(data) {
  return request({
    url: '/api/Admin/UserSubscription/Update',
    method: 'post',
    data
  })
}

export function setUserSubscriptionExpired(id) {
  return request({
    url: `/api/Admin/UserSubscription/SetAsExpired/${id}`,
    method: 'post'
  })
}

export function setUserSubscriptionFreezed(id) {
  return request({
    url: `/api/Admin/UserSubscription/SetAsFreezed/${id}`,
    method: 'post'
  })
}

export function setUserSubscriptionActive(id) {
  return request({
    url: `/api/Admin/UserSubscription/SetAsActive/${id}`,
    method: 'post'
  })
}

export function deleteUserSubscription(id) {
  return request({
    url: `/api/Admin/UserSubscription/Delete/${id}`,
    method: 'delete'
  })
}
