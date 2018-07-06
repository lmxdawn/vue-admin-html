<template>
    <div>
        <el-button type="text" @click="dialogVisible = true">点击打开 上传插件</el-button>
        <el-dialog
            title="上传插件"
            :visible.sync="dialogVisible"
            width="80%">
            <file-resource
                :uploadUrl="uploadUrl"
                :isAll="true"
                :fileExt="fileExt"
                :size="2000000"
                :limit="15"
                @resourceSelect="resourceSelect">
            </file-resource>
        </el-dialog>
    </div>

</template>


<script>
    import FileResource from '../../components/common/FileResource.vue'
    import { baseUrl } from '../../config/env'
    export default {
        data () {
            return {
                uploadUrl: baseUrl + '/admin/file_resource/add',
                fileExt: 'jpg,png,gif',
                dialogVisible: false
            }
        },
        components: {
            FileResource
        },
        methods: {
            resourceSelect (item) {
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
