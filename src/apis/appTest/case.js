import request from '@/utils/request' // 加载请求配置文件
import { baseDirAppUiTest } from '@/apis/base'

const currentBaseDir = baseDirAppUiTest + '/case'

function Func(method, data = null, params = null) {
  return request({ url: currentBaseDir, method: method, data: data, params: params })
}

// 添加用例
export function postCase(data) {
  return Func('post', data)
}

// 修改用例
export function putCase(data) {
  return Func('put', data)
}

// 删除用例
export function deleteCase(data) {
  return Func('delete', data)
}

// 获取用例
export function getCase(data) {
  return request({ url: currentBaseDir + '/detail', method: 'post', data: data })
}

// 运行测试用例，并生成报告
export function caseRun(data) {
  return request({ url: currentBaseDir + '/run', method: 'post', data: data })
}

// 修改用例状态
export function putCaseIsRun(data) {
  return request({ url: currentBaseDir + '/status', method: 'put', data: data })
}

// 获取用例list
export function caseList(data) {
  return request({ url: currentBaseDir + '/list', method: 'post', data: data || {}})
}

// 根据用例id获取用例名
export function caseName(data) {
  return request({ url: currentBaseDir + '/name', method: 'post', data: data })
}

// 修改用例的引用关系
export function changeCaseQuote(data) {
  return request({ url: currentBaseDir + '/quote', method: 'put', data: data })
}

// 复制用例
export function copyCase(data) {
  return request({ url: currentBaseDir + '/copy', method: 'post', data: data })
}

// 复制用例的步骤
export function copyCaseStep(data) {
  return request({ url: currentBaseDir + '/copy/step', method: 'post', data: data })
}

// 拉取用例的步骤
export function pullStep(data) {
  return request({ url: currentBaseDir + '/pull/step', method: 'post', data: data })
}

// 修改用例排序
export function caseSort(data) {
  return request({ url: currentBaseDir + '/sort', method: 'put', data: data })
}

// 获取用例的来源
export function caseFrom(data) {
  return request({ url: currentBaseDir + '/from', method: 'post', data: data })
}

// 获取用例所属的服务
export function caseProject(data) {
  return request({ url: currentBaseDir + '/project', method: 'post', data: data })
}
