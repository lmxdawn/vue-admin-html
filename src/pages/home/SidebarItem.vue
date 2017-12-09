<!--<template>-->
    <!--<div class='menu-wrapper'>-->

        <!--&lt;!&ndash;<template v-for="(item,i) in routes">&ndash;&gt;-->
        <!--&lt;!&ndash;<template v-if="item.children">&ndash;&gt;-->
        <!--&lt;!&ndash;<el-submenu :index="item.path+'/'+item.children[0].path">&ndash;&gt;-->
        <!--&lt;!&ndash;<template slot="title"><i :class="item.icon ? item.icon : ''"></i>{{item.name}}</template>&ndash;&gt;-->


        <!--&lt;!&ndash;<template v-for="(subItem,i1) in item.children">&ndash;&gt;-->
        <!--&lt;!&ndash;<template v-if="subItem.children">&ndash;&gt;-->
        <!--&lt;!&ndash;<el-submenu :index="item.path + '/' + subItem.path + '/' + subItem.children[0].path">&ndash;&gt;-->
        <!--&lt;!&ndash;<template slot="title"><i :class="subItem.icon ? subItem.icon : ''"></i>{{subItem.name}}</template>&ndash;&gt;-->

        <!--&lt;!&ndash;<template v-if="subItem.children">&ndash;&gt;-->
        <!--&lt;!&ndash;<el-menu-item v-for="(subItemItem,i2) in subItem.subs" :key="i2" :index="item.path + '/' + subItem.path + '/' + subItemItem.path">&ndash;&gt;-->
        <!--&lt;!&ndash;<template slot="title"><i :class="subItemItem.icon ? subItemItem.icon : ''"></i>{{subItemItem.name}}</template>&ndash;&gt;-->
        <!--&lt;!&ndash;</el-menu-item>&ndash;&gt;-->
        <!--&lt;!&ndash;</template>&ndash;&gt;-->

        <!--&lt;!&ndash;</el-submenu>&ndash;&gt;-->
        <!--&lt;!&ndash;</template>&ndash;&gt;-->

        <!--&lt;!&ndash;<template v-else>&ndash;&gt;-->
        <!--&lt;!&ndash;<el-menu-item :index="item.path + '/' + subItem.path">&ndash;&gt;-->
        <!--&lt;!&ndash;<i :class="subItem.icon ? subItem.icon : ''"></i>{{ subItem.name }}&ndash;&gt;-->
        <!--&lt;!&ndash;</el-menu-item>&ndash;&gt;-->
        <!--&lt;!&ndash;</template>&ndash;&gt;-->
        <!--&lt;!&ndash;</template>&ndash;&gt;-->

        <!--&lt;!&ndash;</el-submenu>&ndash;&gt;-->
        <!--&lt;!&ndash;</template>&ndash;&gt;-->
        <!--&lt;!&ndash;<template v-else>&ndash;&gt;-->
        <!--&lt;!&ndash;<el-menu-item :index="item.path">&ndash;&gt;-->
        <!--&lt;!&ndash;<template slot="title"><i :class="item.icon ? item.icon : ''"></i>{{item.name}}</template>&ndash;&gt;-->
        <!--&lt;!&ndash;</el-menu-item>&ndash;&gt;-->
        <!--&lt;!&ndash;</template>&ndash;&gt;-->
        <!--&lt;!&ndash;</template>&ndash;&gt;-->

        <!--<template v-for="(item,i) in routes">-->
            <!--<template v-if="item.children">-->
                <!--<el-submenu :index="item.path+'/'+item.children[0].path">-->
                    <!--<template slot="title"><i :class="item.icon ? item.icon : ''"></i>{{item.path}}-{{item.name}}</template>-->

                    <!--<template v-for="subChild in item.children">-->
                        <!--<sidebar-item :routes='[subChild]'></sidebar-item>-->
                    <!--</template>-->

                <!--</el-submenu>-->
            <!--</template>-->
            <!--<template v-else>-->
                <!--<el-menu-item :index="item.path">-->
                    <!--<template slot="title"><i :class="item.icon ? item.icon : ''"></i>{{item.path}}-{{item.name}}</template>-->
                <!--</el-menu-item>-->
            <!--</template>-->
        <!--</template>-->


    <!--</div>-->
<!--</template>-->

<!--<script>-->
    <!--export default {-->
        <!--name: 'SidebarItem',-->
        <!--props: {-->
            <!--routes: {-->
                <!--type: Array-->
            <!--}-->
        <!--}-->
    <!--}-->
<!--</script>-->

<template>
    <div class='menu-wrapper'>
        <template v-for="item in routes">

            <router-link v-if="!item.hidden&&item.noDropdown&&item.children.length>0" :to="item.path+'/'+item.children[0].path">
                <el-menu-item :index="item.path+'/'+item.children[0].path">
                    <icon-svg v-if='item.icon' :icon-class="item.icon"></icon-svg><span>{{item.children[0].name}}</span>
                </el-menu-item>
            </router-link>

            <el-submenu :index="item.path" v-if="!item.noDropdown&&!item.hidden">
                <template slot="title">
                    <icon-svg v-if='item.icon' :icon-class="item.icon"></icon-svg><span>{{item.name}}</span>
                </template>
                <template v-for="child in item.children" v-if='!child.hidden'>

                    <sidebar-item v-if='child.children&&child.children.length>0' :routes='[child]'> </sidebar-item>

                    <router-link v-else :to="item.path+'/'+child.path">
                        <el-menu-item :index="item.path+'/'+child.path">
                            <icon-svg v-if='item.icon' :icon-class="item.icon"></icon-svg><span>{{child.name}}</span>
                        </el-menu-item>
                    </router-link>

                </template>

            </el-submenu>

        </template>
    </div>
</template>

<script>
    export default {
        name: 'SidebarItem',
        props: {
            routes: {
                type: Array
            }
        }
    }
</script>



