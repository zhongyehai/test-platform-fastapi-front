import request from '@/utils/request'
import { baseDirAssist } from '@/apis/base' // 加载请求配置文件

// 自动化测试用户数据
export function getAutoTestUser(data) {
  return request({ url: baseDirAssist + '/autoTestUser', method: 'post', data: data })
}

// 数据池列表
export function dataPoolList(data) {
  return request({ url: baseDirAssist + '/dataPool/list', method: 'post', data: data || {}})
}

// 获取数据池数据
export function dataPool(data) {
  return request({ url: baseDirAssist + '/dataPool', method: 'post', data: data })
}

// 新增数据池数据
export function postDataPool(data) {
  return request({ url: baseDirAssist + '/dataPool', method: 'post', data: data })
}

// 修改数据池数据
export function putDataPool(data) {
  return request({ url: baseDirAssist + '/dataPool', method: 'put', data: data })
}

// 删除数据池数据
export function deleteDataPool(data) {
  return request({ url: baseDirAssist + '/dataPool', method: 'delete', data: data })
}

// 获取数据池业务状态
export function dataPoolUseStatus(data) {
  return request({ url: baseDirAssist + '/dataPool/useStatus', method: 'post', data: data })
}

// 获取数据池业务状态
export function dataPoolBusinessStatus(data) {
  return request({ url: baseDirAssist + '/dataPool/businessStatus', method: 'post', data: data })
}
