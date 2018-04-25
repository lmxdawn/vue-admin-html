/**
 * Created by lk on 17/6/4.
 */
import fetch from '../utils/fetch'

// 获取列表
export function getRoleList (query) {
    return fetch({
        url: '/admin/role/index',
        method: 'get',
        params: query
    })
}

// 编辑
export function roleAuthList (query) {
    return fetch({
        url: '/admin/role/auth',
        method: 'get',
        params: query
    })
}

// 添加
export function roleAuth (data) {
    return fetch({
        url: '/admin/role/auth',
        method: 'post',
        data: data
    })
}

// 保存
export function roleSave (data, formName, method = 'post') {
    var url = formName === 'add' ? '/admin/role/save' : '/admin/role/edit'
    return fetch({
        url: url,
        method: method,
        data: data
    })
}

// 删除
export function roleDelete (data) {
    return fetch({
        url: '/admin/role/delete',
        method: 'post',
        data: data
    })
}
