import request from '@/utils/request'

export function getReimbursermentList() {
  return request({
    method: 'post',
    baseURL: process.env.VUE_APP_BASE_API2,
    url: '/route/reimbursermentList'
  })
}
