import request from '@/utils/request' // 加载请求配置文件
import { baseDirWebUiTest } from '@/apis/base'

const currentBaseDir = baseDirWebUiTest + '/element'
export const uploadElementDir = currentBaseDir + '/upload'

function Func(method, data = null, params = null) {
  return request({ url: currentBaseDir, method: method, data: data, params: params })
}

// 添加元素信息
export function postElement(data) {
  return Func('post', data)
}

// 修改元素信息
export function putElement(data) {
  return Func('put', data)
}

// 删除元素信息
export function deleteElement(data) {
  return Func('delete', data)
}

// 获取元素信息
export function getElement(data) {
  return request({ url: currentBaseDir + '/detail', method: 'post', data: data })
}

// 指定页面下元素list
export function changeElementById(data) {
  return request({ url: currentBaseDir + '/change', method: 'put', data: data })
}

// 指定页面下元素list
export function elementList(data) {
  return request({ url: currentBaseDir + '/list', method: 'post', data: data || {}})
}

// 修改元素排序
export function elementSort(data) {
  return request({ url: currentBaseDir + '/sort', method: 'put', data: data })
}

// 查询元素归属
export function elementFrom(data) {
  return request({ url: currentBaseDir + '/from', method: 'post', data: data })
}

// 导入元素
export function uploadElement(data) {
  return request({ url: currentBaseDir + '/upload', method: 'post', data: data })
}

// 下载导入元素模板
export function downloadElementTemplate() {
  return request({ url: currentBaseDir + '/template', method: 'post', responseType: 'blob' })
}
