import Vue from 'vue'
import Router from 'vue-router'
import { routerMode } from '../../config/env'

Vue.use(Router)

// 登录
const login = r => require.ensure([], () => r(require('../pages/login/index.vue')), 'login')
// 错误页面
const err401 = r => require.ensure([], () => r(require('../pages/error/err401.vue')), 'err401')
const err404 = r => require.ensure([], () => r(require('../pages/error/err404.vue')), 'err404')
const err500 = r => require.ensure([], () => r(require('../pages/error/err500.vue')), 'err500')
// 首页
const home = r => require.ensure([], () => r(require('../pages/home/index.vue')), 'home')

// 注意 权限字段 authRule （严格区分大小写）
export const constantRouterMap = [
    {
        path: '*',
        component: err404,
        hidden: true
    },
    {
        path: '/login',
        component: login,
        name: '登录',
        hidden: true
    },
    {
        path: '/401',
        component: err401,
        name: '401',
        hidden: true
    },
    {
        path: '/404',
        component: err404,
        name: '404',
        hidden: true
    },
    {
        path: '/500',
        component: err500,
        name: '500',
        hidden: true
    },
    {
        path: '/',
        component: home,
        redirect: '/readme',
        name: '首页',
        hidden: true
    },
    {
        path: '/readme',
        component: home,
        redirect: '/readme/index',
        icon: 'shouye',
        name: '前言',
        noDropdown: true,
        children: [
            {
                path: 'index',
                component: resolve => require(['../pages/home/main.vue'], resolve)
            }
        ]
    }

]

export default new Router({
    // mode: 'history', //后端支持可开
    mode: routerMode,
    routes: constantRouterMap,
    strict: process.env.NODE_ENV !== 'production'
})

export const asyncRouterMap = [
    {
        path: '/user_manage',
        redirect: '/user_manage/admin/index',
        component: home,
        icon: 'guanliyuan1',
        name: '用户管理',
        meta: {
            authRule: ['user_manage']
        },
        // noDropdown: true,
        children: [
            {
                path: '/user_manage/admin',
                component: resolve => require(['../pages/user_manage/router.vue'], resolve),
                redirect: '/user_manage/admin/index',
                name: '管理组',
                meta: {
                    authRule: ['user_manage/admin']
                },
                children: [
                    {
                        path: 'index',
                        component: resolve => require(['../pages/user_manage/admin/index.vue'], resolve),
                        name: '管理员管理',
                        meta: {
                            authRule: ['admin/admin/index']
                        }
                    },
                    {
                        path: 'role',
                        component: resolve => require(['../pages/user_manage/admin/role.vue'], resolve),
                        name: '角色管理',
                        meta: {
                            authRule: ['admin/role/index']
                        }
                    },
                    {
                        path: 'authRule',
                        component: resolve => require(['../pages/user_manage/admin/authRule.vue'], resolve),
                        name: '权限管理',
                        meta: {
                            authRule: ['admin/authrule/index']
                        }
                    }
                ]
            }
        ]
    }
]
