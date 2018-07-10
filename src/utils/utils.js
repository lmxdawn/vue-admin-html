import Cookies from 'js-cookie'
/**
 * 存储localStorage
 */
export const setStore = (name, content) => {
    if (!name) return
    if (typeof content !== 'string') {
        content = JSON.stringify(content)
    }
    Cookies.set(name, content)
}

/**
 * 获取localStorage
 */
export const getStore = name => {
    if (!name) return
    let content = Cookies.get(name)
    try {
        content = JSON.parse(content)
        return content
    } catch (e) {
        return content
    }
}

/**
 * 删除localStorage
 */
export const removeStore = name => {
    if (!name) return
    Cookies.remove(name)
}
