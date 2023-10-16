import request from '@/utils/request' // 加载请求配置文件
import { baseDirSystem } from '@/apis/base'

// 获取错误列表
export function errorRecordList(data) {
  return request({ url: baseDirSystem + '/errorRecord/list', method: 'post', data: data || {}})
}
