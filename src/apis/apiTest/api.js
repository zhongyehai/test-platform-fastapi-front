import request from '@/utils/request' // 加载请求配置文件
import { baseDirApiTest } from '@/apis/base'

const currentBaseDir = baseDirApiTest + '/api'
export const uploadApiMsg = currentBaseDir + 'upload'

function Func(method, data = null, params = null) {
  return request({ url: currentBaseDir, method: method, data: data, params: params })
}

// 添加接口信息
export function postApi(data) {
  return Func('post', data)
}

// 修改接口信息
export function putApi(data) {
  return Func('put', data)
}

// 删除api信息
export function deleteApi(data) {
  return Func('delete', data)
}

// 获取api信息
export function getApi(data) {
  return request({ url: currentBaseDir + '/detail', method: 'post', data: data })
}

// 导入接口
export function uploadApi(data) {
  return request({ url: currentBaseDir + '/upload', method: 'post', data: data })
}

// 下载导入接口模板
export function downloadApiMsgTemplate() {
  return request({ url: currentBaseDir + '/template/download', method: 'post', responseType: 'blob' })
}

// 指定模块下接口list
export function apiList(data) {
  return request({ url: currentBaseDir + '/list', method: 'post', data: data || {}})
}

// 接口调试
export function runApi(data) {
  return request({ url: currentBaseDir + '/run', method: 'post', data: data })
}

// 获取请求方式
export function getMethodsMapping() {
  return request({ url: currentBaseDir + '/methods', method: 'post' })
}

// 获取断言类型
export function getAssertMapping() {
  return request({ url: currentBaseDir + '/assertMapping', method: 'get' })
}

// 修改接口排序
export function apiMsgSort(data) {
  return request({ url: currentBaseDir + '/sort', method: 'put', data: data })
}

// 查询接口归属
export function apiMsgBelongTo(data) {
  return request({ url: currentBaseDir + '/from', method: 'post', data: data })
}

// 查询使用接口转为步骤后的归属
export function apiMsgBelongToStep(data) {
  return request({ url: currentBaseDir + '/use', method: 'post', data: data })
}

// 修改接口重要程度
export function changeApiLevel(data) {
  return request({ url: currentBaseDir + '/level', method: 'put', data: data })
}

// 修改接口废弃状态
export function changeApiStatus(data) {
  return request({ url: currentBaseDir + '/status', method: 'put', data: data })
}

