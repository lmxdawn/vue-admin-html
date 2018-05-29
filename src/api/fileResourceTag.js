/**
 * 资源分组相关
 */
import fetch from '../utils/fetch'

// 列表
export function fileResourceTagList (query) {
    return fetch({
        url: '/admin/file_resource_tag/index',
        method: 'get',
        params: query
    })
}

// 创建分组
export function fileResourceTagAdd (data) {
    return fetch({
        url: '/admin/file_resource_tag/add',
        method: 'post',
        data: data
    })
}
