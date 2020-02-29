import request from '@/utils/request'

// 获取所有管理员信息
export function getAllMasters(params) {
  return request({
    baseURL: process.env.VUE_APP_BASE_API2,
    url: '/Master/',
    method: 'get',
    params
  })
}

// 修改管理员信息
export function updateMaster(params) {
  return request({
    baseURL: process.env.VUE_APP_BASE_API2,
    url: '/Master/update',
    method: 'post',
    data: params
  })
}

export function getToReviewNum() {
  return request({
    baseURL: process.env.VUE_APP_BASE_API2,
    url: '/Master/to-review-num',
    method: 'get'
  })
}
