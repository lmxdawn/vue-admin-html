/**
 *  七牛相关
 */

import axios from "../../utils/axios";
import { API_SUFFIX } from "../../config/app";

// 获取上传 upToken
export function qiuniuUpToken(query) {
    return axios({
        url: "/admin/file/qiniu/upToken" + API_SUFFIX,
        method: "get",
        params: query
    });
}
