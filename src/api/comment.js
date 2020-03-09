import request from '@/utils/request'
// 提交评价接口
export function submitComment(data) {
  return request({
    url: '/carRate/add-rate',
    method: 'post',
    baseURL: process.env.VUE_APP_BASE_API2,
    data
  })
}
// 获取车辆的评价
export function getCarRate(id) {
  return request({
    url: '/carRate/carId/' + id,
    method: 'GET',
    baseURL: process.env.VUE_APP_BASE_API2
  })
}
// 提交对用户的评价
export function submitUserComment(data) {
  return request({
    url: '/userRate/add-user',
    method: 'post',
    baseURL: process.env.VUE_APP_BASE_API2,
    data
  })
}
// 获取对用户的评价
export function getUserRate(id) {
  return request({
    url: '/userRate/evaluateeId2/' + id,
    method: 'GET',
    baseURL: process.env.VUE_APP_BASE_API2
  })
}
