/**
 * 上传相关
 */
import axios from "../../utils/axios";

// 获取列表
export function uploadList(query) {
    return axios({
        url: "/admin/file/upload/imageList",
        method: "get",
        params: query
    });
}

// 创建文件夹
export function uploadNewDir(data) {
    return axios({
        url: "/admin/file/upload/newDir",
        method: "post",
        data: data
    });
}
