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
    baseURL: process.env.VUE_APP_BASE_API2,
    url: '/authorize/info',
    method: 'post',
    data: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

// 普通用户登录
export function userLogin(params) {
  return request({
    baseURL: process.env.VUE_APP_BASE_API2,
    url: '/authorize/login/username',
    method: 'post',
    data: params
  })
}

// 管理员登录
export function masterLogin(params) {
  return request({
    baseURL: process.env.VUE_APP_BASE_API2,
    url: '/authorize/login/masterName',
    method: 'post',
    data: params
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

// 用户注册
export function userRegister(data) {
  return request({
    baseURL: process.env.VUE_APP_BASE_API2,
    url: '/user/register',
    method: 'post',
    data
  })
}
