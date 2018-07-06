/**
 * Created by lk on 17/6/4.
 */
import fetch from '../../utils/fetch'

// 谁最懂我相关

// 列表
export function adList (query) {
    return fetch({
        url: '/admin/ad/index',
        method: 'get',
        params: query
    })
}

// 保存
export function adSave (data, formName, method = 'post') {
    var url = formName === 'add' ? '/admin/ad/save' : '/admin/ad/edit'
    return fetch({
        url: url,
        method: method,
        data: data
    })
}

// 删除
export function adDelete (data) {
    return fetch({
        url: '/admin/ad/delete',
        method: 'post',
        data: data
    })
}
