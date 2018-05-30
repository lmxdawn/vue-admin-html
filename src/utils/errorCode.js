
// 错误码

// +----------------------------------------------------------------------
// | 系统级错误码
// +----------------------------------------------------------------------
export const $NOT_NETWORK = 10001 // 网络繁忙

// +----------------------------------------------------------------------
// | 服务级错误码
// +----------------------------------------------------------------------
export const HTTP_METHOD_NOT_ALLOWED = 20001 // 网络请求不予许
export const VALIDATION_FAILED = 20002 // 身份验证失败
export const USER_AUTH_FAIL = 20003 // 用户名或者密码错误
export const USER_NOT_PERMISSION = 20004 // 当前没有权限登录
export const AUTH_FAILED = 20005 // 权限验证失败
export const LOGIN_FAILED = 20006 // 登录失效
export const DATA_CHANGE = 20007 // 数据没有任何更改
export const DATA_REPEAT = 20008 // 数据重复
export const DATA_NOT = 20009 // 数据不存在
