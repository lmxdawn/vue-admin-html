<template>
    <div>
        <upload-image-list :uploadQuery="uploadQuery" @uploadImageListImageSelect="uploadImageSelect"></upload-image-list>
    </div>
</template>


<script>
    import UploadImageList from '../../components/common/UploadImageList.vue'
    export default {
        data () {
            return {
                msg: '我的',
                uploadQuery: {
                    scene: '', // 上传文件的场景值
                    page: 0,
                    limit: 2
                }
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
