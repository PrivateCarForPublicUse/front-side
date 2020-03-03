import request from '@/utils/request'

export function getAllCompanies() {
  return request({
    baseURL: process.env.VUE_APP_BASE_API2,
    url: '/company/all',
    method: 'get'
  })
}

// 下载文件
export function downloadFile(url) {
  return request({
    baseURL: process.env.VUE_APP_BASE_API2,
    url: 'ensure/download',
    method: 'get',
    params: { 'url': url }
  })
}
