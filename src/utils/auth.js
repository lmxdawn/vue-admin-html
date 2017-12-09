import { getStore, setStore, removeStore } from './utils'

const adminKey = 'adminUser'

 // 获取token
export function getInfo () {
    let info = getStore(adminKey)
    return info || {}
}

 // 设置token
export function setInfo (info) {
    return setStore(adminKey, info)
}

 // 删除token
export function removeInfo () {
    return removeStore(adminKey)
}
