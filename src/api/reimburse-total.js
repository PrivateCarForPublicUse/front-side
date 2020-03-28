import request from '@/utils/request'
// 总报销量
export function getTotalReimburse(params) {
  return request({
    baseURL: process.env.VUE_APP_BASE_API2,
    url: '/reimburse/ReimburseStatics',
    method: 'get',
    params
  })
}

export function getReimburseById(id) {
  return request({
    baseURL: process.env.VUE_APP_BASE_API2,
    url: '/reimburse/ReimburseStatics-person/' + id,
    method: 'get'
  })
}

// 星级
export function getTotulPerson(params) {
  return request({
    baseURL: process.env.VUE_APP_BASE_API2,
    url: '/Master/findUser',
    method: 'get',
    params
  })
}

// 星级
export function getTotulCar(params) {
  return request({
    baseURL: process.env.VUE_APP_BASE_API2,
    url: '/car/fd',
    method: 'get',
    params
  })
}

// 0私车 1公车
export function getPriveateCar(params) {
  return request({
    baseURL: process.env.VUE_APP_BASE_API2,
    url: 'Master/isPublic',
    method: 'get',
    params: { isPublic: params }
  })
}

// 报销金额 降序
export function getMoneyDec(params) {
  return request({
    baseURL: process.env.VUE_APP_BASE_API2,
    url: '/reimburse/findUserIdAndSumPrice',
    method: 'get',
    params
  })
}
// 报销次数 降序
export function getTimeDec(params) {
  return request({
    baseURL: process.env.VUE_APP_BASE_API2,
    url: '/reimburse/findUserIdAndSumTimes',
    method: 'get',
    params
  })
}

// 员工基本信息
export function getUserInfo(id) {
  return request({
    baseURL: process.env.VUE_APP_BASE_API2,
    url: '/user/' + id,
    method: 'get'
  })
}

// 员工车辆列表
export function getCarInfo(id) {
  return request({
    baseURL: process.env.VUE_APP_BASE_API2,
    url: '/car/getUserCars/' + id,
    method: 'get'
  })
}
