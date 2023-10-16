import request from '@/utils/request'
import { baseDirConfig } from '@/apis/base' // 加载请求配置类型文件

const currentBaseDir = baseDirConfig + '/type'

function Func(method, data = null, params = null) {
  return request({ url: currentBaseDir, method: method, data: data, params: params })
}

// 添加配置类型
export function postConfigType(data) {
  return Func('post', data)
}

// 查找配置类型
export function getConfigType(data) {
  return Func('post', data)
}

// 修改配置类型
export function putConfigType(data) {
  return Func('put', data)
}

// 删除配置类型
export function deleteConfigType(data) {
  return Func('delete', data)
}

// 获取配置类型list
export function configTypeList(data) {
  return request({ url: currentBaseDir + '/list', method: 'post', data: data || {}})
}
