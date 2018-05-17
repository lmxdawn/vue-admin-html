<template>
    <div class="common-upload-image-list">
        <ul class="list">
            <li v-for="item in list">
                <img :src="item.baseUrl + item.url" @click="uploadImageSelect(item)">
            </li>
        </ul>
    </div>
</template>

<!--上传的文件资源-->
<script>
    export default {
        name: 'upload-image-list',
        props: {
            list: Array
        },
        methods: {
            uploadImageSelect (item) {
                this.$emit('uploadImageListImageSelect', item)
            }
        },
        computed: {
        }
    }
</script>

<style lang="scss" scoped>
    .common-upload-image-list {
        width: 100%;
        height: 100%;
        overflow-x: hidden;
        overflow-y: auto;
        position: relative;
        padding: 10px 0 0 0;
        .list {
            list-style: none;
            margin: 0;
            padding: 0;
            li {
                float: left;
                display: block;
                list-style: none;
                padding: 0;
                margin: 0 0 9px 9px;
                background-color: #eee;
                overflow: hidden;
                cursor: pointer;
                position: relative;
                img {
                    margin-left: 0;
                    cursor: pointer;
                    min-width: 113px;
                    min-height: 113px;
                    max-width: 250px;
                }
            }
        }
    }
</style>
