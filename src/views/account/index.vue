<template>
    <div class="page-container account-page">
        <div class="search-container">
            <el-form :inline="true" :model="searchForm" class="demo-form-inline">
                <el-form-item label="账号名称">
                    <el-input v-model="searchForm.userName" placeholder="请输入账号名称" />
                </el-form-item>
                <el-form-item label="手机号">
                    <el-input v-model="searchForm.phoneNo" placeholder="请输入手机号" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSearch">查询</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="body-container">
            <div class="operate-container">
                <el-button type="primary" @click="addBtnClick">新 增</el-button>
            </div>
            <div class="table-container">
                <el-table :data="tableData" style="width: 100%">
                    <el-table-column prop="avatar" label="用户头像">
                        <template #default="scope">
                            <el-image style="width: 45px; height: 45px;border-radius: 50%" :src="fileServerUrl+scope.row.avatar" fit="contain" />
                        </template>
                    </el-table-column>
                    <el-table-column prop="userName" label="账号名称"/>
                    <el-table-column prop="realName" label="姓名"/>
                    <el-table-column prop="phoneNo" label="手机号"/>
                    <el-table-column prop="enabled" label="状态">
                        <template #default="scope">
                            <span v-if="scope.row.enabled == '1'">有效</span>
                            <span v-if="scope.row.enabled == '0'">禁用</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="accountType" label="账号类型">
                        <template #default="scope">
                            <span>{{formatAccountType(scope.row.accountType)}}</span>
                        </template>
                    </el-table-column>

                    <el-table-column prop="createTime" label="创建时间" width="200"/>
                    <el-table-column label="操作" width="200">
                        <template #default="scope">
                            <span class="column-operate-span" @click="editClick(scope.row)">编辑</span>
                            <span class="column-operate-span" @click="deleteClick(scope.row)">删除</span>
                            <span class="column-operate-span" @click="resetPwdClick(scope.row)">重置密码</span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="pagination-container clearfix">
                <el-pagination
                        style="float: right"
                        v-model:current-page="page.currentPage"
                        v-model:page-size="page.pageSize"
                        :page-sizes="[10, 20, 30, 40]"
                        :background="true"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="page.total"
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                />
            </div>
        </div>

        <!--新增用户弹框-->
        <el-dialog
                @close="dialogClose"
                v-model="dialogVisible"
                :title="dialogTitle" width="50%"
                draggable>
            <div>
                <el-form :model="addForm" label-width="110px" ref="addForm" :rules="rules">

                    <el-form-item label="头像">
                        <el-upload
                                class="avatar-uploader"
                                :action="uploadUrl"
                                :headers="headers"
                                :show-file-list="false"
                                :on-success="handleAvatarSuccess"
                                :before-upload="beforeAvatarUpload">
                            <img v-if="addForm.avatar" :src="fileServerUrl+addForm.avatar" class="avatar" />
                            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
                        </el-upload>
                    </el-form-item>

                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="账号名称" prop="userName">
                                <el-input v-model="addForm.userName" placeholder="请输入账号名称"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="姓名" prop="realName">
                                <el-input v-model="addForm.realName" placeholder="请输入姓名"/>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="密码" prop="password">
                                <el-input v-model="addForm.password" type="password" :disabled="addForm.id ? true:false"  show-password placeholder="请输入密码"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="手机号" prop="phoneNo">
                                <el-input v-model="addForm.phoneNo" placeholder="请输入手机号"/>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="证件类型" prop="identityType">
                                <el-select v-model="addForm.identityType" placeholder="请选择证件类型">
                                    <el-option
                                            v-for="item in identityTypeList"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="证件号码" prop="identityNo">
                                <el-input v-model="addForm.identityNo" placeholder="请输入证件号码"/>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="性别" prop="gender">
                                <el-select v-model="addForm.gender" placeholder="请选择性别">
                                    <el-option
                                            v-for="item in genderList"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="邮箱" prop="email">
                                <el-input v-model="addForm.email" placeholder="请输入邮箱"/>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="状态" prop="enabled">
                                <el-radio-group v-model="addForm.enabled">
                                    <el-radio-button
                                            v-for="(item, index) in enabledList"
                                            :label="item.value"
                                            :key="index">{{item.label}}
                                    </el-radio-button>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="账号类型" prop="accountType">
                                <el-select v-model="addForm.accountType" placeholder="请选择账号类型">
                                    <el-option
                                            v-for="item in accountTypeList"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row v-if="addForm.accountType == 'TEMP'">
                        <el-col :span="12">
                            <el-form-item label="有效截止时间" prop="effectiveDeadline">
                                <el-date-picker
                                        v-model="addForm.effectiveDeadline"
                                        type="datetime"
                                        placeholder="请输入有效截止时间"/>
                            </el-form-item>
                        </el-col>
                    </el-row>


                </el-form>
            </div>
            <template #footer>
              <span class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="saveInfo()">
                  确定
                </el-button>
              </span>
            </template>
        </el-dialog>

        <!--删除用户弹框-->
        <el-dialog
                v-model="deleteDialogVisible"
                title="提示" width="200px"
                draggable>
            <span>删除账号会删除广联的用户信息，是否确认删除？</span>
            <template #footer>
              <span class="dialog-footer">
                <el-button @click="deleteDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="deleteConfirm()">
                  确定
                </el-button>
              </span>
            </template>
        </el-dialog>

        <!--重置密码弹框-->
        <el-dialog
                v-model="resetPwdDialogVisible"
                title="提示" width="200px"
                draggable>
            <span>是否确认重置密码？</span>
            <template #footer>
              <span class="dialog-footer">
                <el-button @click="resetPwdDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="resetPwdConfirm()">
                  确定
                </el-button>
              </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>
    import "@/assets/styles/common.css"

    import userAccount from '@/js/account/index';
    export default {
        ...userAccount,
    }

</script>

<style scoped>

    ::v-deep .avatar-uploader .avatar {
        width: 100px;
        height: 100px;
        display: block;
    }

    ::v-deep.avatar-uploader .el-upload {
        border: 1px dashed var(--el-border-color);
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        transition: var(--el-transition-duration-fast);
    }

    ::v-deep.avatar-uploader .el-upload:hover {
        border-color: var(--el-color-primary);
    }

    ::v-deep.el-icon.avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 100px;
        height: 100px;
        text-align: center;
    }
    ::v-deep .el-select{
        width: 100%;
    }
    ::v-deep .left-tree-container .is-current{

    }
    ::v-deep .left-tree-container .el-tree-node.active>.el-tree-node__content {
        color: #409eff;
        background: #ecf5ff;
    }
    .role-container{
        height: 100%;
    }
    .left-tree-container{
        background-color: #fff;
        width: 100%;
        height: 100%;
        border-radius: 4px;
        box-sizing: border-box;
        padding: 10px;
    }
</style>