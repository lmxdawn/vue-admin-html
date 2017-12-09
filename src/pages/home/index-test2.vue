<template>
    <el-container class="main" v-bind:class="{ 'slide-in-left': menuShow }">
        <el-aside style="background-color: rgb(238, 241, 246)" class="menu" width="">
            <el-menu :default-active="onRoutes" class="el-menu-vertical-demo" theme="dark" unique-opened router>
                <sidebar-item :routes='routers'></sidebar-item>

            </el-menu>
        </el-aside>
        <el-container>
            <el-header style="text-align: right; font-size: 12px">
                <div class="header-left">
                    <div class="header-toggle" @click="menuShow = !menuShow">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
                <div class="header-middle">
                    <el-breadcrumb class="app-levelbar" separator="/">
                        <el-breadcrumb-item v-for="(item,index)  in levelList" :key="item.path">
                            <span v-if='item.redirect==="noredirect"||index==levelList.length-1'
                                  class="no-redirect">{{item.name}}</span>
                            <router-link v-else :to="item.redirect||item.path">{{item.name}}</router-link>
                        </el-breadcrumb-item>
                    </el-breadcrumb>
                </div>
                <div class="header-right">
                    <el-dropdown>
                        <i class="el-icon-setting" style="margin-right: 15px"></i>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item>查看</el-dropdown-item>
                            <el-dropdown-item>新增</el-dropdown-item>
                            <el-dropdown-item>删除</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                    <span>{{username}}</span>
                </div>
            </el-header>

            <el-main>
                <transition name="move" mode="out-in"><router-view></router-view></transition>
            </el-main>
        </el-container>
    </el-container>
</template>


<script>
    import { mapGetters } from 'vuex'
    import SidebarItem from './SidebarItem.vue'
    export default {
        data () {
            const item = {
                date: '2016-05-02',
                name: '王小虎s',
                address: '上海市普陀区金沙江路 1518 弄'
            }
            return {
                tableData: Array(20).fill(item),
                menuShow: true,
                name: 'lmxdawn',
                levelList: null
            }
        },
        components: {
            SidebarItem
        },
        computed: {
            ...mapGetters({
                routers: 'routers'
            }),
            onRoutes () {
                return this.$route.path.replace('/', '')
            },
            username () {
                let username = localStorage.getItem('ms_username')
                return !username ? this.name : username
            }
        },
        mounted () {
        },
        methods: {
            getBreadcrumb () {
                let matched = this.$route.matched.filter(item => item.name)
                const first = matched[0]
                if (first && (first.name !== '首页' || first.path !== '')) {
                    matched = [{name: '首页', path: '/'}].concat(matched)
                }
                this.levelList = matched
            }
        },
        created () {
            this.getBreadcrumb()
        },
        watch: {
            $route () {
                this.getBreadcrumb()
            }
        }
    }
</script>


<style lang="scss" scoped>

    html {
        height: 100%;
    }

    .el-header {
        background-color: #B3C0D1;
        color: #333;
        line-height: 60px;
    }

    .el-aside {
        color: #333;
    }

    .el-main {
        padding: .1333rem;
    }
    .move-enter-active,.move-leave-active{
        transition: opacity .5s;
    }
    .move-enter,.move-leave{
        opacity: 0;
    }

    .main {
        height: 100%;
        transition: -webkit-transform .3s ease-in-out;
        transition: transform .3s ease-in-out, -webkit-transform .3s ease-in-out;
    }

    .menu {
        width: 3.3333rem;
        padding-left: 0;
        overflow-x: hidden;
        overflow-y: auto;
        height: 100%;
    }

    .header-left {
        height: 100%;
        float: left;
    }

    .header-middle {
        height: 100%;
        float: left;
    }

    .app-levelbar {
        height: 100%;
    }

    .app-levelbar.el-breadcrumb {
        display: inline-block;
        font-size: 14px;
        line-height: 60px;
        margin-left: 10px;

        .no-redirect {
            color: #97a8be;
            cursor: text;
        }
    }

    .header-right {
        height: 100%;
        float: right;
    }

    @media screen and (max-width: 768px) {
        .menu {
            left: 0;
            margin-left: -60%;
            margin-right: 0;
            opacity: 1;
            position: absolute;
            top: 0;
            transition: opacity .3s;
            width: 60%;
            z-index: 10;
            min-width: auto;
            padding: 0;
        }

        .slide-in-left {
            min-width: 0;
            opacity: 1;
            -webkit-transform: translate3d(60%, 0, 0);
            transform: translate3d(60%, 0, 0)
        }

        .header-toggle {
            display: block;
            background-color: #26a2ff;
            border-radius: 4px;
            border: 1px solid #fff;
            height: 40px;
            margin: 10px 0;
            padding: 2px 6px;
            outline: none;
            width: 40px;
            z-index: 10;
        }

        .header-toggle span {
            display: block;
            width: 100%;
            height: 2px;
            margin: 7px auto;
            background-color: #fff;
        }

    }
</style>
