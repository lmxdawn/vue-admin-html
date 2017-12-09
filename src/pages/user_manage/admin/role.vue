<template>

    <div>
        <el-form :inline="true" :model="query" class="query-form" size="mini">
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
        <el-table
            v-loading="loading"
            :data="list"
            style="width: 100%;"
            max-height="500">
            <el-table-column
                label="角色 ID"
                prop="id"
                fixed>
            </el-table-column>
            <el-table-column
                label="角色名称"
                prop="name"
                fixed>
            </el-table-column>
            <el-table-column
                label="状态">
                <template slot-scope="scope">
                    <el-tag :type="scope.row.status | statusFilterType">{{scope.row.status | statusFilterName}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column
                label="创建时间"
                with="300">
                <template slot-scope="scope">
                    <i class="el-icon-time"></i>
                    <span style="margin-left: 10px">{{ scope.row.create_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="描述">
                <template slot-scope="scope">
                    <span>{{ scope.row.remark }}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="操作"
                fixed="right">
                <template slot-scope="scope">
                    <el-button size="small" style="margin-left: 0;" @click.native="handleAuth(scope.row.id)">授权</el-button>
                    <el-button size="small" style="margin-left: 0;" @click.native="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button type="danger" size="small" @click.native="handleDel(scope.$index, scope.row)"
                               style="margin-left: 0;"
                               :loading="deleteLoading">删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>


        <!--授权界面-->
        <el-dialog title="授权" :visible.sync="authFormVisible" :close-on-click-modal="false" class="dialog">
            <el-tree
                style="max-height: 75vh;overflow-y: auto;"
                :data="authList"
                show-checkbox
                default-expand-all
                node-key="id"
                ref="tree"
                highlight-current
                :props="defaultProps">
            </el-tree>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="authFormVisible = !authFormVisible">取消</el-button>
                <el-button type="primary" @click.native="authSubmit()" :loading="authLoading">提交
                </el-button>
            </div>
        </el-dialog>

        <!--编辑界面-->
        <el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editFormData" :rules="editFormRules" ref="editFormData">
                <el-form-item label="角色名称" prop="name">
                    <el-input v-model="editFormData.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="排序" prop="listorder">
                    <el-input type="" v-model="editFormData.listorder" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-radio-group v-model="editFormData.status">
                        <el-radio label="0">禁用</el-radio>
                        <el-radio label="1">正常</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input type="textarea" v-model="editFormData.remark"></el-input>
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
                <el-form-item label="角色名称" prop="name">
                    <el-input v-model="addFormData.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="排序" prop="listorder">
                    <el-input type="" v-model="addFormData.listorder" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-radio-group v-model="addFormData.status">
                        <el-radio label="0">禁用</el-radio>
                        <el-radio label="1">正常</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input type="textarea" v-model="addFormData.remark"></el-input>
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
    import { getRoleList, roleAuthList, roleAuth, roleSave, roleEdit, roleDelete } from '../../../api/role'
    export default {
        data () {
            return {
                query: {
                    name: '',
                    status: ''
                },
                list: [],
                loading: true,
                authList: [],
                defaultProps: {
                    children: 'children',
                    label: 'title'
                },
                authLoading: false,
                authFormVisible: false,
                authFormData: {
                    role_id: '',
                    auth_rules: []
                },
                authFormRules: {
                    name: [
                        {required: true, message: '请输入名称', trigger: 'blur'}
                    ],
                    status: [
                        {required: true, message: '请选择状态', trigger: 'change'}
                    ]
                },
                addLoading: false,
                addFormVisible: false,
                addFormData: {
                    name: '',
                    status: '',
                    remark: '',
                    listorder: 999
                },
                addFormDataRules: {
                    name: [
                        {required: true, message: '请输入名称', trigger: 'blur'}
                    ],
                    status: [
                        {required: true, message: '请选择状态', trigger: 'change'}
                    ]
                },
                editLoading: false,
                editFormVisible: false,
                editFormData: {
                    id: '',
                    name: '',
                    status: '',
                    remark: '',
                    listorder: ''
                },
                editIndex: '', // 当前编辑数组下标
                editFormRules: {
                    name: [
                        {required: true, message: '请输入名称', trigger: 'blur'}
                    ],
                    status: [
                        {required: true, message: '请选择状态', trigger: 'change'}
                    ]
                },
                deleteLoading: false
            }
        },
        methods: {
            onSubmit () {
                this.getList()
            },
            getList () {
                this.loading = true
                getRoleList(this.query).then(response => {
                    this.loading = false
                    this.list = response || []
                }).catch(() => {
                    this.loading = false
                    this.list = []
                })
            },
            // 删除
            handleDel (index, row) {
                if (row.id) {
                    this.$confirm('确认删除该记录吗?', '提示', {
                        type: 'warning'
                    }).then(() => {
                        this.deleteLoading = true
                        let para = {id: row.id}
                        roleDelete(para).then((res) => {
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
                                this.list.splice(index, 1)
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
            // 显示授权界面
            handleAuth (roleId) {
                this.authFormVisible = true
                this.authFormData.role_id = roleId
                this.authFormData.auth_rules = []
                this.authList = []
                roleAuthList({id: roleId}).then(response => {
                    this.authList = response.auth_list || []
                    const checkedKeys = response.checked_keys || []
                    this.$refs.tree.setCheckedKeys(checkedKeys)
                }).catch(() => {
                })
            },
            authSubmit () {
                this.authLoading = true
                this.authFormData.auth_rules = this.$refs.tree.getCheckedKeys()
                if (!this.authFormData) {
                    this.$alert('请至少选择一个权限', '提示', {
                        confirmButtonText: '确定'
                    })
                    return false
                }
                roleAuth(this.authFormData).then(res => {
                    this.authLoading = false
                    if (res.errcode) {
                        this.$message({
                            message: res.errmsg,
                            type: 'error'
                        })
                    } else {
                        this.$message({
                            message: '授权成功',
                            type: 'success'
                        })
                        // 刷新表单
                        this.authFormVisible = false
                    }
                }).catch(() => {
                    this.editLoading = false
                })
            },
            // 显示编辑界面
            handleEdit (index, row) {
                this.editFormVisible = true
                this.editFormData = Object.assign({}, row)
                this.editFormData.status += '' // 转为字符串（解决默认选中的时候字符串和数字不能比较的问题）
                this.editIndex = index
            },
            editSubmit (formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        this.editLoading = true
                        let data = Object.assign({}, this.editFormData)
                        roleEdit(data).then(res => {
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
                                // 编辑数组
                                this.list.splice(this.editIndex, 1, data)
                            }
                        }).catch(() => {
                            this.editLoading = false
                        })
                    }
                })
            },
            // 显示新增界面
            handleAdd () {
                this.addFormVisible = true
                this.addFormData = {
                    name: '',
                    status: '',
                    remark: '',
                    listorder: 999
                }
            },
            addSubmit (formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        this.addLoading = true
                        let data = Object.assign({}, this.addFormData)
                        roleSave(data).then(res => {
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
                                // 向头部添加数据
                                // this.list.unshift(res)
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

    .dialog .el-dialog{
        margin-top: 3vh !important;
    }

</style>
