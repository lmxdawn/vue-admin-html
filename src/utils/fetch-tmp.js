/* eslint-disable one-var */
import { baseUrl } from '../../config/env'

export default (url = '', data = {}, type = 'GET', cb, method = 'fetch') => {
    type = type.toUpperCase()
    url = baseUrl + url

    if (type === 'GET' && data.length > 0) {
        // 数据拼接字符串
        let dataStr = '', index = 0
        Object.keys(data).forEach(key => {
            dataStr += ((index !== 0) ? '&' : '') + key + '=' + data[key]
            index++
        })

        if (dataStr !== '') {
            url = url + '?' + dataStr
        }
    }

    if (window.XMLHttpRequest) {} else {
        let err = '浏览器不支持'
        cb(err, null)
        return false
    }
    let requestObj = new XMLHttpRequest()
    let sendData = ''
    if (type === 'POST') {
        sendData = JSON.stringify(data)
    }
    requestObj.open(type, url, true)
    requestObj.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
    requestObj.send(sendData)

    requestObj.onreadystatechange = () => {
        if (requestObj.readyState === 4 && requestObj.status === 200) {
            let obj = requestObj.response
            try {
                obj = JSON.parse(obj)
                cb(null, obj)
                return false
            } catch (err) {
                cb(err, null)
            }
        }
    }

    // if (window.fetch && method === 'fetch') {
    //   let requestConfig = {
    //     credentials: 'include',
    //     method: type,
    //     headers: {
    //       'Accept': 'application/json',
    //       'Content-Type': 'application/json'
    //     },
    //     mode: 'cors',
    //     cache: 'force-cache'
    //   }
    //
    //   if (type === 'POST') {
    //     Object.defineProperty(requestConfig, 'body', {
    //       value: JSON.stringify(data)
    //     })
    //   }
    //
    //   try {
    //     const response = await fetch(url, requestConfig)
    //     const responseJson = await response.json()
    //     return responseJson
    //   } catch (error) {
    //     throw new Error(error)
    //   }
    // } else {
    //   return new Promise((resolve, reject) => {
    //     let requestObj
    //     if (window.XMLHttpRequest) {
    //       requestObj = new XMLHttpRequest()
    //     } else {
    //       alert('浏览器不支持')
    //       return false
    //     }
    //     let sendData = ''
    //     if (type === 'POST') {
    //       sendData = JSON.stringify(data)
    //     }
    //     requestObj.open(type, url, true)
    //     requestObj.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
    //     requestObj.send(sendData)
    //
    //     requestObj.onreadystatechange = () => {
    //       if (requestObj.readyState === 4) {
    //         if (requestObj.status === 200) {
    //           let obj = requestObj.response
    //           if (typeof obj !== 'object') {
    //             obj = JSON.parse(obj)
    //           }
    //           resolve(obj)
    //         } else {
    //           reject(requestObj)
    //         }
    //       }
    //     }
    //   })
    // }
}
