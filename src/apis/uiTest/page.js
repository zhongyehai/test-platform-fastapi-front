import request from '@/utils/request' // 加载请求配置文件
import { baseDirWebUiTest } from '@/apis/base'

const currentBaseDir = baseDirWebUiTest + '/page'

function Func(method, data = null, params = null) {
  return request({ url: currentBaseDir, method: method, data: data, params: params })
}

// 添加页面信息
export function postPage(data) {
  return Func('post', data)
}

// 修改页面信息
export function putPage(data) {
  return Func('put', data)
}

// 删除页面信息
export function deletePage(data) {
  return Func('delete', data)
}

// 获取页面信息
export function getPage(data) {
  return request({ url: currentBaseDir + '/detail', method: 'post', data: data })
}

// 复制页面
export function copyPage(data) {
  return request({ url: currentBaseDir + '/copy', method: 'post', data: data })
}

// 指定模块下页面list
export function pageList(data) {
  return request({ url: currentBaseDir + '/list', method: 'post', data: data || {}})
}

// 修改页面排序
export function pageSort(data) {
  return request({ url: currentBaseDir + '/sort', method: 'put', data: data })
}
