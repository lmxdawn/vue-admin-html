/**
 * 上传相关
 */
import axios from "../../utils/axios";

// 获取七牛上传 upToken
export function qiuniuUpToken(query) {
    return axios({
        url: "/admin/file/qiniu/upToken",
        method: "get",
        params: query
    });
}

// 上传文件
export function uploadFile(url, formdata) {
    return axios({
        url: url,
        method: "post",
        data: formdata
    });
}
