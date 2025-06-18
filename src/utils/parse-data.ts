
// 截取字符串指定的长度
export function ellipsis(data: string, len: number) {
    if (!data) return ''
    if (data.length > len) {
        return data.slice(0, len) + '...'
    }
    return data
}

// 递归把列表转为树结构
export function arrayToTree(arr: any, parentId: number | null) {
    const temp: any[] = []
    const treeArr = arr
    treeArr.forEach((item: { parent: number }, index: string | number) => {
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

// 列表格式的查询字符串参数转为字符串
export function paramsListToStr(paramsList: any[]) {
    const queryStrList: string[] = []
    paramsList.forEach((param) => {
        const key = param['key']; const value = param['value']
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
