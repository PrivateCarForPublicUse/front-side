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

