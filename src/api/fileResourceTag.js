/**
 * 资源分组相关
 */
import axios from "../utils/axios";
import { API_SUFFIX } from "../config/app";

// 列表
export function fileResourceTagList(query) {
    return axios({
        url: "/admin/file_resource_tag/index" + API_SUFFIX,
        method: "get",
        params: query
    });
}

// 创建分组
export function fileResourceTagAdd(data) {
    return axios({
        url: "/admin/file_resource_tag/add" + API_SUFFIX,
        method: "post",
        data: data
    });
}
