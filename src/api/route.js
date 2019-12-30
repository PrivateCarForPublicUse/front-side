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

// 报销状态（-1 报销失败；0 未报销；1 已报销；2 审核中）
// 审核状态（-1 审核不通过；0 未审核；1 审核通过；2 行程中；3 已完成；4 已取消）
// 根据审核状态返回 行程
export function getAuditRoutes(params) {
  return request({
    baseURL: process.env.VUE_APP_BASE_API2,
    url: '/Route/by-status',
    method: 'get',
    params
  })
}
// 根据审核状态和报销状态返回行程
export function getReimburseRoutes(params) {
  return request({
    baseURL: process.env.VUE_APP_BASE_API2,
    url: '/Route/status-isreimburse',
    method: 'get',
    params
  })
}
