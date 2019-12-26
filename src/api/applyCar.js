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
    data: params,
    headers: {
      'Cookie': 'token=6eee6376-e88d-4aa8-840f-bb6dd53031c2'
    }
  })
}
