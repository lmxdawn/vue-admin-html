<template>
    <div style="padding: 10px;">
        <div style="width: 100%;">
            <el-button type="primary" size="small" icon="el-icon-refresh" @click="getList"></el-button>
            <el-button type="primary" size="small" @click="isIcon = !isIcon">{{ isIcon ? '列表' : '图标' }}</el-button>
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

        <div v-if="isIcon" class="icon-lists">
            <template v-for="(item, index) in uploadList">
                <a href="#" class="item" :class="item.select ? 'select' : ''" :style="item.edit ? 'width: 150px;' : ''" @click="selectFile(item, index)">
                    <div class="app-icon" :class="item.className ? item.className : 'dir-small'">
                        <img  v-if="item.fileExt === 'png' || item.fileExt === 'jpg' || item.fileExt === 'gif'" :src="item.url"/>
                    </div>
                    <span class="title">
                        <template v-if="item.edit">
                            <input class="edit-input"
                                   v-model="item.filename"
                                   @focus="newDirFocus($event)"></input>
                            <span class="edit-btn" @click="newDirOk(index, item)">
                                <i class="el-icon-check"></i>
                            </span>
                            <span class="edit-btn" @click="newDirCancel(index)">
                                <i class="el-icon-close"></i>
                            </span>
                        </template>
                        <template v-else="">
                            <span>
                                {{ item.filename }}
                            </span>
                        </template>
                    </span>
                    <span v-if="isAll && item.is_dir !== 1 && !item.edit" class="circle-check">
                        <span class="el-icon-circle-check"></span>
                    </span>
                    <!--大图-->
                    <span v-if="item.fileExt === 'png' || item.fileExt === 'jpg' || item.fileExt === 'gif'" class="big-img">
                        <img :src="item.url"/>
                    </span>
                </a>
            </template>
            <template  v-if="uploadList.length <= 0">
                <div class="icon-list-empty">
                    暂无数据
                </div>
            </template>
        </div>


        <el-table
            v-else=""
            ref="uploadTable"
            highlight-current-row
            :data="uploadList"
            @scroll="tableScroll"
            style="width: 100%; height: 100%;">
            <el-table-column
                v-if="isAll"
                width="55">
                <template slot-scope="scope">
                    <el-checkbox :disabled="scope.row.is_dir === 1" v-model="scope.row.select" @click="selectFile(scope.row, scope.$index)"></el-checkbox>
                </template>
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
                                   @click="newDirCancel(scope.$index)"></el-button>
                    </div>
                    <span v-else class="filename"
                          :title="scope.row.filename"
                          @click="selectFile(scope.row, scope.$index)">{{ scope.row.filename }}</span>
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
import { uploadList, uploadNewDir } from "../../api/file/upload";
import { py } from "../../utils/haiZiToPinYin";
import { renderSize } from "../../filtres/index";

function pathBreadcrumbsFormat(pathBreadcrumbs) {
    let str = "";
    for (let i in pathBreadcrumbs) {
        str += pathBreadcrumbs[i].filename + "/";
    }
    str = str.substring(0, str.length - 1);
    return str;
}

export default {
    name: "upload-file",
    data() {
        return {
            uploadVisible: false,
            newDirVisible: false,
            inputPath: "",
            isIcon: true, // 是否以图标形式展示（列表 or 图标）
            total: 0,
            uploadList: [],
            uploadData: {
                uploadName: "file",
                pathName: "",
                pinYinName: "", // 如果是带有中文，则这里把中文转化为拼音给服务端
                exts: "jpg,png,gif",
                size: 0
            },
            fileList: [],
            pathBreadcrumbs: [],
            query: {
                pathName: "",
                size: 15,
                page: 0
            },
            selectList: []
        };
    },
    props: {
        uploadUrl: String, // 上传的地址
        isAll: false, // 是否可多选
        size: Number, // 允许上传的文件大小
        fileExt: String, // 允许上传的文件后缀
        limit: Number // 每页显示多少
    },
    mounted() {
    },
    methods: {
        // 创建文件夹
        newDir() {
            if (this.newDirVisible) {
                return;
            }
            let obj = {
                filename: "newDir",
                edit: true
            };
            this.uploadList.unshift(obj);
            this.newDirVisible = true;
            let self = this;
            setTimeout(function() {
                if (self.$refs && self.$refs.newDirInput) {
                    self.$refs.newDirInput.focus();
                }
            }, 100);
        },
        // 取消创建
        newDirCancel(index) {
            this.uploadList.splice(index, 1);
            this.newDirVisible = false;
        },
        // 确认创建
        newDirOk(index, row) {
            if (row.filename && /.*[\u4e00-\u9fa5]+.*$/.test(row.filename)) {
                let pinyin = py(row.filename);
                this.$confirm(
                    "检测到有中文，系统自动转为 " + pinyin + " 是否继续？",
                    "提示",
                    {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    }
                )
                    .then(() => {
                        // 转换后提交
                        this.newDirHttp(row.filename);
                    })
                    .catch(() => {});
                return;
            }
            // 没有中文直接提交
            this.newDirHttp(row.filename);
        },
        newDirHttp(filename) {
            if (
                filename !== "" &&
                filename !== "null" &&
                filename !== "undefined"
            ) {
                let data = {
                    pathName: this.uploadData.pathName,
                    filename: filename
                };
                uploadNewDir(data)
                    .then(response => {
                        if (response.code) {
                            this.$message({
                                message: response.message,
                                type: "error"
                            });
                            return;
                        }
                        this.uploadList.splice(this.index, 1, response.data);
                    })
                    .catch(() => {});
            }
            this.newDirVisible = false;
        },
        // 获得焦点时选中所有值
        newDirFocus(event) {
            event.currentTarget.select();
        },
        /**
         * 选择某个文件
         * @param row
         */
        selectFile(row, index) {
            if (row.edit) {
                return false;
            }
            // 文件夹
            if (row.is_dir === 1) {
                let str = pathBreadcrumbsFormat(this.pathBreadcrumbs);
                let filename = row.filename;
                let path = str !== "" ? str + "/" + filename : filename;
                let obj = {
                    title: path,
                    path: path,
                    filename: filename
                };
                this.pathBreadcrumbs.push(obj);
                this.query.pathName = path;
                this.uploadData.pathName = path;
                this.getList();
                return;
            }
            // 选择单个文件，并且文件后缀
            let exts = this.uploadData.exts.split(",");
            if (exts.indexOf(row.fileExt) < 0) {
                // 不在允许后缀中
                this.$message.error(
                    "文件只能为 " + this.uploadData.exts + "格式!"
                );
                return;
            }
            row.select = !row.select;
            // 如果不为全选模式
            if (!this.isAll) {
                this.selectList = [row];
                this.uploadFileSelect();
                return;
            }
            this.uploadList.splice(index, 1, row);
        },
        allOK() {
            this.selectList = [];
            if (this.uploadList.length > 0) {
                let uploadList = this.uploadList;
                let exts = this.uploadData.exts.split(",");
                for (let i in uploadList) {
                    let item = uploadList[i];
                    if (item.select && item.select === true) {
                        // 如果在扩展列表中，并且不是文件夹
                        if (
                            item.fileExt &&
                            exts.length > 0 &&
                            exts.indexOf(item.fileExt) !== -1 &&
                            item.is_dir === 0
                        ) {
                            this.selectList.push(item);
                        }
                    }
                }
            }
            this.uploadFileSelect();
        },
        getList() {
            uploadList(this.query)
                .then(response => {
                    this.uploadList = response.list || [];
                    this.total = response.total || 0;
                })
                .catch(() => {});
        },
        /**
         * 选择某个面包屑
         */
        breadcrumbClick(index) {
            if (index === null || index === "") {
                // 如果不传值表示初始化
                this.pathBreadcrumbs = [];
            } else {
                let item = [];
                for (let i in this.pathBreadcrumbs) {
                    if (i <= index) {
                        item.push(this.pathBreadcrumbs[i]);
                    }
                }
                this.pathBreadcrumbs = item;
            }
            let str = pathBreadcrumbsFormat(this.pathBreadcrumbs);
            this.query.pathName = str;
            this.uploadData.pathName = str;
            this.getList();
        },
        // 返回上一级
        breadcrumbGoBack() {
            if (this.pathBreadcrumbs.length <= 0) {
                return false;
            }
            this.pathBreadcrumbs.pop();
            let str = "";
            for (let i in this.pathBreadcrumbs) {
                str +=
                    i === 0
                        ? this.pathBreadcrumbs[i].filename + "/"
                        : this.pathBreadcrumbs[i].filename;
            }
            this.query.pathName = str;
            this.uploadData.pathName = str;
            this.getList();
        },
        uploadFileSelect() {
            this.$emit("uploadFileSelectAll", this.selectList);
        },
        submitUpload() {
            this.$refs.upload.submit();
        },
        /**
         * 分页的点击
         * @param val
         */
        handleCurrentChange(val) {
            this.query.page = val;
            this.getList();
        },
        handleSuccess(response, file, fileList) {
            this.uploadData.pinYinName = "";
            if (response.code) {
                this.$message({
                    message: response.message,
                    type: "error"
                });
            }
            for (let i = 0; i < fileList.length; i++) {
                let tempFile = fileList[i];
                if (file.uid === tempFile.uid) {
                    fileList.splice(i, 1);
                }
            }
            let data = response;
            if (data.path) {
                this.uploadList.unshift(data);
                this.$refs.uploadTable.setCurrentRow(); // 先取消
                this.$refs.uploadTable.setCurrentRow(data);
            }
            if (fileList.length <= 0) {
                // 上传完成
                this.uploadVisible = false;
            }
        },
        handleError(err, file, fileList) {
            this.uploadData.pinYinName = "";
            for (let i = 0; i < fileList.length; i++) {
                let tempFile = fileList[i];
                if (file.uid === tempFile.uid) {
                    fileList.splice(i, 1);
                }
            }
        },
        // 选择文件时
        beforeChange(file, fileList) {
            let name = file.name ? file.name : "";
            let ext = name
                ? name.substr(name.lastIndexOf(".") + 1, name.length)
                : true;
            let isExt = this.uploadData.exts.indexOf(ext) < 0;
            if (isExt) {
                this.$message.error(
                    "文件只能为 " + this.uploadData.exts + " 格式!"
                );
            }
            let isSize =
                this.uploadData.size > 0 && file.size > this.uploadData.size;
            let sizeStr = this.uploadData.size;
            if (isSize) {
                this.$message.error(
                    "上传文件不能超过 " + renderSize(sizeStr) + "!"
                );
            }
            if (isExt || isSize) {
                for (let i = 0; i < fileList.length; i++) {
                    let tempFile = fileList[i];
                    if (file.uid === tempFile.uid) {
                        fileList.splice(i, 1);
                    }
                }
            } else {
                let isZhongWen = /.*[\u4e00-\u9fa5]+.*$/.test(name);
                let time = 0;
                let self = this;
                if (isZhongWen) {
                    name = py(name);
                    file.name = name.replace(/\s/g, ""); // 去掉所有空格
                    setTimeout(function() {
                        self.$notify({
                            title: "提示",
                            message: "检测到有中文，自动转换为 " + name,
                            type: "warning",
                            duration: 10000 // 10 秒后
                        });
                    }, time);
                }
            }
            return false;
        },
        // 上传文件时
        beforeUpload(file) {
            let name = file.name;
            let isZhongWen = /.*[\u4e00-\u9fa5]+.*$/.test(name);
            if (isZhongWen) {
                name = py(name);
                this.uploadData.pinYinName = name;
            }
        }
    },
    created() {
        this.getList();
        if (this.size) {
            this.uploadData.size = this.size;
        }
        if (this.limit) {
            this.query.size = this.limit;
        }
        if (
            this.fileExt &&
            this.fileExt !== "" &&
            this.fileExt !== "undefined"
        ) {
            this.uploadData.exts = this.fileExt;
        }
    },
    computed: {}
};
</script>

<style type="text/scss" lang="scss">
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
            text-decoration: underline;
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
        color: #3b8cff;
    }
    &:active {
        text-decoration: none;
        color: #3b8cff;
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

/*icon图片列表展示*/
@import "../../styles/mixin";
.icon-lists {
    @include size(100%, 100%);
    margin-bottom: 10px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    & .icon-list-empty {
        text-align: center;
        width: 100%;
        height: 60px;
        line-height: 60px;
        color: #909399;
        border: 1px solid #cccccc;
        border-left: none;
        border-right: none;
        margin-bottom: 10px;
        margin-top: 10px;
        opacity: 0.5;
    }
    & .item {
        @include f_left;
        background-color: #fff;
        text-align: center;
        width: 100px;
        height: 120px;
        float: left;
        margin: 4px 0 0 6px;
        border: 1px solid #fff;
        position: relative;
        border-radius: 4px;
        &:hover {
            background-color: #f1f5fa;
        }
        & .app-icon {
            border-radius: 0.154rem;
            position: relative;
            margin: auto 0;
            width: 100%;
            height: 100%;
            line-height: 120px;
            overflow: hidden;
            background-color: #f5f5f5;
            &.default-small {
                background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAYAAACohjseAAACLklEQVRoge3by26iUADGcbczrzzzDpPZdV6h225KSZOuLBenm3pATVps660RqGhBuX5dmTTGKBwOHE7Cl/z3/gLiMdFO59uurno/JYX8kxQjkFQDTWgwsX91WE1SyAVv0GHDqcsOea0YHm/QMSAzJG/MKSATJG/MOWBpJG9MHmApJG9MXiA1kjemCJAKyRtTFFgYyRtzLPPNzoP8LSxQH07OAnMjeWOOdaOZ0IcTmG9OeSRvDItaoOi1QNFrgaxTiIXpcoVtGAEAojiBu/ZhjheQdVNcoKybmC5XOLVgF0HpW+IBbzQD9urzJG6/JE2hEnbIWoCj1/dcuO9XktXtWjlQ1k1EcVIICACGNRcD+H/4WhgHAI73KQZw8LKgAu6iuLnAu4cRjPEcLwsXm2BHBcwy4O5h1CygrJmwZjbSLKNCHS5NM1gzG7JG/8BhBrztDfCxCZjADvexCXDbG/AFLhyvEtx+C8fjB9TNcaW4/TRjzAd47gjGatPlig9wF8a1ALdhxAdY17IMfIBxktYCjOKED9Dx8n1TKDub4vjGBEiseS1AYs34AGXNhL8NK8X525DqRMMEKKkG7vvPSCp6LyZJivv+c2EcU6CkGug+PjG/kv42RPfxiQrHHLi/XYk1h7v2EUZ0n49xksJd+yDWrNRBuxJg02qBotcCRa8Fil4LFL0WKHotUPROApv4k+aC2eeAfxrwIulTyN+TwCb+rSBP1yrxJYVcXHa7Pw5NX/eYFZgHqZIAAAAAAElFTkSuQmCC") center no-repeat;
            }
            &.web {
                background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAYAAACohjseAAADJklEQVRoge3byVPTUBwHcK7633LWQ5O0pQsgKkuhbKKizihlqSzCgTo648IMw1EUy9IJIkLzkrQhNMnXQw/pBm3S13mJ9s18j830w1vy+70pPT0VIxAQ7wZ4aZwTpCInEHghCwu410NrBAQpwRpUm9Qi6CEDvERYgxoBqSFZY24DUkGyxjQDto1kjWkF2BaSNaZVoGska4wToCska4xToGMka0yjvH5jNUWmUrjvW2ByUm8ObBXJGtMofJAgOaXTmUnWGBrpAv2eLtDv6QJpRwgRDI8qmJhUMZFU0T8o+x8YiclYXddweGTAMFA38nkTOzs6pmZUfwH5IMH6hgZNs+pVN4wfByWMjCreB0bjMn5mSw0R+bwJUTRwfm5C1+vxum4htVj0LjASk/HrzKhDvV3TMDhUvef4IMH0jIrd3WuYZjV0453mPSAfJDg4sGfOsoDtzBWC4eafHRlVcHpqVH32+XzBW8DVNa1qFlJLzpZaOCIjl7ORimIhEnN/0lIFhiMyCgV7T334eOXqS8UHZKiq/ZztjLvnUAcurxSr9lwry/KmpJbsZ6mqBSHkAeC3fXvvtXtACCECQuxTZ/aJu3ckVaCT953Tsbnl7g9GDdgXlTuGA4BPn3W2wKFHSsdwhYKFyWnGS7RyBk0T4IPu9x/NUN2DxaK9B4cp1pOeAe5/t09Rt4eCp4ErabuKubw0Xb+7OIFg7lkBqmohe1hCX9RDlYyi2Ms0895dBRKNy5Bl+znzL9zXo1SBnECwnLYrEACO255wREa2os3yVC3KCeVuIlvTB25nrlparo9HFIhidZv18pXHuglOKBfLZ7+rm7uLCxPL6SLiA/WzMZ5U8eWrjlJNf0zjoOoIkBMIYv0yjo7qL2AsC5AkEycnBkTRaFjeGQaQXqVzCncMyAnlgnlzS2t4LXHTOD42MJbwwZ1MZaJxGZtbGnI5o+5aAii3Q3t715h72t5+YwasTKiPYCyhYGa2fC868OAfuBdlmS7Q7+kC/Z4u0O/pAv2e/xvoxZ80O8yf24EcGfLAl3SdAE8e3g704L8VtAaTCgFBSvT2ntypNf0FhIbsGnQobgYAAAAASUVORK5CYII=") center no-repeat;
            }
            &.dir-small {
                background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAYAAACohjseAAABHUlEQVRoge3aMUoEMRTG8XcBvYW6nmELG4WkHhaTs1lZWYiza2MjbOYG6kLSWNgJkoHV2VZ4FrOWNmp4vOz3wb/Pj0w3IcIwDCu91/vT4xzsPHd26DvLvy7Yzz6Yl76zl3lpT6RdRDTi+mDe/wT7EWyu8+10TxSYg1kUwW3LwT4839l9SeCmJHBEmisxYGncd2/Ls2nVwBzMhQiQk+fK+uDkbjg1B7UCx6Jf86qZ1AtMnjm5tm5gdJu6gckzgNoDUHsAag9A7QGoPQC1B6D2ANQegNoDUHsAag9A7QGoPQC1B6D2dgI4SB+iWOMPUNeKH6RYriVeNROOfi1/mP++ve0jBCIifjw/5OjnXMfnOnB0C36aHYm8y8EwbLf2BWW9dfU+gclkAAAAAElFTkSuQmCC") center no-repeat;
            }
            &.fileicon-sys-s-code {
                background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAYAAACohjseAAADRklEQVRoge3bWU8TQQAHcF716/jkFyhFIsGoxGCMxKhEE168gleIxpgQTZSQYHkxMSZG2lIoIFAOEQLFsj3pAbSlB1JooSe0hV7790HbQLeUli7dbrKT/F9mZ2bnN9Od7kNbVXWgnFN2n+URwm4eIYxWK0WohHzy9z+voqvwiB4B06DsCAJS+pDVhDDENCgXkDYk05h8QFqQTGOOA5aMZBpTCLAkJNOYQoEnRjKNKQZ4IiTTmGKBRSOZxuRKpy8/UBCQoisgfcFa4GOH5FhgwUimMblSo/qHpGUnmcbQEQ7I9nBAtocDsj0ckO3hgGxPWYEN2gE8Wp7CBZX4UP0dgwzNxjH2Au8aZRjdtiFOpgAAA1vWzLUW0wRIkACApbAPb1bnKQtQscBW8zSI0Cayi2bHk2nTblNQrrtjYQjWtKhX91UesFbVi3f2BdiiQcrEY6kkRrZtuLH4I9O+RiVG15oG7liY0j6cjEPkXsb1xSHmgZc1Unxe18Mbj1Im6o/v4YvLgAbtwJH9+UoxXlvlMOx6Kf2TJIlJnxP3TePlBzbphyH1WLCXSlAmthoN4r19AbWq3qIm1WKawE+fE0mSpIyp3dnCS8ss+OUANumHkfh/cKQLCWA+uIEnK79Kfn4adUP4vrmE3WSMApV4zKcPfGWdO3RT514Itw2jJcOyU6eWQOqxHLqXOxY+fWDL0gRlZT2xCLr/6HBJ018yjK8U4Zl5JudJrAhulOcZbLcpYM9xYkZTCfR5zLipHy4adlEtwUeHEo5oiDJuJBmHyL2CK1ppeYDplX5qnoEy5KZMiAQwF1jHw+WpY8e5phvEtw0TQon9Iz4ZWtRrivtupAV4MM1GGWReO+XwAQBzxI92m4LypnLPOIZxryNnn5WwH29Xf5/47YZ2YPZu7CSoJ+Ckz5lp12qezrnr8oALDwrYdcaA6dSpJeh0qrG+v5sByAOuzPU2y2ymPpZKYnDLilv6kZLvWzZgOnylGG3WOXx1GdGoGzpQL0KHU4WuNQ2uFnhwVCSQqXBAtocDsj0ckO3hgGwPB2R7OCDbwwHZnvzACvxJczHhESJvXiCP6PnA9CRLAipFHXmBlfi3ggIT4RE9gvNy4Zls01+OdIEEEszbzgAAAABJRU5ErkJggg==") center no-repeat;
            }
            &.fileicon-small-txt {
                background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAYAAACohjseAAABOElEQVRoge3bQU7CQBTG8W7hRp4BGg+kCZ5Aw8JpXekCMMHEtZ4BQeUcblyAYtt8bowhpClT+vDNw+8l//XML7OaZCaK1iY+Qzt2uIodlnEChNDgFSeR1HQSpNqgzYZzQWTX4V0bVAYUQ2pjqoAiSG3MNmBjpDbGB9gIqY3xBe6M1MbUAe6E1MbUBdZGamPKup5tRw7nODUL7D14Af2Q2piyjlOg9wjcPAsgtTESEWg9Aq1HoPUItJ44cDQBVhlEZpUDt0+BAT++ZHC/yCww4HgK5IUMLi+Au1lgQJ/WZ19rEEgggQQSSCCBBBJIIIEEGgRmP/fFvDhQ4HgKfGbA/cuBAv8yAq1HoPUItB6B1iPQev8bGOKT5lo5vFWfoMOF+iYb1L1EvxoY4LcCL1iCRSdBenSO1qbpG+FZw3jpdRMgAAAAAElFTkSuQmCC") center no-repeat;
            }
            &.fileicon-small-pic {
                img {
                    /*如果是图片则展示图片*/
                    max-width: 100%;
                    max-height: 100%;
                    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAAAAAByaaZbAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JQAAgIMAAPn/AACA6QAAdTAAAOpgAAA6mAAAF2+SX8VGAAAAAmJLR0QA/4ePzL8AAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfiBR0RGx0qH34fAAAAP0lEQVRIx2P8zwABD6C0AgE+EwOJYFQDMYDlAZShAKUJ8QehH4aDBsbR/DAoNIzmh8GhYTQ/DA4No/lhcGgAANgjFQHywHtPAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE4LTA1LTI5VDE2OjU5OjE4KzA4OjAwfq61WQAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxOC0wNS0yOVQxNzoyNzoyOSswODowMM1v/QcAAAAASUVORK5CYII=);
                    background-size: 24px;
                    transition: all 0.2s;
                    vertical-align: middle;
                }
            }
            &.fileicon-small-zip {
                background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAYAAACohjseAAABeUlEQVRoge3XP0vDQAAF8Awqfh+33FIdC27JYP8QwWKHfoZkqAQ6FIr6LVy6uBSUTiaLSSjF2S4Opm0kHRI6NOciOpxDzztsEt6DNz9+HHdwioIgxYh+93Kgucm17iRvuptSkRrOgm6GJ1w1nIXQpu6mVHeSSHtKbirj10MGqLlJX3hg18Af6C17gm4alwWoOenqN6C0gV0DdTelAAIIIIAAAggggAACCOB/AddGk0prq84NXLfq8vaNJoB/arZcUtFk83l+gbICYB6Am9HZ9nfw8aKAQJ5H5v4UQAABBJATOKptD3w4Lx5QJADuCpiFoTAuC9/zC/xuHn8TcbtBZXXV4Xhgvrrq1KTtx+0GC+xNq1RWB5MqN3Awkbffm1ZZoBUQKqu2R7iBtidv3woIgAACCCCAAAIIIIAA5gdoBiQqEfCDPUGfdEsD9NU+A6yMlT3LJ13TV2dmQCKR2h6JNsNjrtqe2KYZkMj01Znpq1eXz0f7DBApaD4BYPa1eeusGGsAAAAASUVORK5CYII=") center no-repeat;
            }
        }
        & .title {
            position: absolute;
            bottom: 2px;
            left: 0;
            display: block;
            /*截断多出来的字*/
            @include text-overflow;
            font-size: 12px;
            color: #4a4a4a;
            text-align: center;
            margin: auto 0;
            width: 100%;
            & .edit-input {
                padding: 0 0 0 5px;
                height: 24px;
                vertical-align: middle;
                border: 1px solid rgba(58, 140, 255, 0.3);
                background: #fff;
                border-radius: 2px;
                width: 78px;
                margin: 0;
            }
            & .edit-btn {
                width: 20px;
                height: 20px;
                display: inline-block;
                vertical-align: middle;
                cursor: pointer;
                position: relative;
                margin: 0 0 0 4px;
                border: 1px solid rgba(58, 140, 255, 0.3);
                border-radius: 2px;
                line-height: 20px;
                color: #3b8cff;
                font-size: 16px;
                font-weight: 600;
            }
        }
        & .circle-check {
            display: none;
            position: absolute;
            top: 5px;
            left: 5px;
            height: 21px;
            width: 21px;
            cursor: pointer;
            font-size: 18px;
            color: #b5d3ff;
        }
        &:hover .circle-check {
            display: block;
        }
        &.select {
            background-color: #f1f5fa;
        }
        &.select .circle-check {
            color: #3b8cff;
            display: block;
        }
        &:hover .big-img {
            display: block;
        }
        & .big-img {
            animation: bounce-in 0.5s;
            position: absolute;
            right: -40px;
            top: -100px;
            width: 200px;
            height: 200px;
            display: none;
            & img {
                max-width: 100%;
                max-height: 100%;
            }
        }
    }
}
@keyframes bounce-in {
    0% {
        opacity: 0;
    }
    20% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
}
</style>
