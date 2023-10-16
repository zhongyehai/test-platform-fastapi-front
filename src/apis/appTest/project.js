import request from '@/utils/request' // 加载请求配置文件
import { baseDirAppUiTest } from '@/apis/base'

const currentBaseDir = baseDirAppUiTest + '/project'
const currentEnvBaseDir = baseDirAppUiTest + '/project/env'

function Func(method, data = null, params = null) {
  return request({ url: currentBaseDir, method: method, data: data, params: params })
}

// 添加APP
export function postProject(data) {
  return Func('post', data)
}

// 修改APP
export function putProject(data) {
  return Func('put', data)
}

// 删除APP
export function deleteProject(data) {
  return Func('delete', data)
}

// 获取APP
export function getProject(data) {
  return request({ url: currentBaseDir + '/detail', method: 'post', data: data })
}

// 获取APP列表
export function projectList(data) {
  return request({ url: currentBaseDir + '/list', method: 'post', data: data || {}})
}

// 修改APP排序
export function projectSort(data) {
  return request({ url: currentBaseDir + '/sort', method: 'put', data: data })
}

// 获取APP的环境信息
export function getProjectEnv(data) {
  return request({ url: currentEnvBaseDir, method: 'post', data: data })
}

// 修改改APP的环境信息
export function putProjectEnv(data) {
  return request({ url: currentEnvBaseDir, method: 'put', data: data })
}

// 新增APP的环境信息
export function postProjectEnv(data) {
  return request({ url: currentEnvBaseDir, method: 'post', data: data })
}

// 同步APP的环境信息
export function projectEnvSynchronization(data) {
  return request({ url: currentEnvBaseDir + '/synchronization', method: 'put', data: data })
}
