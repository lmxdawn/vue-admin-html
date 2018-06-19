/**
 * Created by lk on 17/6/4.
 */
import fetch from '../utils/fetch'

const API_SUFFIX = process.env.API_SUFFIX

// 权限管理

// 获取列表
export function authPermissionRuleList (query) {
    return fetch({
        url: '/admin/auth_permission_rule/index' + API_SUFFIX,
        method: 'get',
        params: query
    })
}

// 保存
export function authPermissionRuleSave (data, formName, method = 'post') {
    var url = formName === 'add' ? '/admin/auth_permission_rule/save' + API_SUFFIX : '/admin/auth_permission_rule/edit' + API_SUFFIX
    return fetch({
        url: url,
        method: method,
        data: data
    })
}

// 删除
export function authPermissionRuleDelete (data) {
    return fetch({
        url: '/admin/auth_permission_rule/delete' + API_SUFFIX,
        method: 'post',
        data: data
    })
}
