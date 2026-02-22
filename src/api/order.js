import request from '@/utils/request'

export function getOrders(query) {
  return request({
    url: '/api/Admin/Order/GetByPage',
    method: 'get',
    params: query
  })
}

export function getOrderById(id) {
  return request({
    url: `/api/Admin/Order/GetById/${id}`,
    method: 'get'
  })
}

export function createOrder(data) {
  return request({
    url: '/api/Admin/Order/Add',
    method: 'post',
    data
  })
}

// 注意：根据API文档，订单没有通用的更新接口，只能通过特定状态变更接口进行修改
// 如需更新订单，请使用相应的状态变更接口

export function deleteOrder(id) {
  return request({
    url: `/api/Admin/Order/Delete/${id}`,
    method: 'delete'
  })
}

export function setOrderAsPaid(id, data) {
  return request({
    url: `/api/Admin/Order/SetAsPaid/${id}`,
    method: 'post',
    data
  })
}

export function setOrderAsCompleted(id, data) {
  return request({
    url: `/api/Admin/Order/SetAsComplited/${id}`,
    method: 'post',
    data
  })
}

export function setOrderAsCanceled(id, data) {
  return request({
    url: `/api/Admin/Order/SetAsCanceled/${id}`,
    method: 'post',
    data
  })
}

export function setOrderAsRefund(id, data) {
  return request({
    url: `/api/Admin/Order/SetAsRefund/${id}`,
    method: 'post',
    data
  })
}

export function changeDiscountedAmount(id, data) {
  return request({
    url: `/api/Admin/Order/ChangeDiscountedAmount/${id}`,
    method: 'post',
    data
  })
}
