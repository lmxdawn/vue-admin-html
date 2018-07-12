<p align="center">
  <img width="320" src="https://lmxdawn.github.io/images/lmxdawn.png">
</p>

<p align="center">
  <a href="https://github.com/vuejs/vue">
    <img src="https://img.shields.io/badge/vue-2.5.16-brightgreen.svg" alt="vue">
  </a>
  <a href="https://cli.vuejs.org">
    <img src="https://img.shields.io/badge/vue-cli3.0.0-brightgreen.svg" alt="vue">
  </a>
  <a href="https://github.com/ElemeFE/element">
    <img src="https://img.shields.io/badge/element--ui-2.4.3-brightgreen.svg" alt="element-ui">
  </a>
</p>

# 目前 v3.0.0 版本 <a href="https://github.com/lmxdawn/vue-admin-html/tree/v1.0.0">点击前往 v1.0.0 版本</a>
## 更新日志
- [x] 更新vue-cli为3.0版本 <a href="https://segmentfault.com/a/1190000015133974">这里有篇文章</a>
- [x] 增加广告管理
- [x] 优化路由控制
- [x] 优化一些配置文件
- [x] 登录用户信息存储改为 cookie

# v3.0.0 踩过的坑
1. 这次更新后 vuex 开启严格模式后，出现浅拷贝的问题，就是变量引用的问题 <a href="https://segmentfault.com/q/1010000010025289/a-1020000015605407">这里有篇文章</a>
2. 还有就是路由导入某个文件时要在文件头部引入具体的某个文件，不用 resolve => require(['xx.vue'], resolve) 或者  () => import('xx.vue') 这种方式


# vue-admin-html

> 基于Vue.js 2.x系列 + Element UI + RBAC/AUTH权限 的响应式后台管理系统

## 前言 ##

**项目前端地址：** https://github.com/lmxdawn/vue-admin-html

**项目后端地址：** https://github.com/lmxdawn/vue-admin-php

欢迎大家的star

## PC版
![donate](https://lmxdawn.github.io/images/pc.png)
## 手机版
![donate](https://lmxdawn.github.io/images/phone.png)
![donate](https://lmxdawn.github.io/images/phone-1.png)


## 功能 ##
- [x] 管理员登录
- [x] 登录
- [x] 修改密码
- [x] 角色管理
- [x] 权限管理
- [x] 401/404错误页面
- [x] 动态面包屑
- [x] 动态侧边栏
- [x] 广告管理


## 安装步骤 ##

	git clone https://github.com/lmxdawn/vue-admin-html.git      // 把模板下载到本地
	cd vue-admin-html    // 进入模板目录
	npm install         // 安装项目依赖，等待安装完成之后

## 本地开发 ##

	// 开启服务器，浏览器访问 http://localhost:8080
	npm run serve

## 构建生产 ##

	// 执行构建命令，生成的dist文件夹放在服务器下即可访问
	npm run build
	
## Online Demo
 （建议使用最新版Chrome浏览器）
[在线 Demo](https://lmxdawn.github.io/vue-admin)

## Donate
鼓励鼓励鼓励，重要的事情说三遍 
![donate](https://lmxdawn.github.io/images/pay.png)


## License

[MIT](https://github.com/lmxdawn/vue-admin-html/blob/master/LICENSE)

Copyright (c) 2018 lmxdawn

