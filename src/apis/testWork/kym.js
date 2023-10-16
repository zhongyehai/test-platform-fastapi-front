import request from '@/utils/request'
import { baseDirTestWork } from '@/apis/base' // 加载请求配置文件

const currentBaseDir = baseDirTestWork + '/kym'

// 添加kym
export function addKYM(data) {
  return request({ url: currentBaseDir + '/project', method: 'post', data: data })
}

// 获取kym服务列表
export function KYMProjectList(data) {
  return request({ url: currentBaseDir + '/project/list', method: 'post', data: data || {}})
}

// kym导出为xmind
export function getKymAsXmind(data) {
  return request({ url: currentBaseDir + '/download', method: 'post', data: data, responseType: 'blob' })
}

// 获取服务的kym
export function getProjectKYM(data) {
  return request({ url: currentBaseDir, method: 'post', data: data })
}

// 修改服务的kym
export function putProjectKYM(data) {
  return request({ url: currentBaseDir, method: 'put', data: data })
}

