/**
 * 配置编译环境和线上环境之间的切换
 *
 * baseUrl: 域名地址
 * routerMode: 路由模式
 * imgBaseUrl: 图片所在域名地址
 *
 */

var baseUrl = 'http://localhost/vue-admin-php/public/index.php'
// var routerMode = 'history'
var routerMode = ''
var imgBaseUrl = 'http://localhost/vue-admin-php/public'
if (process.env.NODE_ENV === 'development') {
    imgBaseUrl = 'http://localhost/vue-admin-php/public'
}
export {
    baseUrl,
    routerMode,
    imgBaseUrl
}
