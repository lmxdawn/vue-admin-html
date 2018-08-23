/**
 * Created by lk on 17/6/4.
 */
import axios from "../../utils/axios";
import { API_SUFFIX } from "../../config/app";

// 权限管理

// 获取列表
export function authPermissionRuleList(query) {
    return axios({
        url: "/admin/auth/permission_rule/index" + API_SUFFIX,
        method: "get",
        params: query
    });
}

// 保存
export function authPermissionRuleSave(data, formName, method = "post") {
    var url =
        formName === "add"
            ? "/admin/auth/permission_rule/save" + API_SUFFIX
            : "/admin/auth/permission_rule/edit" + API_SUFFIX;
    return axios({
        url: url,
        method: method,
        data: data
    });
}

// 删除
export function authPermissionRuleDelete(data) {
    return axios({
        url: "/admin/auth/permission_rule/delete" + API_SUFFIX,
        method: "post",
        data: data
    });
}
