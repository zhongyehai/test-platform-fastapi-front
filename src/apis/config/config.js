import request from '@/utils/request'
import { baseDirConfig } from '@/apis/base' // 加载请求配置文件

const currentBaseDir = baseDirConfig + '/config'

function Func(method, data = null, params = null) {
  return request({ url: currentBaseDir, method: method, data: data, params: params })
}

// 添加配置
export function postConfig(data) {
  return Func('post', data)
}

// 修改配置
export function putConfig(data) {
  return Func('put', data)
}

// 删除配置
export function deleteConfig(data) {
  return Func('delete', data)
}

// 获取配置
// export function getConfig(data) {
//   return request({ url: currentBaseDir + '/detail', method: 'post', data: data })
// }

// 获取配置list
export function configList(data) {
  return request({ url: currentBaseDir + '/list', method: 'post', data: data || {}})
}

// 根据配置名获取配置
export function getConfigByCode(data) {
  return request({ url: currentBaseDir + '/by/code', method: 'post', data: data })
}

// 获取配置的执行模式
export function getRunModel() {
  return request({ url: currentBaseDir + '/by/code', method: 'post', data: { 'code': 'run_model' }})
}

// 获取跳过条件类型
export function getSkipIfTypeMapping() {
  return request({ url: currentBaseDir + '/by/code', method: 'post', data: { 'code': 'skip_if_type_mapping' }})
}

// 获取数据提取数据源
export function getExtractsMapping(params) {
  return request({ url: currentBaseDir + '/by/code', method: 'post', data: { 'code': 'extracts_mapping' }})
}

// 获取跳过条件数据源
export function getSkipIfDataSourceMapping(data) {
  return request({ url: currentBaseDir + '/skip/if', method: 'post', data: data })
}

// 获取定位方式数据源
export function getGetFindElementBy(data) {
  return request({ url: currentBaseDir + '/find/element', method: 'post', data: data })
}
