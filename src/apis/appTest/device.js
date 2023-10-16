import request from '@/utils/request'
import { baseDirAppUiTest } from '@/apis/base'

const serverBaseDir = baseDirAppUiTest + '/device/server'
const phoneBaseDir = baseDirAppUiTest + '/device/phone'

function serverFunc(method, data = null, params = null) {
  return request({ url: serverBaseDir, method: method, data: data, params: params })
}

// 添加
export function postServer(data) {
  return serverFunc('post', data)
}

// 修改
export function putServer(data) {
  return serverFunc('put', data)
}

// 删除
export function deleteServer(data) {
  return serverFunc('delete', data)
}

// 获取运行服务器
export function getServer(data) {
  return request({ url: serverBaseDir + '/detail', method: 'post', data: data })
}

// 列表
export function serverList(data) {
  return request({ url: serverBaseDir + '/list', method: 'post', data: data || {}})
}

// 复制
export function copyServer(data) {
  return request({ url: serverBaseDir + '/copy', method: 'post', data: data })
}

// 修改排序
export function sortServer(data) {
  return request({ url: serverBaseDir + '/sort', method: 'put', data: data })
}

// 修改排序
export function runEnvServer(data) {
  return request({ url: serverBaseDir + '/run', method: 'post', data: data })
}

function phoneFunc(method, data = null, params = null) {
  return request({ url: phoneBaseDir, method: method, data: data, params: params })
}

// 添加
export function postPhone(data) {
  return phoneFunc('post', data)
}

// 修改
export function putPhone(data) {
  return phoneFunc('put', data)
}

// 删除
export function deletePhone(data) {
  return phoneFunc('delete', data)
}

// 获取执行终端
export function getPhone(data) {
  return request({ url: phoneBaseDir + '/detail', method: 'post', data: data })
}

// 列表
export function phoneList(data) {
  return request({ url: phoneBaseDir + '/list', method: 'post', data: data || {}})
}

// 复制
export function copyPhone(data) {
  return request({ url: phoneBaseDir + '/copy', method: 'post', data: data })
}

// 修改排序
export function sortPhone(data) {
  return request({ url: phoneBaseDir + '/sort', method: 'put', data: data })
}
