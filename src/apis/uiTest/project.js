import request from '@/utils/request' // 加载请求配置文件
import { baseDirWebUiTest } from '@/apis/base'

const currentBaseDir = baseDirWebUiTest + '/project'
const currentEnvBaseDir = baseDirWebUiTest + '/project/env'

function Func(method, data = null, params = null) {
  return request({ url: currentBaseDir, method: method, data: data, params: params })
}

// 添加服务
export function postProject(data) {
  return Func('post', data)
}

// 修改服务
export function putProject(data) {
  return Func('put', data)
}

// 删除服务
export function deleteProject(data) {
  return Func('delete', data)
}

// 获取服务
export function getProject(data) {
  return request({ url: currentBaseDir + '/detail', method: 'post', data: data })
}

// 获取服务列表
export function projectList(data) {
  return request({ url: currentBaseDir + '/list', method: 'post', data: data || {}})
}

// 修改服务排序
export function projectSort(data) {
  return request({ url: currentBaseDir + '/sort', method: 'put', data: data })
}

// 获取服务的环境信息
export function getProjectEnv(data) {
  return request({ url: currentEnvBaseDir, method: 'post', data: data })
}

// 修改改服务的环境信息
export function putProjectEnv(data) {
  return request({ url: currentEnvBaseDir, method: 'put', data: data })
}

// 新增服务的环境信息
export function postProjectEnv(data) {
  return request({ url: currentEnvBaseDir, method: 'post', data: data })
}

// 同步服务的环境信息
export function projectEnvSynchronization(data) {
  return request({ url: currentEnvBaseDir + '/synchronization', method: 'put', data: data })
}
