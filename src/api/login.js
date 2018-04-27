/**
 * Created by lk on 17/6/4.
 */
import fetch from '../utils/fetch'

const API_SUFFIX = process.env.API_SUFFIX

// 获取信息
export function userInfo (id, token) {
    return fetch({
        url: '/admin/login/userInfo' + API_SUFFIX,
        method: 'get',
        params: {id, token}
    })
}

export function loginName (userName, pwd) {
    return fetch({
        url: '/admin/login/index' + API_SUFFIX,
        method: 'post',
        data: { userName, pwd }
    })
}

export function logout (uid, token) {
    return fetch({
        url: '/admin/login/out' + API_SUFFIX,
        method: 'post',
        data: { uid, token }
    })
}

export function password (data) {
    return fetch({
        url: '/admin/login/password' + API_SUFFIX,
        method: 'post',
        data: data
    })
}
