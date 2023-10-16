import request from '@/utils/request'
import { baseDirApiTest } from '@/apis/base'

const currentBaseDir = baseDirApiTest + '/task'

function Func(method, data = null, params = null) {
  return request({ url: currentBaseDir, method: method, data: data, params: params })
}

// 添加任务信息
export function postTask(data) {
  return Func('post', data)
}

// 修改任务信息
export function putTask(data) {
  return Func('put', data)
}

// 删除任务信息
export function deleteTask(data) {
  return Func('delete', data)
}

// 获取任务信息
export function getTask(data) {
  return request({ url: currentBaseDir + '/detail', method: 'post', data: data })
}

// 任务列表
export function taskList(data) {
  return request({ url: currentBaseDir + '/list', method: 'post', data: data || {}})
}

// 启用任务
export function enableTask(data) {
  return request({ url: currentBaseDir + '/enable', method: 'put', data: data })
}

// 禁用任务
export function disableTask(data) {
  return request({ url: currentBaseDir + '/disable', method: 'put', data: data })
}

// 单次运行定时任务
export function runTask(data) {
  return request({ url: currentBaseDir + '/run', method: 'post', data: data })
}

// 复制定时任务
export function copyTask(data) {
  return request({ url: currentBaseDir + '/copy', method: 'post', data: data })
}

// 修改定时任务排序
export function taskSort(data) {
  return request({ url: currentBaseDir + '/sort', method: 'put', data: data })
}
