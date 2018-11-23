<template>
    <div>
        <el-form :inline="true" :model="query" class="query-form" size="mini">
            <el-form-item class="query-form-item">
                <el-input v-model="query.name" placeholder="角色名称"></el-input>
            </el-form-item>
            <el-form-item class="query-form-item">
                <el-select v-model="query.status" placeholder="状态">
                    <el-option label="全部" value=""></el-option>
                    <el-option label="禁用" value="0"></el-option>
                    <el-option label="正常" value="1"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item>
                <el-button-group>
                    <el-button type="primary" icon="el-icon-refresh" @click="getList"></el-button>
                    <el-button type="primary" icon="search" @click="onSubmit">查询</el-button>
                    <el-button type="primary" @click.native="handleForm(null,null)">新增</el-button>
                </el-button-group>
            </el-form-item>
        </el-form>

        <el-tree
            :data="mergeList"
            :props="defaultProps"
            node-key="id"
            default-expand-all
            :expand-on-click-node="false"
            :render-content="renderContent">
        </el-tree>

        <!--表单界面-->
        <el-dialog
            :title="formMap[formName]"
            :visible.sync="formVisible"
            :before-close="hideForm"
            width="85%"
            top="5vh">
            <el-form :model="formData" :rules="formRules" ref="dataForm">
                <el-form-item label="父ID" prop="pid">
                    <el-select v-model="formData.pid" placeholder="顶级">
                        <el-option
                            v-for="item in treeList"
                            :key="item.id"
                            :label="item.title"
                            :value="item.id">
                            <span style="float: left"><span v-html="item.html"></span>{{ item.title }}</span>
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="规则名" prop="name">
                    <el-input type="" v-model="formData.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="规则标题" prop="title">
                    <el-input type="" v-model="formData.title" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-radio-group v-model="formData.status">
                        <el-radio label="0">禁用</el-radio>
                        <el-radio label="1">正常</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="额外的规则表达式">
                    <el-input type="textarea" v-model="formData.condition"></el-input>
                </el-form-item>
                <el-form-item label="排序" prop="listorder">
                    <el-input type="" v-model="formData.listorder" auto-complete="off"></el-input>
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
import {
    authPermissionRuleList,
    authPermissionRuleTree,
    authPermissionRuleSave,
    authPermissionRuleDelete
} from "../../../api/auth/authPermissionRule";
const formJson = {
    id: "",
    pid: "2",
    name: "",
    title: "",
    status: "1",
    condition: "",
    listorder: 999
};
export default {
    data() {
        return {
            query: {
                // pid: '',
                name: "",
                status: ""
            },
            mergeList: [],
            node: null,
            defaultProps: {
                children: "children",
                label: "title"
            },
            treeList: [],
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
                name: [
                    { required: true, message: "请输入规则名", trigger: "blur" }
                ],
                title: [
                    { required: true, message: "请输入标题", trigger: "blur" }
                ],
                status: [
                    { required: true, message: "请选择状态", trigger: "change" }
                ]
            },
            pidData: {},
            deleteLoading: false
        };
    },
    methods: {
        /*eslint-disable */
        renderContent (h, { node, data, store }) {
            return (
                <span style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
                <span>
                <span title={ data.name }>{node.label}</span>
            </span>
            <span>
            <el-button style="font-size: 12px;" type="text" on-click={ () => this.handleForm(node, data, 'add') }>添加子菜单</el-button>
            <el-button style="font-size: 12px;" type="text" on-click={ () => this.handleForm(node, data, 'edit') }>编辑</el-button>
            <el-button style="font-size: 12px;" type="text" on-click={ () => this.handleDel(node, data) }>删除</el-button>
            </span>
            </span>)
        },
        onSubmit() {
            this.getList();
        },
        getList() {
            this.loading = true;
            authPermissionRuleList(this.query)
                .then(response => {
                    this.loading = false;
                    this.mergeList = response.data.list || [];
                })
                .catch(() => {
                    this.loading = false;
                    this.mergeList = [];
                });
        },
        getTreeList() {
            authPermissionRuleTree()
                .then(response => {
                    this.treeList = response.data.list || [];
                })
                .catch(() => {
                    this.treeList = [];
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
        handleForm(node, data, formName) {
            this.formVisible = true;
            this.pidData = data || null;
            formJson.pid = (data && parseInt(data.id)) || "";
            this.formData = Object.assign({}, formJson);
            if (formName === "edit") {
                this.formData = Object.assign({}, data);
                this.node = node;
            }
            this.formData.pid = !this.formData.pid ? "" : this.formData.pid;
            this.formData.status += ""; // 转为字符串（解决默认选中的时候字符串和数字不能比较的问题）
            this.formName = formName;
            // 清空验证信息表单
            if (this.$refs["dataForm"]) {
                this.$refs["dataForm"].clearValidate();
            }
            if (data && data.id) {
                this.index = this.mergeList.findIndex(d => d.id === data.id);
            }
        },
        formSubmit() {
            this.$refs["dataForm"].validate(valid => {
                if (valid) {
                    this.formLoading = true;
                    let data = Object.assign({}, this.formData);
                    authPermissionRuleSave(data, this.formName)
                        .then(response => {
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
                                // 刷新表单
                                this.$refs["dataForm"].resetFields();
                                this.formVisible = false;
                                if (this.formName !== "edit") {
                                    const newChild = response.data || {};
                                    if (this.pidData) {
                                        if (!this.pidData.children) {
                                            this.$set(
                                                this.pidData,
                                                "children",
                                                []
                                            );
                                        }
                                        this.pidData.children.push(newChild);
                                    } else {
                                        this.mergeList.push(newChild);
                                    }
                                } else {
                                    const parent = this.node.parent;
                                    const children =
                                        parent.data.children || parent.data;
                                    const index = children.findIndex(
                                        d => d.id === data.id
                                    );
                                    children.splice(index, 1, data);
                                }
                            }
                        })
                        .catch(() => {
                            this.formLoading = false;
                        });
                }
            });
        },
        // 删除
        handleDel(node, data) {
            if (data.children && data.children.length > 0) {
                this.$alert("请先删除子节点", "提示", {
                    confirmButtonText: "确定"
                });
                return false;
            }
            if (data.id) {
                this.$confirm("确认删除该记录吗?", "提示", {
                    type: "warning"
                })
                    .then(() => {
                        this.deleteLoading = true;
                        let para = { id: data.id };
                        authPermissionRuleDelete(para)
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
                                    const parent = node.parent;
                                    const children =
                                        parent.data.children || parent.data;
                                    const index = children.findIndex(
                                        d => d.id === data.id
                                    );
                                    children.splice(index, 1);
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
        // 加载表格数据
        this.getList();
        // 加载树形结构
        this.getTreeList();
    }
};
</script>

<style type="text/scss" lang="scss">
</style>
