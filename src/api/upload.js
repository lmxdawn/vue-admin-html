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

// 创建文件夹
export function uploadNewDir (data) {
    return fetch({
        url: '/admin/upload/newDir',
        method: 'post',
        data: data
    })
}
