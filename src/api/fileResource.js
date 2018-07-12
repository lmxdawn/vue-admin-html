/**
 * 资源管理相关
 */
import axios from "../utils/axios";
import { API_SUFFIX } from "../config/app";

// 列表
export function fileResourceList(query) {
    return axios({
        url: "/admin/file_resource/index" + API_SUFFIX,
        method: "get",
        params: query
    });
}
