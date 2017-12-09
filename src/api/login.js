/**
 * Created by lk on 17/6/4.
 */
import fetch from '../utils/fetch'

// 获取信息
export function userInfo (id, token) {
    return fetch({
        url: '/admin/login/userInfo',
        method: 'get',
        params: {id, token}
    })
}

export function loginName (userName, pwd) {
    return fetch({
        url: '/admin/login',
        method: 'post',
        data: { userName, pwd }
    })
}

export function logout (uid, token) {
    return fetch({
        url: '/admin/login/out',
        method: 'post',
        data: { uid, token }
    })
}
