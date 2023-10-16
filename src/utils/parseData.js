// 截取字符串指定的长度
export function ellipsis(data, len) {
  if (!data) return ''
  if (data.length > len) {
    return data.slice(0, len) + '...'
  }
  return data
}

// 根据id从list中获取数据
export function getDataDictById(dataDict, dataId) {
  return dataDict[dataId]
}

// 根据id从list中获取数据
export function getDataFormListById(data, data_id) {
  for (const index in data) {
    if (data[index].id === data_id) {
      return data[index]
    }
  }
}

// 根据name从list中获取数据
export function getDataFormListByName(data, data_name) {
  for (const index in data) {
    if (data[index].name === data_name) {
      return data[index]
    }
  }
}

// 递归把列表转为树行结构
export function arrayToTree(arr, parentId) {
  //  arr 是返回的数据  parendId 父id
  const temp = []
  const treeArr = arr
  treeArr.forEach((item, index) => {
    if (item.parent === parentId) {
      if (arrayToTree(treeArr, treeArr[index].id).length > 0) {
        // 递归调用此函数
        treeArr[index].children = arrayToTree(treeArr, treeArr[index].id)
      }
      temp.push(treeArr[index])
    }
  })
  return temp
}

// 把数据解析为int
export function tryParseInt(data) {
  if (data) {
    try {
      return parseInt(data)
    } catch (e) {
      return data
    }
  }
  return data
}

// 把数据解析为string
export function tryParseString(data) {
  if (data) {
    try {
      return data.toString()
    } catch (e) {
      return data
    }
  }
  return data
}

// 列表格式的查询字符串参数转为字符串
export function paramsListToStr(paramsList) {
  const queryStrList = []
  paramsList.forEach((param) => {
    const key = param['key']
    const value = param['value']
    if (key) {
      queryStrList.push(`${key}=${value}`)
    }
  })
  if (queryStrList.length > 0) {
    return '?' + queryStrList.join('&')
  } else {
    return ''
  }
}

export function formatDate(createTime) {
  // 2023-08-04T17:48:18.786939+08:00
  const split_create_time = createTime.split('T') // [2023-08-04, 17:48:18.786939+08:00]
  const split_time = split_create_time[1].split('.') // [17:48:18, 786939+08:00]
  return `${split_create_time[0]} ${split_time[0]}`
}
