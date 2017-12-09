/**
 * Created by lk on 17/6/4.
 */
import fetch from '../utils/fetch'

// 获取列表
export function getAdminList (query) {
    return fetch({
        url: '/admin/admin/index',
        method: 'get',
        params: query
    })
}

// 添加管理员
export function adminSave (data) {
    return fetch({
        url: '/admin/admin/save',
        method: 'post',
        data: data
    })
}

// 编辑管理员
export function adminEdit (data) {
    return fetch({
        url: '/admin/admin/edit',
        method: 'post',
        data: data
    })
}

// 删除管理员
export function adminDelete (data) {
    return fetch({
        url: '/admin/admin/delete',
        method: 'post',
        data: data
    })
}
