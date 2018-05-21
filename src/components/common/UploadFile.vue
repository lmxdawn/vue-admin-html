<template>
    <div style="padding: 10px;">
        <div style="width: 100%;">
            <el-button type="primary" size="small" icon="el-icon-refresh" @click="getList"></el-button>
            <span></span>
            <el-button size="small" type="primary" icon="el-icon-plus" @click="newDir">新建文件夹</el-button>
            <el-popover
                placement="top"
                title="上传"
                width="100%"
                v-model="uploadVisible"
                trigger="click">
                <el-upload
                    style="max-width: 300px;overflow-x: hidden;"
                    class="upload-demo"
                    ref="upload"
                    :action="uploadUrl"
                    :on-preview="handlePreview"
                    :on-success="handleSuccess"
                    :on-error="handleError"
                    :file-list="fileList"
                    :data="uploadData"
                    :name="uploadData.uploadName"
                    :accept="uploadData.exts"
                    :on-change="beforeChange"
                    :before-upload="beforeUpload"
                    :auto-upload="false">
                    <el-button slot="trigger" size="small" type="primary" icon="el-icon-upload2">选取文件</el-button>
                    <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器
                    </el-button>
                    <div slot="tip" class="el-upload__tip">只能上传{{ this.uploadData.exts }}文件，且不超过{{ this.uploadData.size | renderSize }}</div>
                </el-upload>
                <el-button slot="reference" size="small" type="primary" icon="el-icon-upload">上传文件</el-button>
            </el-popover>
        </div>
        <ul class="breadcrumb-list">
            <li v-if="pathBreadcrumbs.length > 0">
                <a href="javascript:;" @click="breadcrumbGoBack">返回上一级</a>
                <span class="shufenge">|</span>
            </li>
            <li>
                <a v-if="pathBreadcrumbs.length > 0" href="javascript:;" title="全部文件"
                   @click="breadcrumbClick(null)">全部文件</a>
                <span v-else="" class="none-path" title="全部文件">全部文件</span>
                <template v-for="(item, index) in pathBreadcrumbs">
                    <span class="shufenge">&gt;</span>
                    <a v-if="query.pathName && query.pathName !== item.path" href="javascript:;" :title="'全部文件/' + item.title"
                       @click="breadcrumbClick(index)">{{ item.filename }}</a>
                    <span v-else="" class="none-path" :title="item.title">{{ item.filename }}</span>
                </template>
            </li>
        </ul>
        <el-table
            ref="uploadTable"
            highlight-current-row
            :data="uploadList"
            @scroll="tableScroll"
            @selection="handleSelection"
            @selection-change="handleSelectionChange"
            style="width: 100%; height: 100%;">
            <el-table-column
                v-if="isAll"
                type="selection"
                width="55">
            </el-table-column>
            <el-table-column
                prop="filename"
                label="文件名"
                width="400">
                <template slot-scope="scope">
                    <a class="file-type-icon"
                       :href="scope.row.is_dir === 1 ? 'javascript:;' : scope.row.url"
                       :title="scope.row.is_dir === 1 ? '' : '点击查看'"
                       target="_blank"
                       :class="scope.row.className ? scope.row.className : 'dir-small'"></a>
                    <div v-if="scope.row.edit" style="display: inline-block">
                        <el-input ref="newDirInput"
                                  class="edit-input"
                                  size="mini"
                                  v-model="scope.row.filename"
                                  @focus="newDirFocus($event)"></el-input>
                        <el-button class='new-dir-btn'
                                   size="mini"
                                   icon="el-icon-check"
                                   @click="newDirOk(scope.$index, scope.row)"></el-button>
                        <span></span>
                        <el-button class='new-dir-btn'
                                   size="mini" icon="el-icon-close"
                                   @click="newDirCancel(scope.$index, scope.row)"></el-button>
                    </div>
                    <span v-else class="filename"
                          :title="scope.row.filename"
                          @click="selectFile(scope.row)">{{ scope.row.filename }}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="大小"
                width="130">
                <template slot-scope="scope">
                    <span v-if="!scope.row.size || scope.row.size == 0">-</span>
                    <span v-else="">{{ scope.row.size | renderSize}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="修改日期"
                width="180">
                <template slot-scope="scope">
                    <span v-if="scope.row.mtime">{{ scope.row.mtime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
                    <span v-else="">-</span>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination
            :page-size="query.size"
            @current-change="handleCurrentChange"
            layout="prev, pager, next"
            :total="total">
        </el-pagination>

        <div style="margin-top: 20px">
            <el-button @click="allOK()" type="primary">确认选择</el-button>
        </div>

    </div>
</template>

<!--上传的文件资源-->
<script>
    import { uploadList, uploadNewDir } from '../../api/upload'
    import { py } from '../../utils/haiZiToPinYin'
    import { renderSize } from '../../filtres/index'

    function pathBreadcrumbsFormat (pathBreadcrumbs) {
        var str = ''
        for (var i in pathBreadcrumbs) {
            str += pathBreadcrumbs[i].filename + '/'
        }
        str = str.substring(0, str.length - 1)
        return str
    }

    export default {
        name: 'upload-file',
        data () {
            return {
                uploadVisible: false,
                newDirVisible: false,
                inputPath: '',
                total: 0,
                uploadList: [],
                uploadData: {
                    uploadName: 'file',
                    pathName: '',
                    pinYinName: '', // 如果是带有中文，则这里把中文转化为拼音给服务端
                    exts: 'jpg,png,gif',
                    size: 0
                },
                fileList: [],
                pathBreadcrumbs: [],
                query: {
                    pathName: '',
                    size: 15,
                    page: 0
                },
                selectList: [],
                multipleSelection: []
            }
        },
        props: {
            uploadUrl: String, // 上传的地址
            isAll: false, // 是否可多选
            size: Number, // 允许上传的文件大小
            fileExt: String, // 允许上传的文件后缀
            limit: Number // 没页显示多少
        },
        mounted () {
            window.addEventListener('scroll', this.tableScroll)
        },
        methods: {
            tableScroll (e) {
                console.log(e)
            },
            // 创建文件夹
            newDir () {
                if (this.newDirVisible) {
                    return
                }
                var obj = {
                    filename: 'newDir',
                    edit: true
                }
                this.uploadList.unshift(obj)
                this.newDirVisible = true
                var self = this
                setTimeout(function () {
                    if (self.$refs.newDirInput) {
                        self.$refs.newDirInput.focus()
                    }
                }, 100)
            },
            // 取消创建
            newDirCancel (index, row) {
                this.uploadList.splice(index, 1)
                this.newDirVisible = false
            },
            // 确认创建
            newDirOk (index, row) {
                if (row.filename && /.*[\u4e00-\u9fa5]+.*$/.test(row.filename)) {
                    var pinyin = py(row.filename)
                    this.$confirm('检测到有中文，系统自动转为 ' + pinyin + ' 是否继续？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        // 转换后提交
                        this.newDirHttp(row.filename)
                    }).catch(() => {
                    })
                    return
                }
                // 没有中文直接提交
                this.newDirHttp(row.filename)
            },
            newDirHttp (filename) {
                if (filename !== '' && filename !== 'null' && filename !== 'undefined') {
                    var data = {
                        pathName: this.uploadData.pathName,
                        filename: filename
                    }
                    uploadNewDir(data).then(response => {
                        if (response.errcode) {
                            this.$message({
                                message: response.errmsg,
                                type: 'error'
                            })
                            return
                        }
                        this.uploadList.splice(this.index, 1, response)
                    }).catch(() => {
                    })
                }
                this.newDirVisible = false
            },
            // 获得焦点时选中所有值
            newDirFocus (event) {
                event.currentTarget.select()
            },
            /**
             * 选择某个文件
             * @param row
             */
            selectFile (row) {
                // 文件夹
                if (row.is_dir === 1) {
                    var str = pathBreadcrumbsFormat(this.pathBreadcrumbs)
                    var filename = row.filename
                    var path = str !== '' ? str + '/' + filename : filename
                    var obj = {
                        title: path,
                        path: path,
                        filename: filename
                    }
                    this.pathBreadcrumbs.push(obj)
                    this.query.pathName = path
                    this.uploadData.pathName = path
                    this.getList()
                    return
                }
                // 选择单个文件，并且文件后缀
                if (!this.isAll) {
                    if (this.uploadData.exts.indexOf(row.fileExt) <= 0) {
                        // 不在允许后缀中
                        this.$message.error('文件只能为 ' + this.uploadData.exts + '格式!')
                        return
                    }
                    this.selectList = [
                        row
                    ]
                    this.uploadFileSelect()
                }
            },
            allOK () {
                this.selectList = []
                if (this.multipleSelection.length > 0) {
                    var multipleSelection = this.multipleSelection
                    for (var i in multipleSelection) {
                        var item = multipleSelection[i]
                        // 如果在扩展列表中，并且不是文件夹
                        if (item.fileExt && this.uploadData.exts && this.uploadData.exts.length > 0 && this.uploadData.exts.indexOf(item.fileExt) >= 0 && item.is_dir === 0) {
                            this.selectList.push(item)
                        }
                    }
                }
                console.log(this.selectList)
                this.uploadFileSelect()
            },
            handleSelection (val) {
                this.multipleSelection = val
            },
            handleSelectionChange (val) {
                this.multipleSelection = val
            },
            getList () {
                uploadList(this.query).then(response => {
                    this.uploadList = response.list || []
                    this.total = response.total || 0
                }).catch(() => {
                })
            },
            /**
             * 选择某个面包屑
             */
            breadcrumbClick (index) {
                if (index === null || index === '') {
                    // 如果不传值表示初始化
                    this.pathBreadcrumbs = []
                } else {
                    var item = []
                    for (var i in this.pathBreadcrumbs) {
                        if (i <= index) {
                            item.push(this.pathBreadcrumbs[i])
                        }
                    }
                    this.pathBreadcrumbs = item
                }
                var str = pathBreadcrumbsFormat(this.pathBreadcrumbs)
                this.query.pathName = str
                this.uploadData.pathName = str
                this.getList()
            },
            // 返回上一级
            breadcrumbGoBack () {
                if (this.pathBreadcrumbs.length <= 0) {
                    return false
                }
                this.pathBreadcrumbs.pop()
                var str = ''
                for (var i in this.pathBreadcrumbs) {
                    str += i === 0 ? this.pathBreadcrumbs[i].filename + '/' : this.pathBreadcrumbs[i].filename
                }
                this.query.pathName = str
                this.uploadData.pathName = str
                this.getList()
            },
            uploadFileSelect () {
                this.$emit('uploadFileSelectAll', this.selectList)
            },
            submitUpload () {
                this.$refs.upload.submit()
            },
            /**
             * 分页的点击
             * @param val
             */
            handleCurrentChange (val) {
                this.query.page = val
                this.getList()
            },
            handlePreview (file) {
                console.log(file)
            },
            handleSuccess (response, file, fileList) {
                this.uploadData.pinYinName = ''
                if (response.errcode) {
                    this.$message({
                        message: response.errmsg,
                        type: 'error'
                    })
                }
                for (var i = 0; i < fileList.length; i++) {
                    var tempFile = fileList[i]
                    if (file.uid === tempFile.uid) {
                        fileList.splice(i, 1)
                    }
                }
                if (response.path) {
                    this.uploadList.unshift(response)
                    this.$refs.uploadTable.setCurrentRow() // 先取消
                    this.$refs.uploadTable.setCurrentRow(response)
                }
                if (fileList.length <= 0) {
                    // 上传完成
                    this.uploadVisible = false
                }
            },
            handleError (err, file, fileList) {
                this.uploadData.pinYinName = ''
                console.log(err)
                for (var i = 0; i < fileList.length; i++) {
                    var tempFile = fileList[i]
                    if (file.uid === tempFile.uid) {
                        fileList.splice(i, 1)
                    }
                }
            },
            // 选择文件时
            beforeChange (file, fileList) {
                var name = file.name ? file.name : ''
                var ext = name ? name.substr(name.lastIndexOf('.') + 1, name.length) : true
                var isExt = this.uploadData.exts.indexOf(ext) < 0
                if (isExt) {
                    this.$message.error('文件只能为 ' + this.uploadData.exts + ' 格式!')
                }
                var isSize = this.uploadData.size > 0 && file.size > this.uploadData.size
                var sizeStr = this.uploadData.size
                if (isSize) {
                    this.$message.error('上传文件不能超过 ' + renderSize(sizeStr) + '!')
                }
                if (isExt || isSize) {
                    for (var i = 0; i < fileList.length; i++) {
                        var tempFile = fileList[i]
                        if (file.uid === tempFile.uid) {
                            fileList.splice(i, 1)
                        }
                    }
                } else {
                    var isZhongWen = /.*[\u4e00-\u9fa5]+.*$/.test(name)
                    var time = 0
                    var self = this
                    if (isZhongWen) {
                        name = py(name)
                        file.name = name.replace(/\s/g, '') // 去掉所有空格
                        setTimeout(function () {
                            self.$notify({
                                title: '提示',
                                message: '检测到有中文，自动转换为 ' + name,
                                type: 'warning',
                                duration: 10000 // 10 秒后
                            })
                        }, time)
                    }
                }
                return false
            },
            // 上传文件时
            beforeUpload (file) {
                var name = file.name
                var isZhongWen = /.*[\u4e00-\u9fa5]+.*$/.test(name)
                if (isZhongWen) {
                    name = py(name)
                    this.uploadData.pinYinName = name
                }
            }
        },
        created () {
            this.getList()
            if (this.size) {
                this.uploadData.size = this.size
            }
            if (this.limit) {
                this.query.size = this.limit
            }
            if (this.fileExt && this.fileExt !== '' && this.fileExt !== 'undefined') {
                this.uploadData.exts = this.fileExt
            }
        },
        computed: {}
    }
</script>

<style lang="scss" scoped>
    .edit-input {
        margin-left: 10px;
        width: 200px;
    }

    .new-dir-bth {
        position: absolute;
        right: 15px;
        top: 10px;
    }

    .breadcrumb-list {
        padding-left: 5px;
        background: #fff;
        height: 16px;
        line-height: 16px;
        overflow: hidden;
        white-space: nowrap;
        margin-top: 10px;
        li {
            float: left;
            list-style: none;
            margin: 0;
            padding: 0;
        }
        a {
            color: #4287ed;
            text-decoration: none;
            outline: 0;
            display: inline-block;
            max-width: 105px;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            float: left;
            &:hover {
                text-decoration: underline
            }
        }
        .none-path {
            color: #666666;
            display: inline-block;
            max-width: 200px;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
        }
        .shufenge {
            float: left;
            padding: 0 3px;
            color: #c5d8f3;
        }
    }

    .filename {
        cursor: pointer;
        float: left;
        margin-left: 10px;
        max-width: 80%;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        line-height: 26px;
        color: #666666;
        &:hover {
            text-decoration: none;
            color: #3B8CFF;
        }
        &:active {
            text-decoration: none;
            color: #3B8CFF;
        }
    }

    .file-type-icon {
        float: left;
        height: 26px;
        width: 26px;
        background-image: url("../../assets/image/file_type_icon.png");
        &.default-small {
            background-position: -596px -566px;
        }
        &.web {
            background-position: -594px -1458px;
        }
        &.dir-small {
            background-position: -594px -862px;
        }
        &.fileicon-sys-s-code {
            background-position: -596px -1424px;
        }
        &.fileicon-small-txt {
            background-position: -596px -102px;
        }
        &.fileicon-small-pic {
            background-position: -596px -306px;
        }
        &.fileicon-small-zip {
            background-position: -596px -1664px;
        }
    }
</style>
