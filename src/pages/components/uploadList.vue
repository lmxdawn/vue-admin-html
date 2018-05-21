<template>
    <div>
        <el-button type="text" @click="dialogVisible = true">点击打开 上传插件</el-button>
        <el-dialog
            title="上传插件"
            :visible.sync="dialogVisible"
            width="80%">
            <upload-file
                :uploadUrl="uploadUrl"
                :isAll="true"
                :fileExt="fileExt"
                :size="200000"
                :limit="6"
                @uploadFileSelectAll="uploadImageSelect">
            </upload-file>
        </el-dialog>
    </div>

</template>


<script>
    import UploadFile from '../../components/common/UploadFile.vue'
    import { baseUrl } from '../../../config/env'
    export default {
        data () {
            return {
                uploadUrl: baseUrl + '/admin/upload/newFile',
                fileExt: 'jpg,png,gif',
                dialogVisible: false
            }
        },
        components: {
            UploadFile
        },
        methods: {
            uploadImageSelect (item) {
                console.log(item)
            },
            handleClose (done) {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        done()
                    })
                    .catch(_ => {})
            }
        },
        mounted () {
        }
    }
</script>


<style lang="scss">

</style>
