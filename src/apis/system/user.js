import request from '@/utils/request'
import { baseDirSystem } from '@/apis/base'

const currentBaseDir = baseDirSystem + '/user'

function Func(method, data = null, params = null) {
  return request({ url: currentBaseDir, method: method, data: data, params: params })
}

// 登录
export function login(data) {
  return request({ url: currentBaseDir + '/login', method: 'post', data })
}

// 退出登录
export function logout() {
  return request({ url: currentBaseDir + '/logout', method: 'post' })
}

// 用户列表
export function userList(data) {
  return request({ url: currentBaseDir + '/list', method: 'post', data: data || {}})
}

// 修改用户状态
export function userStatus(data) {
  return request({ url: currentBaseDir + '/status', method: 'put', data: data })
}

// 修改密码
export function userPassword(data) {
  return request({ url: currentBaseDir + '/password', method: 'put', data: data })
}

// 获取用户的角色
export function userRoles(data) {
  return request({ url: currentBaseDir + '/role', method: 'post', data: data })
}

// 获取用户信息
export function getUser(data) {
  return request({ url: currentBaseDir + '/detail', method: 'post', data: data })
}

// 新增用户
export function postUser(data) {
  return Func('post', data)
}

// 修改用户
export function putUser(data) {
  return Func('put', data)
}

// 删除用户
export function deleteUser(data) {
  return Func('delete', data)
}
