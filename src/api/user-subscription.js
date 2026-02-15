import request from '@/utils/request'

export function getUserSubscriptions(params) {
  return request({
    url: '/api/UserSubscription/GetByPage',
    method: 'get',
    params
  })
}

export function getUserSubscriptionById(id) {
  return request({
    url: `/api/UserSubscription/GetById/${id}`,
    method: 'get'
  })
}

export function addUserSubscription(data) {
  return request({
    url: '/api/UserSubscription/Add',
    method: 'post',
    data
  })
}

export function updateUserSubscription(data) {
  return request({
    url: '/api/UserSubscription/Update',
    method: 'post',
    data
  })
}

export function setUserSubscriptionExpired(id) {
  return request({
    url: `/api/UserSubscription/SetAsExpired/${id}`,
    method: 'post'
  })
}

export function setUserSubscriptionFreezed(id) {
  return request({
    url: `/api/UserSubscription/SetAsFreezed/${id}`,
    method: 'post'
  })
}

export function setUserSubscriptionActive(id) {
  return request({
    url: `/api/UserSubscription/SetAsActive/${id}`,
    method: 'post'
  })
}

export function deleteUserSubscription(id) {
  return request({
    url: `/api/UserSubscription/Delete/${id}`,
    method: 'delete'
  })
}

// 虽然Swagger中没有直接的创建用户订阅API，但我们可以通过创建订单来生成订阅
export function createOrderForSubscription(data) {
  return request({
    url: '/api/Order/Add',
    method: 'post',
    data
  })
}
