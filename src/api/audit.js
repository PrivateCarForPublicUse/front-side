import request from '@/utils/request.js'
// 根据审核状态返回用户
export function getAuditUsers(params) {
  return request({
    baseURL: process.env.VUE_APP_BASE_API2,
    url: '/user/status',
    method: 'get',
    params
  })
}
// 根据审核状态返回车辆
export function getAuditCars(params) {
  return request({
    baseURL: process.env.VUE_APP_BASE_API2,
    url: '/car/isUse/' + params,
    method: 'get'
  })
}
// 根据审核状态返回 行程
export function getAuditRoutes(params) {
  return request({
    baseURL: process.env.VUE_APP_BASE_API2,
    url: '/Route/status',
    method: 'get',
    params
  })
}
// 根据报销状态返回行程
export function getReimburseRoutes(params) {
  
}
