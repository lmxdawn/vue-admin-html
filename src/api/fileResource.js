/**
 * 资源管理相关
 */
import fetch from '../utils/fetch'

// 列表
export function fileResourceList (query) {
    return fetch({
        url: '/admin/file_resource/index',
        method: 'get',
        params: query
    })
}
