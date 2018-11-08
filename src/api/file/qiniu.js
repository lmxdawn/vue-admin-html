/**
 *  七牛相关
 */

import axios from "../../utils/axios";

// 获取上传 upToken
export function qiuniuUpToken(query) {
    return axios({
        url: "/admin/file/qiniu/upToken",
        method: "get",
        params: query
    });
}
