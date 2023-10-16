import request from '@/utils/request' // 加载请求配置文件
import { baseDirAssist } from '@/apis/base'

// 同步swagger的信息
export function swaggerPull(data) {
  return request({ url: baseDirAssist + '/swagger/pull', method: 'post', data: data })
}

// 获取swagger拉取记录
export function swaggerPullList(data) {
  return request({ url: baseDirAssist + '/swagger/pull/list', method: 'post', data: data || {}})
}
