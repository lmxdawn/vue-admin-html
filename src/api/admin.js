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

// 保存
export function adminSave (data, formName, method = 'post') {
    var url = formName === 'add' ? '/admin/admin/save' : '/admin/admin/edit'
    return fetch({
        url: url,
        method: method,
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
