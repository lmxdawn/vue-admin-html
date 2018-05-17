<template>
    <div>
        <div class="common-upload-image-list">
            <ul class="list">
                <li v-for="item in uploadList">
                    <img :src="item.image_url" @click="uploadImageSelect(item)">
                </li>
            </ul>
        </div>

        <el-pagination
            :page-size="uploadQuery.limit"
            @current-change="handleCurrentChange"
            layout="prev, pager, next"
            :total="total">
        </el-pagination>
    </div>
</template>

<!--上传的文件资源-->
<script>
    import { uploadList } from '../../api/upload'
    export default {
        name: 'upload-image-list',
        data () {
            return {
                total: 0,
                uploadList: []
            }
        },
        props: {
            uploadQuery: {
                scene: String, // 上传文件的场景值
                page: Number,
                limit: Number
            }
        },
        methods: {
            getList () {
                uploadList(this.uploadQuery).then(response => {
                    this.uploadList = response.data || []
                    this.total = response.total || 0
                }).catch(() => {
                })
            },
            handleCurrentChange (val) {
                this.uploadQuery.page = val
                this.getList()
            },
            uploadImageSelect (item) {
                this.$emit('uploadImageListImageSelect', item)
            }
        },
        created () {
            this.getList()
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
