const UserKey = 'userInfo'
// 获取用户信息
export function getUser () {
  return JSON.parse(window.localStorage.getItem(UserKey))
}
// 设置用户信息
export function setUser (data) {
  window.localStorage.setItem(UserKey, JSON.stringify(data))
}
// 删除用户信息
export function removeUser () {
  window.localStorage.removeItem(UserKey)
}
