/**
 * Created by lk on 17/6/4.
 */
import fetch from '../utils/fetch'

const API_SUFFIX = process.env.API_SUFFIX

// 获取列表
export function authRoleList (query) {
    return fetch({
        url: '/admin/auth_role/index' + API_SUFFIX,
        method: 'get',
        params: query
    })
}

// 编辑
export function authRoleAuthList (query) {
    return fetch({
        url: '/admin/auth_role/auth' + API_SUFFIX,
        method: 'get',
        params: query
    })
}

// 添加
export function authRoleAuth (data) {
    return fetch({
        url: '/admin/auth_role/auth' + API_SUFFIX,
        method: 'post',
        data: data
    })
}

// 保存
export function authRoleSave (data, formName, method = 'post') {
    var url = formName === 'add' ? '/admin/auth_role/save' + API_SUFFIX : '/admin/auth_role/edit' + API_SUFFIX
    return fetch({
        url: url,
        method: method,
        data: data
    })
}

// 删除
export function authRoleDelete (data) {
    return fetch({
        url: '/admin/auth_role/delete' + API_SUFFIX,
        method: 'post',
        data: data
    })
}
