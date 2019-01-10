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
                    <img style="max-width: 200px;max-height: 150px;" :src="scope.row.pic_url"/>
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
                <el-form-item label="封面图片（上传或填写网络地址）" prop="pic">
                    <div>
                        <el-input size="small" v-model="formData.pic" auto-complete="off" placeholder="图片路径"></el-input>

                        <upload ext="jpg,png,jpeg" :size="716800"  @on-select="onSelectPic"></upload>

                    </div>
                    <div class="upload-img" v-if="formData.pic_url">
                        <img :src="formData.pic_url" style="max-width: 200px;max-height: 200px;">
                    </div>

                </el-form-item>
                <el-form-item label="描述" prop="describe">
                    <el-input v-model="formData.describe" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="跳转方式" prop="jump_type">
                    <el-radio-group v-model="formData.jump_type">
                        <el-radio :label="0">web 网页</el-radio>
                        <el-radio :label="1">APP内跳转</el-radio>
                        <el-radio :label="2">小程序跳转</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="URL链接（web网页和小程序时）" prop="jump_url" v-if="formData.jump_type === 0 || formData.jump_type === 2">
                    <el-input v-model="formData.jump_url" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item label="IOS 类名（APP内跳转时）" prop="ios_url" v-if="formData.jump_type === 1">
                    <el-input v-model="formData.ios_url" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item label="Android 类名（APP内跳转时）" prop="android_url" v-if="formData.jump_type === 1">
                    <el-input v-model="formData.android_url" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item label="小程序的 appid（小程序跳转时）" prop="wxa_appid" v-if="formData.jump_type === 2">
                    <el-input v-model="formData.wxa_appid" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item label="开始时间">

                    <el-form-item prop="start_time" style="display: inline-block;">
                        <el-date-picker
                            v-model="formData.start_time"
                            type="datetime"
                            size="mini"
                            placeholder="开始时间（默认不限制）">
                        </el-date-picker>
                    </el-form-item>
                    -
                    <el-form-item prop="end_time" style="display: inline-block;">
                        <el-date-picker
                            v-model="formData.end_time"
                            type="datetime"
                            size="mini"
                            placeholder="结束时间（默认不限制）">
                        </el-date-picker>
                    </el-form-item>

                </el-form-item>

                <el-form-item label="统计事件的名称" prop="event_name">
                    <el-input v-model="formData.event_name" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item label="状态" prop="status">
                    <el-radio-group v-model="formData.status">
                        <el-radio :label="0">禁用</el-radio>
                        <el-radio :label="1">正常</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item>
                    <el-button style="float: right;" type="primary" @click.native="formSubmit()" :loading="formLoading">提前提交</el-button>
                </el-form-item>

                <el-form-item label="新用户展示逻辑">
                    <div class="remove-list-box">
                        第几次展示
                        <el-form-item prop="new_show_start_num" style="display: inline-block;">
                            <el-input-number
                                v-model="formData.new_show_start_num"
                                :min="0"
                                controls-position="right"
                                size="mini"
                                label="第几次展示">
                            </el-input-number>
                        </el-form-item>
                        -
                        展示最大次数
                        <el-form-item prop="new_show_max_num" style="display: inline-block;">
                            <el-input-number
                                v-model="formData.new_show_max_num"
                                :min="0"
                                controls-position="right"
                                size="mini"
                                label="展示最大次数">
                            </el-input-number>
                        </el-form-item>
                    </div>
                </el-form-item>

                <el-form-item label="老用户展示逻辑">
                    <div class="remove-list-box">
                        第几次展示
                        <el-form-item prop="old_show_start_num" style="display: inline-block;">
                            <el-input-number
                                v-model="formData.old_show_start_num"
                                :min="0"
                                controls-position="right"
                                size="mini"
                                label="第几次展示">
                            </el-input-number>
                        </el-form-item>
                        -
                        展示最大次数
                        <el-form-item prop="old_show_max_num" style="display: inline-block;">
                            <el-input-number
                                v-model="formData.old_show_max_num"
                                :min="0"
                                controls-position="right"
                                size="mini"
                                label="展示最大次数">
                            </el-input-number>
                        </el-form-item>
                    </div>
                </el-form-item>

                <el-form-item>
                    <span style='color:red;'>以下内容（注意：不要输入空格和逗号，批量添加以英文逗号隔开）黑白名单用来控制屏蔽或者显示</span>
                </el-form-item>

                <el-form-item label="渠道名单" required>
                    <el-form-item prop="channel_type">
                        <el-radio-group v-model="formData.channel_type">
                            <el-radio :label="0">不限制</el-radio>
                            <el-radio :label="1">白名单</el-radio>
                            <el-radio :label="2">黑名单</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item prop="channel_list" v-if="formData.channel_type !== 0">
                        <div class="remove-list-box">
                            <div class="remove-list">
                                <div class="remove-list-item" v-for="(item, index) in formData.channel_list" :key="index">
                                    {{item}}
                                    <i class="el-icon-close remove-list-close" @click="handleChannelListClose(index)"></i>
                                </div>
                            </div>
                            <div v-show="formData.channel_list.length >= 15" style="color: red;">到达最大次数，最大15个</div>
                            <el-input
                                size="mini"
                                v-model="channelListInput"
                                placeholder="输入渠道版本插入"
                                style="width: 190px;"
                                ref="channelListRef"
                                @keyup.enter.native="handleChannelListSubmit"
                                maxlength="12">
                            </el-input>
                            <el-button type="primary" size="mini" @click.native="handleChannelListSubmit()" style="margin-left: 5px;">插入</el-button>
                        </div>
                    </el-form-item>
                </el-form-item>

                <el-form-item label="Android版本名单" required>
                    <el-form-item prop="android_version_type">
                        <el-radio-group v-model="formData.android_version_type">
                            <el-radio :label="0">不限制</el-radio>
                            <el-radio :label="1">白名单</el-radio>
                            <el-radio :label="2">黑名单</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item prop="android_version_list" v-if="formData.android_version_type !== 0">
                        <div class="remove-list-box">
                            <div class="remove-list">
                                <div class="remove-list-item" v-for="(item, index) in formData.android_version_list" :key="index">
                                    {{item}}
                                    <i class="el-icon-close remove-list-close" @click="handleAndroidVersionListClose(index)"></i>
                                </div>
                            </div>
                            <div v-show="formData.android_version_list.length >= 15" style="color: red;">到达最大次数，最大15个</div>
                            <el-input
                                size="mini"
                                v-model="androidVersionListInput"
                                placeholder="输入Android版本插入"
                                style="width: 190px;"
                                ref="androidVersionListRef"
                                @keyup.enter.native="handleAndroidVersionListSubmit"
                                maxlength="12">
                            </el-input>
                            <el-button type="primary" size="mini" @click.native="handleAndroidVersionListSubmit()" style="margin-left: 5px;">插入</el-button>
                        </div>
                    </el-form-item>
                </el-form-item>

                <el-form-item label="iOS版本名单" required>
                    <el-form-item prop="ios_version_type">
                        <el-radio-group v-model="formData.ios_version_type">
                            <el-radio :label="0">不限制</el-radio>
                            <el-radio :label="1">白名单</el-radio>
                            <el-radio :label="2">黑名单</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item prop="ios_version_list" v-if="formData.ios_version_type !== 0">
                        <div class="remove-list-box">
                            <div class="remove-list">
                                <div class="remove-list-item" v-for="(item, index) in formData.ios_version_list" :key="index">
                                    {{item}}
                                    <i class="el-icon-close remove-list-close" @click="handleIosVersionListClose(index)"></i>
                                </div>
                            </div>
                            <div v-show="formData.ios_version_list.length >= 15" style="color: red;">到达最大次数，最大15个</div>
                            <el-input
                                size="mini"
                                v-model="iosVersionListInput"
                                placeholder="输入iOS版本插入"
                                style="width: 190px;"
                                ref="iosVersionListRef"
                                @keyup.enter.native="handleIosVersionListSubmit"
                                maxlength="12">
                            </el-input>
                            <el-button type="primary" size="mini" @click.native="handleIosVersionListSubmit()" style="margin-left: 5px;">插入</el-button>
                        </div>
                    </el-form-item>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="hideForm">取消</el-button>
                <el-button type="primary" @click.native="formSubmit()" :loading="formLoading">提交</el-button>
            </div>
        </el-dialog>

    </div>

</template>

<script>
import { adList, adSave, adDelete } from "../../api/ad/ad";
import Upload from "../../components/File/Upload.vue";
const formJson = {
    ad_id: "",
    title: "",
    describe: "",
    pic: "",
    pic_url: "",
    jump_type: "",
    jump_url: "",
    ios_url: "",
    android_url: "",
    wxa_appid: "",
    channel_type: 0,
    channel_list: [],
    android_version_type: 0,
    android_version_list: [],
    ios_version_type: 0,
    ios_version_list: [],
    new_show_start_num: 0,
    new_show_max_num: 0,
    old_show_start_num: 0,
    old_show_max_num: 0,
    end_time: "",
    event_name: "",
    status: 1
};
export default {
    data() {
        return {
            query: {
                title: "",
                page: 1,
                limit: 20
            },
            channelListInput: "",
            androidVersionListInput: "",
            iosVersionListInput: "",
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
                jump_url: [
                    {
                        required: true,
                        message: "请输入跳转链接",
                        trigger: "blur"
                    }
                ],
                android_url: [
                    {
                        required: true,
                        message: "请输入Android类名",
                        trigger: "blur"
                    }
                ],
                ios_url: [
                    {
                        required: true,
                        message: "请输入IOS类名",
                        trigger: "blur"
                    }
                ],
                wxa_appid: [
                    {
                        required: true,
                        message: "请输入小程序Appid",
                        trigger: "blur"
                    }
                ],
                channel_list: [
                    {
                        required: true,
                        message: "请输入至少一个渠道名单",
                        trigger: "change"
                    }
                ],
                android_version_list: [
                    {
                        required: true,
                        message: "请输入至少一个Android版本名单",
                        trigger: "change"
                    }
                ],
                ios_version_list: [
                    {
                        required: true,
                        message: "请输入至少一个iOS版本名单",
                        trigger: "change"
                    }
                ],
                status: [
                    { required: true, message: "请选择状态", trigger: "change" }
                ]
            },
            deleteLoading: false
        };
    },
    components: {
        Upload
    },
    methods: {
        onReset() {
            this.$router.push({
                path: ""
            });
            this.query = {
                title: "",
                page: 1,
                limit: 20
            };
            this.getList();
        },
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
        // 删除渠道
        handleChannelListClose(index) {
            console.log(index);
            // 更改值
            this.formData.channel_list.splice(index, 1);
        },
        // 添加渠道白名单
        handleChannelListSubmit() {
            // 更改值
            if (
                this.channelListInput &&
                this.formData.channel_list.length < 15
            ) {
                let arr = this.channelListInput.split(",");
                for (let i in arr) {
                    if (
                        arr[i] !== "" &&
                        (this.formData.channel_list.length === 0 ||
                            this.formData.channel_list.indexOf(arr[i]) < 0)
                    ) {
                        this.formData.channel_list.push(arr[i]);
                    }
                }
                this.channelListInput = "";
                this.$refs.channelListRef.focus();
            }
        },
        // 删除Android版本
        handleAndroidVersionListClose(index) {
            // 更改值
            this.formData.android_version_list.splice(index, 1);
        },
        // 添加Android版本
        handleAndroidVersionListSubmit() {
            // 更改值
            if (
                this.androidVersionListInput &&
                this.formData.android_version_list.length < 15
            ) {
                let arr = this.androidVersionListInput.split(",");
                for (let i in arr) {
                    let avList = this.formData.android_version_list;
                    if (
                        arr[i] !== "" &&
                        (avList.length === 0 || avList.indexOf(arr[i]) < 0)
                    ) {
                        this.formData.android_version_list.push(arr[i]);
                    }
                }
                this.androidVersionListInput = "";
                this.$refs.androidVersionListRef.focus();
            }
        },
        // 删除Ios版本
        handleIosVersionListClose(index) {
            // 更改值
            this.formData.ios_version_list.splice(index, 1);
        },
        // 添加Ios版本
        handleIosVersionListSubmit() {
            // 更改值
            if (
                this.iosVersionListInput &&
                this.formData.ios_version_list.length < 15
            ) {
                let arr = this.iosVersionListInput.split(",");
                for (let i in arr) {
                    if (
                        arr[i] !== "" &&
                        (this.formData.ios_version_list.length === 0 ||
                            this.formData.ios_version_list.indexOf(arr[i]) < 0)
                    ) {
                        this.formData.ios_version_list.push(arr[i]);
                    }
                }
                this.iosVersionListInput = "";
                this.$refs.iosVersionListRef.focus();
            }
        },
        // 刷新表单
        resetForm() {
            if (this.$refs["dataForm"]) {
                // 清空字段
                this.$refs["dataForm"].resetFields();
                // 清空验证信息表单
                this.$refs["dataForm"].clearValidate();
            }
        },
        // 隐藏表单
        hideForm() {
            // 更改值
            this.formVisible = !this.formVisible;
            return true;
        },
        // 显示表单
        handleForm(index, row) {
            this.formVisible = true;
            // 刷新表单
            this.resetForm();
            this.formData = JSON.parse(JSON.stringify(formJson));
            if (row !== null) {
                this.formData = Object.assign({}, row);
            }
            this.formName = "add";
            if (index !== null) {
                this.index = index;
                this.formName = "edit";
            }
        },
        formSubmit() {
            this.$refs["dataForm"].validate(valid => {
                if (valid) {
                    this.formLoading = true;
                    let data = Object.assign({}, this.formData);
                    adSave(data, this.formName)
                        .then(response => {
                            this.formLoading = false;
                            if (response.code) {
                                this.$message.error(response.message);
                                return false;
                            }
                            this.$message.success("操作成功");
                            this.formVisible = false;
                            if (this.formName === "add") {
                                // 向头部添加数据
                                data.ad_id = response.data.ad_id;
                                this.list.unshift(data);
                            } else {
                                this.list.splice(this.index, 1, data);
                            }
                        })
                        .catch(() => {
                            this.formLoading = false;
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
                        this.deleteLoading = true;
                        adDelete(para)
                            .then(response => {
                                this.deleteLoading = false;
                                if (response.code) {
                                    this.$message.error(response.message);
                                    return false;
                                }
                                this.$message("删除成功");
                                // 刷新数据
                                this.list.splice(index, 1);
                            })
                            .catch(() => {
                                this.deleteLoading = false;
                            });
                    })
                    .catch(() => {
                        this.$message.info("取消删除");
                    });
            }
        },
        onSelectPic(filePath, filePathUrl) {
            this.formData.pic = filePath;
            this.formData.pic_url = filePathUrl;
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
