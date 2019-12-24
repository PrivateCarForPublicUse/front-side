import request from '@/utils/request'

export function getAllRoutes() {
  return request({
    method: 'GET',
    baseURL: process.env.VUE_APP_BASE_API2,
    url: '/Route/'
  })
}

export function updateRoute(data) {
  return request({
    method: 'post',
    baseURL: process.env.VUE_APP_BASE_API2,
    url: '/Route/update',
    data
  })
}
