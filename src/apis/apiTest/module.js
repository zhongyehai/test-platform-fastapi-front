import request from '@/utils/request' // 加载请求配置文件
import { baseDirApiTest } from '@/apis/base'

const currentBaseDir = baseDirApiTest + '/module'

function Func(method, data = null, params = null) {
  return request({ url: currentBaseDir, method: method, data: data, params: params })
}

// 添加模块
export function postModule(data) {
  return Func('post', data)
}

// 修改模块
export function putModule(data) {
  return Func('put', data)
}

// 删除模块
export function deleteModule(data) {
  return Func('delete', data)
}

// 查找模块
export function getModule(data) {
  return request({ url: currentBaseDir + '/detail', method: 'post', data: data })
}

// 获取模块树
export function moduleTree(data) {
  return request({ url: currentBaseDir + '/tree', method: 'post', data: data })
}

// 获取模块list
export function moduleList(data) {
  return request({ url: currentBaseDir + '/list', method: 'post', data: data || {}})
}
