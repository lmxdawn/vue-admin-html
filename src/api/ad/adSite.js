/**
 * Created by lk on 17/6/4.
 */
import fetch from '../../utils/fetch'

// 谁最懂我相关

// 列表
export function adSiteList (query) {
    return fetch({
        url: '/admin/ad_site/index',
        method: 'get',
        params: query
    })
}

// 广告列表
export function adSiteAdList (query) {
    return fetch({
        url: '/admin/ad_site/adList',
        method: 'get',
        params: query
    })
}

// 保存
export function adSiteSave (data, formName, method = 'post') {
    var url = formName === 'add' ? '/admin/ad_site/save' : '/admin/ad_site/edit'
    return fetch({
        url: url,
        method: method,
        data: data
    })
}

// 删除
export function adSiteDelete (data) {
    return fetch({
        url: '/admin/ad_site/delete',
        method: 'post',
        data: data
    })
}
