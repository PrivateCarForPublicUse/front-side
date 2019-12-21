// 车辆相关api
import request from '@/utils/request.js'
// 获取我的车辆的信息
// 当前是获取所有车辆信息，目前还不能区分“我的”，需要获取当前登录用户的id
export function getMyCarInfo(params) {
  return request({
    url: '/car/',
    method: 'GET',
    baseURL: process.env.VUE_APP_BASE_API2,
    params
  })
}
