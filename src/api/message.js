// 获取相应的message表的信息
import request from '@/utils/request'

export function getMessageInfo(params) {
  return request({
    baseURL: process.env.VUE_APP_BASE_API2,
    url: '/message/table-id',
    method: 'get',
    params
  })
}
