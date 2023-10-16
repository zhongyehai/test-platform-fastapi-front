import request from '@/utils/request'
import { baseDirAssist } from '@/apis/base' // 加载请求配置文件

const currentBaseDir = baseDirAssist + '/file'

export const uploadApi = currentBaseDir

export const uploadAddr = currentBaseDir + '/upload'

// 上传文件
export function fileUpload(data) {
  return request({ url: uploadAddr, method: 'post', data: data })
}

// 文件列表
export function fileList(data) {
  return request({ url: currentBaseDir + '/list', method: 'post', data: data || {}})
}

// 下载文件
export function fileDownload(data) {
  return request({ url: currentBaseDir + '/download', method: 'post', data: data, responseType: 'blob' })
}

// 校验文件是否已存在
export function fileCheck(data) {
  return request({ url: currentBaseDir + '/check', method: 'post', data: data })
}

function Func(method, data = null) {
  return request({ url: uploadApi, method: method, data: data })
}

// 上传文件
export function filePost(data) {
  return Func('post', data)
}

// 删除文件
export function fileDelete(data) {
  return Func('delete', data)
}
