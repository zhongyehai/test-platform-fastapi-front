import request from '@/utils/request'
import { baseDirApiTest } from '@/apis/base'

const currentBaseDir = baseDirApiTest + '/stat'

// 使用总览卡片
export function useCard(data) {
  return request({ url: currentBaseDir + '/use/card', method: 'post', data: data })
}

// 使用总览柱状图
export function useChart(data) {
  return request({ url: currentBaseDir + '/use/chart', method: 'post', data: data })
}

// 业务线分析
export function analyseChart(data) {
  return request({ url: currentBaseDir + '/analyse', method: 'post', data: data })
}
