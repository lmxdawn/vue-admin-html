/**
 * 上传相关
 */
import axios from "../utils/axios";
import { API_SUFFIX } from "../config/app";

// 获取列表
export function uploadList(query) {
    return axios({
        url: "/admin/upload/imageList" + API_SUFFIX,
        method: "get",
        params: query
    });
}

// 创建文件夹
export function uploadNewDir(data) {
    return axios({
        url: "/admin/upload/newDir" + API_SUFFIX,
        method: "post",
        data: data
    });
}
