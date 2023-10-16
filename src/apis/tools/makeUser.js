import request from '@/utils/request'
import { baseDirTool } from '@/apis/base' // 加载请求配置文件

// 生成用户信息
export function makeUser(data) {
  return request({ url: baseDirTool + '/makeUser', method: 'post', data: data })
}

// 导出为通讯录文件
export function exportAsContact(data) {
  return request({ url: baseDirTool + '/makeUser/contact/download', method: 'post', data: data, responseType: 'blob' })
}
