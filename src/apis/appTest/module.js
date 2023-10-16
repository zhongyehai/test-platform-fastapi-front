import request from '@/utils/request' // 加载请求配置文件
import { baseDirAppUiTest } from '@/apis/base'

const currentBaseDir = baseDirAppUiTest + '/module'

function Func(method, data = null, params = null) {
  return request({ url: currentBaseDir, method: method, data: data, params: params })
}

// 添加模块
export function postModule(data) {
  return Func('post', data)
}

// 修改模块
export function putModule(data) {
  return Func('put', data)
}

// 删除模块
export function deleteModule(data) {
  return Func('delete', data)
}

// 获取模块
export function getModule(data) {
  return request({ url: currentBaseDir + '/detail', method: 'post', data: data })
}

// 运行模块下的用例
export function moduleRun(data) {
  return request({ url: currentBaseDir + '/run', method: 'post', data: data })
}

// 获取模块树
export function moduleTree(data) {
  return request({ url: currentBaseDir + '/tree', method: 'post', data: data })
}

// 获取模块list
export function moduleList(data) {
  return request({ url: currentBaseDir + '/list', method: 'post', data: data || {}})
}

// 置顶模块
export function moduleStick(data) {
  return request({ url: currentBaseDir + '/stick', method: 'put', data: data })
}
