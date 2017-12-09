<template>

    <div>
        <el-form :inline="true" :model="query" class="query-form" size="mini">
            <el-form-item class="query-form-item">
                <el-input v-model="query.username" placeholder="用户名"></el-input>
            </el-form-item>
            <el-form-item class="query-form-item">
                <el-select v-model="query.status" placeholder="状态">
                    <!--<el-option label="状态" value=""></el-option>-->
                    <el-option label="禁用" value="0"></el-option>
                    <el-option label="正常" value="1"></el-option>
                    <el-option label="未验证" value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item class="query-form-item">
                <el-select v-model="query.role_id" placeholder="角色">
                    <el-option label="全部角色" value=""></el-option>
                    <el-option v-for="item in roles" :key="item.id" :label="item.name" :value="item.id"></el-option>
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
                label="用户 ID"
                prop="id"
                fixed>
            </el-table-column>
            <el-table-column
                label="用户名"
                prop="username"
                fixed>
            </el-table-column>
            <el-table-column
                label="状态">
                <template slot-scope="scope">
                    <el-tag :type="scope.row.status | statusFilterType">{{scope.row.status | statusFilterName}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column
                label="登录时间"
                with="300">
                <template slot-scope="scope">
                    <i class="el-icon-time"></i>
                    <span style="margin-left: 10px">{{ scope.row.last_login_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="登录IP">
                <template slot-scope="scope">
                    <span>{{ scope.row.last_login_ip }}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="操作"
                fixed="right">
                <template slot-scope="scope">
                    <el-button size="small" @click.native="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button type="danger" size="small" @click.native="handleDel(scope.$index, scope.row)"
                               style="margin-left: 0;">删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页-->
        <div v-show="!loading" class="pagination-container">
            <el-pagination
                layout="prev, pager, next"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :page-size="query.limit"
                :current-page.sync="query.page"
                :total="total">
            </el-pagination>
        </div>

        <!--编辑界面-->
        <el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editFormData" :rules="editFormRules" ref="editFormData">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="editFormData.username" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="登录密码" prop="password">
                    <el-input type="password" v-model="editFormData.password" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-radio-group v-model="editFormData.status">
                        <el-radio label="0">禁用</el-radio>
                        <el-radio label="1">正常</el-radio>
                        <el-radio label="2">未验证</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="角色">
                    <el-checkbox-group v-model="editFormData.roles">
                        <el-checkbox v-for="item in roles" :key="item.id" :label="item.id">{{item.name}}</el-checkbox>
                    </el-checkbox-group>
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
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addFormData.username" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="登录密码" prop="password">
                    <el-input type="password" v-model="addFormData.password" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="checkPassword">
                    <el-input type="password" v-model="addFormData.checkPassword" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-radio-group v-model="addFormData.status">
                        <el-radio label="0">禁用</el-radio>
                        <el-radio label="1">正常</el-radio>
                        <el-radio label="2">未验证</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="角色">
                    <el-checkbox-group v-model="addFormData.roles">
                        <el-checkbox v-for="item in roles" :key="item.id" :label="item.id">{{item.name}}</el-checkbox>
                    </el-checkbox-group>
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
    import { getAdminList, adminSave, adminEdit, adminDelete } from '../../../api/admin'
    export default {
        data () {
            var validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'))
                } else {
                    if (this.addFormData.checkPassword !== '') {
                        this.$refs.addFormData.validateField('checkPassword')
                    }
                    callback()
                }
            }
            var validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'))
                } else if (value !== this.addFormData.password) {
                    callback(new Error('两次输入密码不一致!'))
                } else {
                    callback()
                }
            }
            return {
                roles: [],
                query: {
                    username: '',
                    status: '',
                    page: 1,
                    limit: 20,
                    role_id: ''
                },
                list: [],
                total: 0,
                loading: true,
                addLoading: false,
                addFormVisible: false,
                addFormData: {
                    username: '',
                    password: '',
                    checkPassword: '',
                    status: 1,
                    roles: []
                },
                addFormDataRules: {
                    username: [
                        {required: true, message: '请输入姓名', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                        {validator: validatePass, trigger: 'blur'}
                    ],
                    checkPassword: [
                        {required: true, message: '请再次输入密码', trigger: 'blur'},
                        {validator: validatePass2, trigger: 'blur'}
                    ],
                    status: [
                        {required: true, message: '请选择状态', trigger: 'change'}
                    ]
                },
                editLoading: false,
                editFormVisible: false,
                editFormData: {
                    id: '',
                    username: '',
                    password: '',
                    status: 0,
                    roles: []
                },
                editIndex: '', // 当前编辑数组下标
                editFormRules: {
                    username: [
                        {required: true, message: '请输入姓名', trigger: 'blur'}
                    ],
                    status: [
                        {required: true, message: '请选择状态', trigger: 'change'}
                    ]
                }
            }
        },
        methods: {
            onSubmit () {
                this.getList()
            },
            handleSizeChange (val) {
                this.query.limit = val
                this.getList()
            },
            handleCurrentChange (val) {
                this.query.page = val
                this.getList()
            },
            getList () {
                this.loading = true
                getAdminList(this.query).then(response => {
                    this.loading = false
                    this.list = response.admin_list.data || []
                    this.total = response.admin_list.total || 0
                    this.roles = response.role_list || []
                }).catch(() => {
                    this.loading = false
                    this.list = []
                    this.total = 0
                    this.roles = []
                })
            },
            // 删除
            handleDel (index, row) {
                if (row.id) {
                    this.$confirm('确认删除该记录吗?', '提示', {
                        type: 'warning'
                    }).then(() => {
                        this.loading = true
                        let para = {id: row.id}
                        adminDelete(para).then((res) => {
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
                        adminEdit(data).then(res => {
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
                        })
                    }
                })
            },
            // 显示新增界面
            handleAdd () {
                this.addFormVisible = true
                this.addFormData = {
                    username: '',
                    password: '',
                    checkPassword: '',
                    status: '',
                    roles: []
                }
            },
            addSubmit (formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        this.addLoading = true
                        let data = Object.assign({}, this.addFormData)
                        adminSave(data).then(res => {
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
                        })
                    }
                })
            }
        },
        filters: {
            statusFilterType (status) {
                const statusMap = {
                    0: 'gray',
                    1: 'success',
                    2: 'danger'
                }
                return statusMap[status]
            },
            statusFilterName (status) {
                const statusMap = {
                    0: '禁用',
                    1: '正常',
                    2: '未验证'
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
