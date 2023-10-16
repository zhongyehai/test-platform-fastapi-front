import request from '@/utils/request' // 加载请求配置文件
import { baseDirAppUiTest } from '@/apis/base'

const stepDir = baseDirAppUiTest + '/step'

function Func(method, data = null, params = null) {
  return request({ url: stepDir, method: method, data: data, params: params })
}

// 添加步骤
export function postStep(data) {
  return Func('post', data)
}

// 修改步骤
export function putStep(data) {
  return Func('put', data)
}

// 删除步骤
export function deleteStep(data) {
  return Func('delete', data)
}

// 获取步骤数据
export function getStep(data) {
  return request({ url: stepDir + '/detail', method: 'post', data: data })
}

// 修改步骤状态
export function putStepIsRun(data) {
  return request({ url: stepDir + '/status', method: 'put', data: data })
}

// 获取步骤list
export function stepList(data) {
  return request({ url: stepDir + '/list', method: 'post', data: data || {}})
}

// 修改步骤排序
export function stepSort(data) {
  return request({ url: stepDir + '/sort', method: 'put', data: data })
}

// 复制步骤
export function stepCopy(data) {
  return request({ url: stepDir + '/copy', method: 'post', data: data })
}
