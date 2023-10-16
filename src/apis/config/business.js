import request from '@/utils/request'
import { baseDirConfig } from '@/apis/base' // 加载请求业务线文件

const currentBaseDir = baseDirConfig + '/business'

function Func(method, data = null, params = null) {
  return request({ url: currentBaseDir, method: method, data: data, params: params })
}

// 添加业务线
export function postBusiness(data) {
  return Func('post', data)
}

// 修改业务线
export function putBusiness(data) {
  return Func('put', data)
}

// 删除业务线
export function deleteBusiness(data) {
  return Func('delete', data)
}

// 获取业务线
export function businessDetail(data) {
  return request({ url: currentBaseDir + '/detail', method: 'post', data: data })
}

// 获取业务线list
export function businessList(data) {
  return request({ url: currentBaseDir + '/list', method: 'post', data: data || {}})
}

// 批量修业务线与用户的绑定关系
export function businessToUser(data) {
  return request({ url: currentBaseDir + '/user', method: 'put', data: data })
}
