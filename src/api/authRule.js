/**
 * Created by lk on 17/6/4.
 */
import fetch from '../utils/fetch'

// 权限管理

// 获取列表
export function authRuleList (query) {
    return fetch({
        url: '/admin/auth_rule/index',
        method: 'get',
        params: query
    })
}

// 添加
export function authRuleSave (data) {
    return fetch({
        url: '/admin/auth_rule/save',
        method: 'post',
        data: data
    })
}

// 编辑
export function authRuleEdit (data) {
    return fetch({
        url: '/admin/auth_rule/edit',
        method: 'post',
        data: data
    })
}

// 删除
export function authRuleDelete (data) {
    return fetch({
        url: '/admin/auth_rule/delete',
        method: 'post',
        data: data
    })
}
