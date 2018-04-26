/**
 * 配置编译环境和线上环境之间的切换
 *
 * baseUrl: 域名地址
 * routerMode: 路由模式
 * imgBaseUrl: 图片所在域名地址
 *
 */
var baseUrl = process.env.API_BASE
var uploadBaseUrl = baseUrl
var uploadImgUrl = uploadBaseUrl + '/admin/upload/img'
// var routerMode = 'history'
var routerMode = ''
var imgBaseUrl = baseUrl
export {
    baseUrl,
    uploadBaseUrl,
    uploadImgUrl,
    routerMode,
    imgBaseUrl
}
