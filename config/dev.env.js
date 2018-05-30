'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

// API_SUFFIX ：API接口后缀
module.exports = merge(prodEnv, {
    NODE_ENV: '"development"',
    API_SUFFIX: '""',
    API_BASE: '"http://localhost/vue-admin-php/public/index.php"',
})
