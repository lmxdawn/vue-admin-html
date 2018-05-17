<template>
    <div>
        <upload-image-list :list="list" @uploadImageListImageSelect="uploadImageSelect"></upload-image-list>
    </div>
</template>


<script>
    import UploadImageList from '../../components/common/UploadImageList.vue'
    export default {
        data () {
            return {
                msg: '我的',
                list: [
                    {
                        'baseUrl': 'http://www.shuangkai.com/',
                        'url': 'ueditor/php/upload/image/20170825/1503632707138910.png',
                        'mtime': 1503632707
                    },
                    {
                        'baseUrl': 'http://www.shuangkai.com/',
                        'url': 'ueditor/php/upload/image/20180517/1526555074.png',
                        'mtime': 1503632700
                    },
                    {
                        'baseUrl': 'http://www.shuangkai.com/',
                        'url': 'ueditor/php/upload/image/20170825/1503632700266323.png',
                        'mtime': 1503632700
                    }
                ]
            }
        },
        components: {
            UploadImageList
        },
        methods: {
            uploadImageSelect (item) {
                alert('选择图片' + item.url)
                console.log(item)
            }
        },
        mounted () {
        }
    }
</script>


<style>

</style>
