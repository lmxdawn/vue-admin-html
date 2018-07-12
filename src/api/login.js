/**
 * Created by lk on 17/6/4.
 */
import axios from "../utils/axios";
import { API_SUFFIX } from "../config/app";
// 获取信息
export function userInfo(id, token) {
    return axios({
        url: "/admin/login/userInfo" + API_SUFFIX,
        method: "get",
        params: { id, token }
    });
}

export function loginName(userName, pwd) {
    return axios({
        url: "/admin/login/index" + API_SUFFIX,
        method: "post",
        data: { userName, pwd }
    });
}

export function logout(uid, token) {
    return axios({
        url: "/admin/login/out" + API_SUFFIX,
        method: "post",
        data: { uid, token }
    });
}

export function password(data) {
    return axios({
        url: "/admin/login/password" + API_SUFFIX,
        method: "post",
        data: data
    });
}
