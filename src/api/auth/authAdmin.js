/**
 * Created by lk on 17/6/4.
 */
import axios from "../../utils/axios";
import { API_SUFFIX } from "../../config/app";

// 获取列表
export function authAdminList(query) {
    return axios({
        url: "/admin/auth_admin/index" + API_SUFFIX,
        method: "get",
        params: query
    });
}

// 保存
export function authAdminSave(data, formName, method = "post") {
    var url =
        formName === "add"
            ? "/admin/auth_admin/save" + API_SUFFIX
            : "/admin/auth_admin/edit" + API_SUFFIX;
    return axios({
        url: url,
        method: method,
        data: data
    });
}

// 删除管理员
export function authAdminDelete(data) {
    return axios({
        url: "/admin/auth_admin/delete" + API_SUFFIX,
        method: "post",
        data: data
    });
}
