import request from '@/utils/request'
import { baseDirSystem } from '@/apis/base'

const baseDir = baseDirSystem + '/job'

function Func(method, data = null, params = null) {
  return request({ url: baseDir, method: method, data: data, params: params })
}

// 任务方法列表
export function jobFuncList(data) {
  return request({ url: baseDir + '/func/list', method: 'post', data: data || {}})
}

// 任务列表
export function jobList(data) {
  return request({ url: baseDir + '/list', method: 'post', data: data || {}})
}

// 执行任务
export function jobRun(data) {
  return request({ url: baseDir + '/run', method: 'post', data: data })
}

// 执行任务记录
export function jobRunLog(data) {
  return request({ url: baseDir + '/log', method: 'post', data: data })
}

// 获取任务信息
export function getJob(data) {
  return request({ url: baseDir + '/detail', method: 'post', data: data })
}

// 新增任务
export function postJob(data) {
  return Func('post', data)
}

// 删除任务
export function deleteJob(data) {
  return Func('delete', data)
}
