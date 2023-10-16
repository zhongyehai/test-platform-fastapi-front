import request from '@/utils/request'
import { baseDirSystem } from '@/apis/base'

const currentBaseDir = baseDirSystem + '/role'

function Func(method, data = null, params = null) {
  return request({ url: currentBaseDir, method: method, data: data, params: params })
}

// 权限列表
export function roleList(data) {
  return request({ url: currentBaseDir + '/list', method: 'post', data: data || {}})
}

// 获取权限信息
export function getRole(data) {
  return request({ url: currentBaseDir + '/detail', method: 'post', data: data })
}

// 新增权限
export function postRole(data) {
  return Func('post', data)
}

// 修改权限
export function putRole(data) {
  return Func('put', data)
}

// 删除权限
export function deleteRole(data) {
  return Func('delete', data)
}

