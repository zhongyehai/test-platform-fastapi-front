import request from '@/utils/request' // 加载请求配置文件
import { baseDirApiTest } from '@/apis/base'

const reportDir = baseDirApiTest + '/report'
const reportCaseDir = baseDirApiTest + '/report/case'
const reportStepDir = baseDirApiTest + '/report/step'

// 删除报告
export function deleteReport(data) {
  return request({ url: reportDir, method: 'delete', data: data })
}

// 获取报告数据
export function getReport(data) {
  return request({ url: reportDir + '/detail', method: 'post', data: data })
}

// 报告列表
export function reportList(data) {
  return request({ url: reportDir + '/list', method: 'post', data: data || {}})
}

// 报告是否生成
export function reportStatus(data) {
  return request({ url: reportDir + '/status', method: 'post', data: data })
}

// 获取运行批次中要展示的报告id
export function reportShowId(data) {
  return request({ url: reportDir + '/show/id', method: 'post', data: data })
}

// 报告用例列表
export function reportCaseList(data) {
  return request({ url: reportCaseDir + '/list', method: 'post', data: data || {}})
}

// 报告用例数据
export function reportCaseDetail(data) {
  return request({ url: reportCaseDir, method: 'post', data: data })
}

// 报告步骤列表
export function reportStepList(data) {
  return request({ url: reportStepDir + '/list', method: 'post', data: data || {}})
}

// 报告步骤数据
export function reportStepDetail(data) {
  return request({ url: reportStepDir, method: 'post', data: data })
}
