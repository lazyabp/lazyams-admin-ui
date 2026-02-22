import request from '@/utils/request'

export function getCarousels(params) {
  return request({
    url: '/api/Carousel/GetByPage',
    method: 'get',
    params
  })
}

export function getCarousel(id) {
  return request({
    url: `/api/Carousel/GetById/${id}`,
    method: 'get'
  })
}

export function addCarousel(data) {
  return request({
    url: '/api/Admin/Carousel/Add',
    method: 'get', // Swagger says GET, but this should likely be POST
    data
  })
}

export function updateCarousel(data) {
  return request({
    url: '/api/Admin/Carousel/Update',
    method: 'post',
    data
  })
}

export function deleteCarousel(id) {
  return request({
    url: `/api/Admin/Carousel/Delete/${id}`,
    method: 'delete'
  })
}
