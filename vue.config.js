module.exports = {
    baseUrl: process.env.NODE_ENV === "production" ? "./" : "/",
    outputDir: process.env.outputDir,
    configureWebpack: {
        externals: {
            vue: "Vue",
            vuex: "Vuex",
            "vue-router": "VueRouter",
            "element-ui": "ELEMENT"
        }
    }
};
