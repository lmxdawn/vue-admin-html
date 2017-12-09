<template>

    <div>
        <el-form :inline="true" :model="query" class="query-form" size="mini">
            <!--<el-form-item class="query-form-item">-->
                <!--<el-select v-model="query.pid" placeholder="父级">-->
                    <!--<el-option-->
                        <!--v-for="item in treeList"-->
                        <!--:key="item.id"-->
                        <!--:label="item.title"-->
                        <!--:value="item.id">-->
                        <!--<span style="float: left"><span v-html="item.html"></span>{{ item.title }}</span>-->
                    <!--</el-option>-->
                <!--</el-select>-->
            <!--</el-form-item>-->
            <el-form-item class="query-form-item">
                <el-input v-model="query.name" placeholder="角色名称"></el-input>
            </el-form-item>
            <el-form-item class="query-form-item">
                <el-select v-model="query.status" placeholder="状态">
                    <!--<el-option label="状态" value=""></el-option>-->
                    <el-option label="禁用" value="0"></el-option>
                    <el-option label="正常" value="1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-refresh" @click="getList"></el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="search" @click="onSubmit">查询</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click.native="handleAdd">新增</el-button>
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

        <!--编辑界面-->
        <el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editFormData" :rules="editFormRules" ref="editFormData">
                <el-form-item label="父ID" prop="pid">
                    <el-select v-model="editFormData.pid" placeholder="父级">
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
                    <el-input type="" v-model="editFormData.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="规则标题" prop="title">
                    <el-input type="" v-model="editFormData.title" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-radio-group v-model="editFormData.status">
                        <el-radio label="0">禁用</el-radio>
                        <el-radio label="1">正常</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="额外的规则表达式">
                    <el-input type="textarea" v-model="editFormData.condition"></el-input>
                </el-form-item>
                <el-form-item label="排序" prop="listorder">
                    <el-input type="" v-model="editFormData.listorder" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = !editFormVisible">取消</el-button>
                <el-button type="primary" @click.native="editSubmit('editFormData')" :loading="editLoading">提交
                </el-button>
            </div>
        </el-dialog>

        <!--新增界面-->
        <el-dialog title="新增" :visible.sync="addFormVisible">
            <el-form :model="addFormData" :rules="addFormDataRules" ref="addFormData">
                <el-form-item label="父ID" prop="pid">
                    <el-select v-model="addFormData.pid" placeholder="父级">
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
                    <el-input type="" v-model="addFormData.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="规则标题" prop="title">
                    <el-input type="" v-model="addFormData.title" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-radio-group v-model="addFormData.status">
                        <el-radio label="0">禁用</el-radio>
                        <el-radio label="1">正常</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="额外的规则表达式">
                    <el-input type="textarea" v-model="addFormData.condition"></el-input>
                </el-form-item>
                <el-form-item label="排序" prop="listorder">
                    <el-input type="" v-model="addFormData.listorder" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = !addFormVisible">取消</el-button>
                <el-button type="primary" @click.native="addSubmit('addFormData')" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>
    </div>

</template>

<script>
    import { authRuleList, authRuleSave, authRuleEdit, authRuleDelete } from '../../../api/authRule'
    export default {
        data () {
            return {
                query: {
                    // pid: '',
                    name: '',
                    status: ''
                },
                mergeList: [],
                defaultProps: {
                    children: 'children',
                    label: 'title'
                },
                treeList: [],
                loading: true,
                addLoading: false,
                addFormVisible: false,
                addFormData: {
                    pid: '',
                    name: '',
                    title: '',
                    status: '',
                    condition: '',
                    listorder: 999
                },
                addPidData: null,
                addFormDataRules: {
                    name: [
                        {required: true, message: '请输入规则名', trigger: 'blur'}
                    ],
                    title: [
                        {required: true, message: '请输入标题', trigger: 'blur'}
                    ],
                    status: [
                        {required: true, message: '请选择状态', trigger: 'change'}
                    ]
                },
                editLoading: false,
                editFormVisible: false,
                editFormData: {
                    id: '',
                    pid: '',
                    name: '',
                    title: '',
                    status: '',
                    condition: '',
                    listorder: ''
                },
                editPidData: null,
                editFormRules: {
                    name: [
                        {required: true, message: '请输入规则名', trigger: 'blur'}
                    ],
                    title: [
                        {required: true, message: '请输入标题', trigger: 'blur'}
                    ],
                    status: [
                        {required: true, message: '请选择状态', trigger: 'change'}
                    ]
                },
                deleteLoading: false
            }
        },
        methods: {
            renderContent (h, { node, data, store }) {
                return (
                    <span style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
                    <span>
                    <span title={ data.name }>{node.label}</span>
                </span>
                <span>
                <el-button style="font-size: 12px;" type="text" on-click={ () => this.handleAdd(data) }>添加子菜单</el-button>
                <el-button style="font-size: 12px;" type="text" on-click={ () => this.handleEdit(data) }>编辑</el-button>
                <el-button style="font-size: 12px;" type="text" on-click={ () => this.handleDel(data) }>删除</el-button>
                </span>
                </span>)
            },
            onSubmit () {
                this.getList()
            },
            getList () {
                this.loading = true
                authRuleList(this.query).then(response => {
                    this.loading = false
                    this.mergeList = response.merge_list || []
                    this.treeList = response.tree_list || []
                }).catch(() => {
                    this.loading = false
                    this.mergeList = []
                    this.treeList = []
                })
            },
            // 删除
            handleDel (data) {
                if (data.children && data.children.length > 0) {
                    this.$alert('存在子节点', '提示', {
                        confirmButtonText: '确定'
                    })
                    return false
                }
                if (data.id) {
                    this.$confirm('确认删除该记录吗?', '提示', {
                        type: 'warning'
                    }).then(() => {
                        this.deleteLoading = true
                        let para = {id: data.id}
                        authRuleDelete(para).then((res) => {
                            this.deleteLoading = false
                            if (res.errcode) {
                                this.$message({
                                    message: res.errmsg,
                                    type: 'error'
                                })
                            } else {
                                this.$message({
                                    message: '删除成功',
                                    type: 'success'
                                })
                                // 刷新数据
                                this.getList()
                            }
                        }).catch(() => {
                            this.deleteLoading = false
                        })
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '取消删除'
                        })
                    })
                }
            },
            // 显示编辑界面
            handleEdit (data) {
                this.editFormVisible = true
                this.editFormData = Object.assign({}, data)
                this.editFormData.status += '' // 转为字符串（解决默认选中的时候字符串和数字不能比较的问题）
                this.editPidData = data
            },
            editSubmit (formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        this.editLoading = true
                        let data = Object.assign({}, this.editFormData)
                        authRuleEdit(data).then(res => {
                            this.editLoading = false
                            if (res.errcode) {
                                this.$message({
                                    message: res.errmsg,
                                    type: 'error'
                                })
                            } else {
                                this.$message({
                                    message: '编辑成功',
                                    type: 'success'
                                })
                                // 刷新表单
                                this.$refs['editFormData'].resetFields()
                                this.editFormVisible = false
                                this.editPidData = res || {}
                                // 刷新数据
                                this.getList()
                            }
                        }).catch(() => {
                            this.editLoading = false
                        })
                    }
                })
            },
            // 显示新增界面
            handleAdd (data) {
                this.addFormVisible = true
                this.addPidData = data || {}
                this.addFormData = {
                    pid: data.id || '',
                    name: '',
                    title: '',
                    status: '1',
                    condition: '',
                    listorder: 999
                }
            },
            addSubmit (formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        this.addLoading = true
                        let data = Object.assign({}, this.addFormData)
                        authRuleSave(data).then(res => {
                            this.addLoading = false
                            if (res.errcode) {
                                this.$message({
                                    message: res.errmsg,
                                    type: 'error'
                                })
                            } else {
                                this.$message({
                                    message: '添加成功',
                                    type: 'success'
                                })
                                // 刷新表单
                                this.$refs['addFormData'].resetFields()
                                this.addFormVisible = false
                                const newChild = res || {}
                                if (!this.addPidData.children) {
                                    this.$set(this.addPidData, 'children', [])
                                }
                                this.addPidData.children.push(newChild)
                                // 刷新数据
                                this.getList()
                            }
                        }).catch(() => {
                            this.addLoading = false
                        })
                    }
                })
            }
        },
        filters: {
            statusFilterType (status) {
                const statusMap = {
                    0: 'gray',
                    1: 'success'
                }
                return statusMap[status]
            },
            statusFilterName (status) {
                const statusMap = {
                    0: '禁用',
                    1: '正常'
                }
                return statusMap[status]
            }
        },
        mounted () {
        },
        created () {
            // 加载表格数据
            this.getList()
        }
    }
</script>

<style lang="scss">


</style>
