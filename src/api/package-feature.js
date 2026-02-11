import request from '@/utils/request'

export function getPackageFeatures(params) {
  return request({
    url: '/api/PackageFeature/GetByPage',
    method: 'get',
    params
  })
}

export function getPackageFeaturesByPackageId(packageId) {
  return request({
    url: `/api/PackageFeature/GetByPackageId/${packageId}`,
    method: 'get'
  })
}

export function addPackageFeature(data) {
  return request({
    url: '/api/PackageFeature/Add',
    method: 'post',
    data
  })
}

export function updatePackageFeature(data) {
  return request({
    url: '/api/PackageFeature/Update',
    method: 'post',
    data
  })
}

export function deletePackageFeature(id) {
  return request({
    url: `/api/PackageFeature/Delete/${id}`,
    method: 'delete'
  })
}

export function batchAddPackageFeatures(packageId, data) {
  return request({
    url: `/api/PackageFeature/BatchAdd/${packageId}`,
    method: 'post',
    data
  })
}

export function batchDeletePackageFeatures(ids) {
  return request({
    url: '/api/PackageFeature/BatchDelete',
    method: 'post',
    data: ids
  })
}
