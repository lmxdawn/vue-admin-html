/**
 * Created by lk on 17/6/4.
 */
import axios from "../../utils/axios";
import { API_SUFFIX } from "../../config/app";

// 获取列表
export function authRoleList(query) {
    return axios({
        url: "/admin/auth/role/index" + API_SUFFIX,
        method: "get",
        params: query
    });
}

// 编辑
export function authRoleAuthList(query) {
    return axios({
        url: "/admin/auth/role/auth" + API_SUFFIX,
        method: "get",
        params: query
    });
}

// 添加
export function authRoleAuth(data) {
    return axios({
        url: "/admin/auth/role/auth" + API_SUFFIX,
        method: "post",
        data: data
    });
}

// 保存
export function authRoleSave(data, formName, method = "post") {
    var url =
        formName === "add"
            ? "/admin/auth/role/save" + API_SUFFIX
            : "/admin/auth/role/edit" + API_SUFFIX;
    return axios({
        url: url,
        method: method,
        data: data
    });
}

// 删除
export function authRoleDelete(data) {
    return axios({
        url: "/admin/auth/role/delete" + API_SUFFIX,
        method: "post",
        data: data
    });
}
