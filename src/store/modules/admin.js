import { userInfo, loginName, logout } from '../../api/login'
import * as types from '../mutation-types'
import { asyncRouterMap, constantRouterMap } from '../../router'
import { getInfo, setInfo, removeInfo } from '../../utils/auth'
// import { $NOT_NETWORK } from '../../utils/errorCode'
import { Message } from 'element-ui'

let info = getInfo()
// initial state
const state = {
    id: info.id || '', // id
    userName: info.userName || '', // 昵称
    avatar: info.avatar || '', // 头像
    token: info.token || '', // 登录token
    authRules: [], // 权限列表
    routers: constantRouterMap, // 路由列表
    addRouters: [] // 添加的路由列表
}

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param authRules
 * @param route
 */
function hasRole (authRules, route) {
    if (route.meta && route.meta.authRule) {
        return authRules.some(authRule => route.meta.authRule.indexOf(authRule) >= 0)
    } else {
        return true
    }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param authRules
 */
function filterAsyncRouter (asyncRouterMap, authRules) {
    const accessedRouters = asyncRouterMap.filter(route => {
        if (hasRole(authRules, route)) {
            if (route.children && route.children.length) {
                route.children = filterAsyncRouter(route.children, authRules)
            }
            return true
        }
        return false
    })
    return accessedRouters
}

// getters
const getters = {
    id: state => state.id,
    userName: state => state.userName,
    avatar: state => state.avatar,
    token: state => state.token,
    authRules: state => state.authRules,
    routers: state => state.routers,
    addRouters: state => state.addRouters
}

// actions
const actions = {
    // 用户名登录
    loginName ({ commit }, userInfo) {
        const userName = userInfo.userName ? userInfo.userName.trim() : ''
        const pwd = userInfo.pwd ? userInfo.pwd : ''
        return new Promise((resolve, reject) => {
            loginName(userName, pwd).then(response => {
                const data = response || {}
                if (data.errcode) {
                    Message({
                        message: response.errmsg,
                        type: 'error',
                        duration: 5 * 1000
                    })
                }
                data.roles = [] // 解决登录跳转过去，动态路由不添加的问题
                commit(types.RECEIVE_USER_INFO, data)
                resolve()
            }).catch(error => {
                reject(error)
            })
        })
    },
    userInfo ({commit, state}) {
        return new Promise((resolve, reject) => {
            userInfo(state.id, state.token).then(response => {
                const data = response || {}
                commit(types.RECEIVE_USER_INFO, data)
                resolve(data)
            }).catch(error => {
                reject(error)
            })
        })
    },
    // 登出
    loginOut ({commit, state}) {
        return new Promise((resolve, reject) => {
            logout(state.id, state.token).then(() => {
                commit(types.RECEIVE_USER_INFO, {})
                removeInfo()
                resolve()
            }).catch(error => {
                reject(error)
            })
        })
    },

    // 前端 登出
    fedLogout ({commit}) {
        return new Promise(resolve => {
            commit(types.RECEIVE_USER_INFO, {})
            removeInfo()
            resolve()
        })
    },
    /**
     * 过滤路由列表
     * @param commit
     * @param data
     * @returns {Promise}
     */
    filterRouter ({commit}, data) {
        return new Promise(resolve => {
            const {authRules} = data
            if (authRules && authRules.length > 0) {
                let accessedRouters
                if (authRules.indexOf('admin') >= 0) {
                    accessedRouters = asyncRouterMap
                } else {
                    accessedRouters = filterAsyncRouter(asyncRouterMap, authRules)
                }
                commit(types.RECEIVE_ROUTERS, accessedRouters)
            }
            resolve()
        })
    }
}

// mutations
const mutations = {
    [types.RECEIVE_USER_INFO] (state, res) {
        if (res.id) {
            state.id = res.id
        }
        if (res.token) {
            state.token = res.token
        }
        state.userName = res.username || ''
        state.avatar = res.avatar || ''
        if (res.authRules) {
            state.authRules = res.authRules
        }
        setInfo(res)
    },
    [types.RECEIVE_ROUTERS] (state, routers) {
        state.addRouters = routers
        state.routers = constantRouterMap.concat(routers)
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
