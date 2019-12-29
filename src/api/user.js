import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

// 获取所有用户信息
export function getAllUsers(params) {
  return request({
    baseURL: process.env.VUE_APP_BASE_API2,
    url: '/user/',
    method: 'get',
    params
  })
}

// 修改用户信息
export function updateUser(params) {
  return request({
    baseURL: process.env.VUE_APP_BASE_API2,
    url: '/user/fd/update',
    method: 'put',
    data: params
  })
}

// 根据审核状态返回用户
export function getAuditUsers(params) {
  return request({
    baseURL: process.env.VUE_APP_BASE_API2,
    url: '/user/status',
    method: 'get',
    params
  })
}
