import request from '@/utils/request'

export function getPackages(params) {
  return request({
    url: '/api/Package/GetByPage',
    method: 'get',
    params
  })
}

export function getPackageById(id) {
  return request({
    url: `/api/Package/GetById/${id}`,
    method: 'get'
  })
}

export function addPackage(data) {
  return request({
    url: '/api/Package/Add',
    method: 'post',
    data
  })
}

export function updatePackage(data) {
  return request({
    url: '/api/Package/Update',
    method: 'post',
    data
  })
}

export function activePackage(id, data) {
  return request({
    url: `/api/Package/Active/${id}`,
    method: 'post',
    data
  })
}

export function deletePackage(id) {
  return request({
    url: `/api/Package/Delete/${id}`,
    method: 'delete'
  })
}
