/**
 * Created by lk on 17/6/4.
 */
import fetch from '../utils/fetch'

const API_SUFFIX = process.env.API_SUFFIX

// 获取列表
export function getRoleList (query) {
    return fetch({
        url: '/admin/role/index' + API_SUFFIX,
        method: 'get',
        params: query
    })
}

// 编辑
export function roleAuthList (query) {
    return fetch({
        url: '/admin/role/auth' + API_SUFFIX,
        method: 'get',
        params: query
    })
}

// 添加
export function roleAuth (data) {
    return fetch({
        url: '/admin/role/auth' + API_SUFFIX,
        method: 'post',
        data: data
    })
}

// 保存
export function roleSave (data, formName, method = 'post') {
    var url = formName === 'add' ? '/admin/role/save' + API_SUFFIX : '/admin/role/edit' + API_SUFFIX
    return fetch({
        url: url,
        method: method,
        data: data
    })
}

// 删除
export function roleDelete (data) {
    return fetch({
        url: '/admin/role/delete' + API_SUFFIX,
        method: 'post',
        data: data
    })
}
