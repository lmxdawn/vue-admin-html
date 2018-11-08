<template>

    <div>
        <el-form :inline="true" :model="query" class="query-form" size="mini">
            <el-form-item class="query-form-item">
                <el-input v-model="query.title" placeholder="广告标题"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button-group>
                    <el-button type="primary" icon="el-icon-refresh" @click="getList"></el-button>
                    <el-button type="primary" icon="search" @click="onSubmit">查询</el-button>
                    <el-button type="primary" @click.native="handleForm(null,null)">新增</el-button>
                </el-button-group>
            </el-form-item>
        </el-form>
        <el-table
            v-loading="loading"
            :data="list"
            style="width: 100%;">
            <el-table-column
                label="ID"
                prop="ad_id"
                fixed>
            </el-table-column>
            <el-table-column
                label="标题"
                prop="title"
                with="300"
                :show-overflow-tooltip="true"
                fixed>
            </el-table-column>
            <el-table-column
                label="描述"
                prop="describe"
                with="300"
                :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column
                label="封面"
                prop="pic_url">
                <template slot-scope="scope">
                    <img style="max-width: 100%;max-height: 100%;" :src="scope.row.pic_url"/>
                </template>
            </el-table-column>
            <el-table-column
                label="状态">
                <template slot-scope="scope">
                    <el-tag :type="scope.row.status | statusFilterType">{{scope.row.status | statusFilterName}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column
                label="操作"
                fixed="right">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click.native="handleForm(scope.$index, scope.row)">编辑</el-button>
                    <el-button type="text" size="small" @click.native="handleDel(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination
            :page-size="query.limit"
            @current-change="handleCurrentChange"
            layout="prev, pager, next"
            :total="total">
        </el-pagination>

        <!--表单-->
        <el-dialog
            :title="formMap[formName]"
            :visible.sync="formVisible"
            :before-close="hideForm"
            width="85%"
            top="5vh">
            <el-form :model="formData" :rules="formRules" ref="dataForm">
                <el-form-item label="标题" prop="title">
                    <el-input v-model="formData.title" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="封面图片（上传或填写）" prop="pic">
                    <div>
                        <el-input size="small" v-model="formData.pic" auto-complete="off" placeholder="图片路径"></el-input>
                        <el-button size="small" type="primary" icon="el-icon-upload2" @click="uploadDialogVisible = true">选取文件</el-button>
                    </div>
                    <div class="avatar-uploader" v-if="formData.pic_url">
                        <img :src="formData.pic_url" class="avatar">
                    </div>
                </el-form-item>
                <el-form-item label="描述" prop="describe">
                    <el-input v-model="formData.describe" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="跳转方式" prop="jump_type">
                    <el-radio-group v-model="formData.jump_type">
                        <el-radio :label="1">小程序</el-radio>
                        <el-radio :label="2">web网页</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="URL链接（web网页时有效）" prop="link_url">
                    <el-input v-model="formData.link_url" auto-complete="off"></el-input>
                </el-form-item>


                <el-form-item label="小程序id（小程序时有效）" prop="wxa_appid">
                    <el-input v-model="formData.wxa_appid" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="跳转路径（小程序时有效）" prop="wxa_path">
                    <el-input v-model="formData.wxa_path" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="跳转时的参数（小程序时有效）" prop="extra_data">
                    <el-input v-model="formData.extra_data" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="跳转小程序的版本（小程序时有效）" prop="env_version">
                    <el-input v-model="formData.env_version" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item label="状态" prop="status">
                    <el-radio-group v-model="formData.status">
                        <el-radio :label="0">禁用</el-radio>
                        <el-radio :label="1">正常</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="hideForm">取消</el-button>
                <el-button type="primary" @click.native="formSubmit()" :loading="formLoading">提交</el-button>
            </div>
        </el-dialog>

        <el-dialog
            title="上传插件"
            :visible.sync="uploadDialogVisible"
            top="10px"
            width="80%">
            <file-resource
                :uploadUrl="uploadUrl"
                :isAll="false"
                :fileExt="fileExt"
                :size="200000"
                :limit="10"
                @resourceSelect="resourceSelect">
            </file-resource>
        </el-dialog>

    </div>

</template>

<script>
import { adList, adSave, adDelete } from "../../api/ad/ad";
import { BASE_URL } from "../../config/app";
import FileResource from "../../components/common/FileResource.vue";
const formJson = {
    ad_id: "",
    title: "",
    describe: "",
    jump_type: "",
    link_url: "",
    pic: "",
    pic_url: "",
    wxa_appid: "",
    wxa_path: "",
    extra_data: "",
    env_version: "",
    status: 1
};
export default {
    data() {
        let validateLinkUrl = (rule, value, callback) => {
            if (this.formData.jump_type === 2 && value === "") {
                callback(new Error("请输入跳转地址"));
            } else {
                callback();
            }
        };
        let validateWxaPath = (rule, value, callback) => {
            if (this.formData.jump_type === 1 && value === "") {
                callback(new Error("请输入小程序跳转路径"));
            } else {
                callback();
            }
        };
        return {
            uploadDialogVisible: false,
            uploadUrl: BASE_URL + "/admin/file/resource/upload",
            fileExt: "jpg,png,gif",
            query: {
                title: "",
                page: 1,
                limit: 20
            },
            list: [],
            total: 0,
            loading: true,
            index: null,
            formName: null,
            formMap: {
                add: "新增",
                edit: "编辑"
            },
            formLoading: false,
            formVisible: false,
            formData: formJson,
            formRules: {
                title: [
                    {
                        required: true,
                        message: "请输入广告标题",
                        trigger: "blur"
                    }
                ],
                pic: [
                    {
                        required: true,
                        message: "请选择封面图片",
                        trigger: "change"
                    }
                ],
                jump_type: [
                    {
                        required: true,
                        message: "请选择跳转方式",
                        trigger: "change"
                    }
                ],
                link_url: [{ validator: validateLinkUrl, trigger: "blur" }],
                wxa_path: [{ validator: validateWxaPath, trigger: "blur" }],
                status: [
                    { required: true, message: "请选择状态", trigger: "change" }
                ]
            },
            deleteLoading: false
        };
    },
    components: {
        FileResource
    },
    methods: {
        onSubmit() {
            this.$router.push({
                path: "",
                query: this.query
            });
            this.getList();
        },
        handleSizeChange(val) {
            this.query.limit = val;
            this.getList();
        },
        handleCurrentChange(val) {
            this.query.page = val;
            this.getList();
        },
        getList() {
            this.loading = true;
            adList(this.query)
                .then(response => {
                    this.loading = false;
                    this.list = response.data.list || [];
                    this.total = response.data.total || 0;
                })
                .catch(() => {
                    this.loading = false;
                    this.list = [];
                    this.total = 0;
                });
        },
        // 隐藏表单
        hideForm() {
            // 更改值
            this.formVisible = !this.formVisible;
            // 清空表单
            this.$refs["dataForm"].resetFields();
            return true;
        },
        // 显示表单
        handleForm(index, row) {
            this.formVisible = true;
            this.formData = Object.assign({}, formJson);
            if (row !== null) {
                this.formData = Object.assign({}, row);
            }
            this.formName = "add";
            if (index !== null) {
                this.index = index;
                this.formName = "edit";
            }
            // 清空验证信息表单
            if (this.$refs["dataForm"]) {
                this.$refs["dataForm"].clearValidate();
            }
        },
        formSubmit() {
            this.$refs["dataForm"].validate(valid => {
                if (valid) {
                    this.formLoading = true;
                    let data = Object.assign({}, this.formData);
                    adSave(data, this.formName).then(response => {
                        this.formLoading = false;
                        if (response.code) {
                            this.$message({
                                message: response.message,
                                type: "error"
                            });
                        } else {
                            this.$message({
                                message: "操作成功",
                                type: "success"
                            });
                            // 向头部添加数据
                            // this.list.unshift(response.data)
                            // 刷新表单
                            this.$refs["dataForm"].resetFields();
                            this.formVisible = false;
                            if (this.formName === "add") {
                                // 向头部添加数据
                                this.list.unshift(response.data);
                            } else {
                                this.list.splice(this.index, 1, data);
                            }
                        }
                    });
                }
            });
        },
        // 删除
        handleDel(index, row) {
            if (row.ad_id) {
                this.$confirm("确认删除该记录吗?", "提示", {
                    type: "warning"
                })
                    .then(() => {
                        let para = { ad_id: row.ad_id };
                        adDelete(para)
                            .then(response => {
                                this.deleteLoading = false;
                                if (response.code) {
                                    this.$message({
                                        message: response.message,
                                        type: "error"
                                    });
                                } else {
                                    this.$message({
                                        message: "删除成功",
                                        type: "success"
                                    });
                                    // 刷新数据
                                    this.list.splice(index, 1);
                                }
                            })
                            .catch(() => {
                                this.deleteLoading = false;
                            });
                    })
                    .catch(() => {
                        this.$message({
                            type: "info",
                            message: "取消删除"
                        });
                    });
            }
        },
        resourceSelect(list) {
            if (!list || list.length <= 0) {
                return;
            }
            let file = list[0];
            this.formData.pic = file.path;
            this.formData.pic_url = file.url;
            this.uploadDialogVisible = false;
        }
    },
    filters: {
        statusFilterType(status) {
            const statusMap = {
                0: "gray",
                1: "success"
            };
            return statusMap[status];
        },
        statusFilterName(status) {
            const statusMap = {
                0: "禁用",
                1: "正常"
            };
            return statusMap[status];
        }
    },
    mounted() {},
    created() {
        // 将参数拷贝进查询对象
        let query = this.$route.query;
        this.query = Object.assign(this.query, query);
        this.query.limit = parseInt(this.query.limit);
        // 加载表格数据
        this.getList();
    }
};
</script>

<style type="text/scss" lang="scss">
</style>
