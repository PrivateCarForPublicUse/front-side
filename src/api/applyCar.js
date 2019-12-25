import request from '@/utils/request'

export function applyCar(params) {
  return request({
    method: 'post',
    baseURL: process.env.VUE_APP_BASE_API2,
    url: '/route/applyCar',
    data: params
  })
}

export function getCarByTime(params) {
  return request({
    method: 'post',
    baseURL: process.env.VUE_APP_BASE_API2,
    url: '/car/getCarByTime',
    data: params
  })
}
