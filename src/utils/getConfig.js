import { getConfigByCode, getGetFindElementBy } from '@/apis/config/config'

// 获取配置的运行等待超时时间
export function getRunTimeout(_this) {
  let runTimeout = 0
  getConfigByCode({ code: 'run_time_out' }).then(response => {
    _this.$busEvents.runTimeout = response.data
    runTimeout = response.data.value
  })
  return runTimeout
}

// 获取ui自动化元素定位方式
export function getFindElementOption(_this, dataType) {
  let findElementOption = []
  getGetFindElementBy({ 'test_type': dataType }).then(response => {
    findElementOption = response.data
    _this.$busEvents.data.findElementOptionList = findElementOption
    // 列表解析为字典
    const optionDict = []
    findElementOption.forEach(option => {
      optionDict[option.value] = option.label
    })
    _this.$busEvents.data.findElementOptionDict = optionDict
  })
  return findElementOption
}

// // 获取ui自动化数据提取类型
// export function getExtractTypeList(_this) {
//   let tempList = []
//   extractTypeList().then(response => {
//     tempList = response.data
//     _this.$busEvents.data.extractTypeList = tempList
//     // 列表解析为字典
//     let tempDict = []
//     tempList.forEach(option => {
//       tempDict[option.value] = option.label
//     })
//     _this.$busEvents.data.extractTypeDict = tempDict
//   })
//   return tempList
// }

