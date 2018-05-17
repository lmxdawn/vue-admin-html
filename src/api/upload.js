/**
 * 上传相关
 */
import fetch from '../utils/fetch'

// 获取列表
export function uploadList (query) {
    return fetch({
        url: '/admin/upload/imageList',
        method: 'get',
        params: query
    })
}
