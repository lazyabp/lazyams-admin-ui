import request from '@/utils/request'

export function getPackageFeatures(params) {
  return request({
    url: '/api/Admin/Package/Feature/GetByPage',
    method: 'get',
    params
  })
}

export function getPackageFeaturesByPackageId(packageId) {
  return request({
    url: `/api/Admin/Package/Feature/GetByPackageId/${packageId}`,
    method: 'get'
  })
}

export function getPackageFeaturesById(id) {
  return request({
    url: `/api/Admin/Package/Feature/GetById/${id}`,
    method: 'get'
  })
}

export function addPackageFeature(data) {
  return request({
    url: '/api/Admin/Package/Feature/Add',
    method: 'post',
    data
  })
}

export function updatePackageFeature(data) {
  return request({
    url: '/api/Admin/Package/Feature/Update',
    method: 'post',
    data
  })
}

export function deletePackageFeature(id) {
  return request({
    url: `/api/Admin/Package/Feature/Delete/${id}`,
    method: 'delete'
  })
}

export function batchAddPackageFeatures(packageId, data) {
  return request({
    url: `/api/Admin/Package/Feature/BatchAdd/${packageId}`,
    method: 'post',
    data
  })
}

export function batchDeletePackageFeatures(ids) {
  return request({
    url: '/api/Admin/Package/Feature/BatchDelete',
    method: 'post',
    data: ids
  })
}
