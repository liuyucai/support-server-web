<template>
    <div class="page-container personCenter-page">

        <div class="base-container">
            <div style="width: 100px; height: 100px">
                <el-image style="width: 100px; height: 100px" v-if="user.avatar" :src="fileServerUrl+user.avatar" fit="contain" />
            </div>

            <el-descriptions column="3">
                <el-descriptions-item label="账号名称">{{user.userName}}</el-descriptions-item>
                <el-descriptions-item label="账号类型">{{user.accountType == "COMMON"?"普通账号":"临时账号"}}</el-descriptions-item>
                <el-descriptions-item label="姓名">{{user.realName}}</el-descriptions-item>
                <el-descriptions-item label="性别">
                    <el-tag v-if="user.gender == 'M'">男</el-tag>
                    <el-tag v-if="user.gender == 'F'">女</el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="证件类型">{{user.identityType?user.identityType:"-"}}</el-descriptions-item>
                <el-descriptions-item label="证件号码">{{user.identityNo?user.identityNo:"-"}}</el-descriptions-item>
                <el-descriptions-item label="手机号码">{{user.phoneNo?user.phoneNo:"-"}}</el-descriptions-item>
                <el-descriptions-item label="邮箱">{{user.email?user.email:"-"}}</el-descriptions-item>
                <el-descriptions-item label="注册时间">{{user.createTime?user.createTime:"-"}}</el-descriptions-item>
            </el-descriptions>
        </div>

        <div class="body-container">
            <el-tabs v-model="activeTabName" class="demo-tabs" @tab-change="tabChange">
                <el-tab-pane label="基础信息" name="baseInfo">
                    <div class="baseInfo-container tab-container">
                        <el-form :model="orgUserInfo" label-width="110px" ref="addForm" :rules="rules">
                            <el-form-item label="用户昵称" prop="nickName">
                                <el-input v-model="orgUserInfo.nickName" readonly/>
                            </el-form-item>

                            <el-form-item label="归属机构" prop="orgName">
                                <el-input v-model="orgUserInfo.orgName" readonly/>
                            </el-form-item>

                            <el-form-item label="角色">
                                <el-select v-model="orgUserInfo.roleIds" multiple readonly>
                                    <el-option
                                            v-for="item in orgUserInfo.roleList"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>

                            <el-form-item label="描述" prop="description">
                                <el-input
                                        v-model="orgUserInfo.description"
                                        type="textarea"
                                        readonly/>
                            </el-form-item>

                        </el-form>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="安全设置" name="securitySetting">
                    <div class="securitySetting-container tab-container">
                        <div class="list-item">
                            <div class="list-item-title">登录密码</div>
                            <div class="list-item-content">
                                <div class="content">
                                    <span v-if="user.hasPassword">已设置</span>
                                    <span v-if="!user.hasPassword" style="color: #909399">未设置</span>
                                    。密码至少6位字符，支持数字、字母和除空格外的特殊字符，且必须同时包含数字和大小写字母。
                                </div>
                                <div class="operate">
                                    <span class="operate-item" @click="resetPwdDialogVisible = true">重置密码</span>
                                    <span class="operate-item" @click="updatePasswordClick">修改</span>
                                </div>
                            </div>
                        </div>

                        <div class="list-item">
                            <div class="list-item-title">安全手机</div>
                            <div class="list-item-content">
                                <div class="content">
                                    <span v-if="user.phoneNo">已设置。以绑定手机号{{user.phoneNo}}。</span>
                                    <span v-if="!user.phoneNo" style="color: #909399">未设置</span>
                                </div>
                                <div class="operate">
                                    <span class="operate-item" v-if="user.phoneNo" @click="unbindPhoneDialogVisible= true">解绑</span>
                                    <span class="operate-item" v-if="user.phoneNo" @click="bindPhoneDialogVisible= true">修改</span>
                                    <span class="operate-item" v-if="!user.phoneNo" @click="bindPhoneDialogVisible= true">绑定</span>
                                </div>
                            </div>
                        </div>

                        <div class="list-item">
                            <div class="list-item-title">安全邮箱</div>
                            <div class="list-item-content">
                                <div class="content">
                                    <span v-if="user.email">已设置</span>
                                    <span v-if="!user.email" style="color: #909399">未设置</span>
                                </div>
                                <div class="operate">
                                    <span class="operate-item" v-if="user.email">解绑</span>
                                    <span class="operate-item" v-if="user.email" @click="bindEmailDialogVisible= true">修改</span>
                                    <span class="operate-item" v-if="!user.email" @click="bindEmailDialogVisible= true">绑定</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="关联用户" name="orgUserInfo">
                    <div class="other-container tab-container">
                        <div class="table-container">
                            <el-table :data="userTableData" style="width: 100%">
                                <el-table-column prop="nickName" label="用户昵称"/>
                                <el-table-column prop="orgName" label="所属机构"/>
                                <el-table-column prop="type" label="用户类型" width="100">
                                    <template #default="scope">
                                        <el-tag class="ml-2" v-if="scope.row.type == '1'">主用户</el-tag>
                                        <el-tag class="ml-2" type="info" v-if="scope.row.type == '0'">普通用户</el-tag>
                                    </template>
                                </el-table-column>

                                <el-table-column prop="enabled" label="状态" width="80">
                                    <template #default="scope">
                                        <span v-if="scope.row.enabled == '1'">有效</span>
                                        <span v-if="scope.row.enabled == '0'">禁用</span>
                                    </template>
                                </el-table-column>

                                <el-table-column prop="createTime" label="创建时间" width="170"/>
<!--                                <el-table-column label="操作" width="120">-->
<!--                                    <template #default="scope">-->
<!--                                        &lt;!&ndash;只有主账号才可以删除，&ndash;&gt;-->
<!--                                        <span class="column-operate-span" style="padding-left: 0" @click="deleteUserClick(scope.row)">删除</span>-->
<!--                                    </template>-->
<!--                                </el-table-column>-->
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
                                    @current-change="handleCurrentChange"/>
                        </div>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>

        <!--修改密码-->
        <el-dialog
                @close="editPasswordDialogClose"
                v-model="editPasswordDialogVisible"
                title="修改密码" width="500"
                draggable>
            <div>
                <el-form :model="editPasswordForm"  label-width="80px" ref="editPasswordForm" :rules="editPasswordRules">
                    <el-form-item label="旧密码" prop="oldPassword">
                        <el-input v-model="editPasswordForm.oldPassword" placeholder="请输入旧密码"/>
                    </el-form-item>

                    <el-form-item label="新密码" prop="newPassword">
                        <el-input v-model="editPasswordForm.newPassword" placeholder="请输入新密码"/>
                    </el-form-item>

                    <el-form-item label="确认密码" prop="confirmPassword">
                        <el-input v-model="editPasswordForm.confirmPassword" placeholder="请输入确认密码"/>
                    </el-form-item>
                </el-form>
            </div>
            <template #footer>
              <span class="dialog-footer">
                <el-button @click="editPasswordDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="updatePassword()">确定</el-button>
              </span>
            </template>
        </el-dialog>

        <!--重置密码弹框-->
        <el-dialog
                v-model="resetPwdDialogVisible"
                title="提示" width="400px"
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

        <!--绑定手机-->
        <el-dialog
                @close="bindPhoneClose"
                v-model="bindPhoneDialogVisible"
                title="绑定手机号" width="500"
                draggable>
            <div>
                <el-form :model="bindPhoneForm"  label-width="80px" ref="bindPhoneForm" :rules="bindPhoneRules">
                    <el-form-item label="手机号" prop="phoneNo">
                        <el-input v-model="bindPhoneForm.phoneNo" placeholder="请输入手机号"/>
                    </el-form-item>
                </el-form>
            </div>
            <template #footer>
              <span class="dialog-footer">
                <el-button @click="bindPhoneDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="bindPhoneConfirm()">确定</el-button>
              </span>
            </template>
        </el-dialog>

        <!--解绑手机号弹框-->
        <el-dialog
                v-model="unbindPhoneDialogVisible"
                title="提示" width="400px"
                draggable>
            <span>确认解绑该手机号吗？</span>
            <template #footer>
              <span class="dialog-footer">
                <el-button @click="unbindPhoneDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="unbindPhoneConfirm()">
                  确定
                </el-button>
              </span>
            </template>
        </el-dialog>

        <!--绑定邮箱-->
        <el-dialog
                @close="bindEmailClose"
                v-model="bindEmailDialogVisible"
                title="绑定邮箱" width="500"
                draggable>
            <div>
                <el-form :model="bindEmailForm"  label-width="80px" ref="bindPhoneForm" :rules="bindEmailRules">
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="bindPhoneForm.email" placeholder="请输入邮箱"/>
                    </el-form-item>
                </el-form>
            </div>
            <template #footer>
              <span class="dialog-footer">
                <el-button @click="bindEmailDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="bindEmailConfirm()">确定</el-button>
              </span>
            </template>
        </el-dialog>

        <!--解绑邮箱弹框-->
        <el-dialog
                v-model="unbindEmailDialogVisible"
                title="提示" width="400px"
                draggable>
            <span>确认解绑该邮箱吗？</span>
            <template #footer>
              <span class="dialog-footer">
                <el-button @click="unbindEmailDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="unbindEmailConfirm()">
                  确定
                </el-button>
              </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>
    import "@/assets/styles/common.css"
    import personCenter from '@/js/personCenter/index';
    import Icon from "@/components/icon";
    export default {
        components: {Icon},
        ...personCenter,
    }
</script>

<style lang="scss" scoped>

    .base-container{
        display: inline-flex;
        width: 100%;
        margin-bottom: 20px;
    }
    ::v-deep.base-container .el-image{
        margin-right: 54px;
        border-radius: 50%;
    }
    ::v-deep.base-container .el-descriptions__label{
        display: inline-block;
        text-align: right;
        width: 140px;
    }
    ::v-deep.base-container .el-descriptions__content{
        display: inline-block;
        min-width: 200px;
    }
    .baseInfo-container{
        width: 540px;
        margin: 0 auto;
    }
    .tab-container{
        padding-top: 20px;
        padding-bottom: 30px;
    }
    .securitySetting-container{
        .list-item{
            display: flex;
            padding-bottom: 20px;
            .list-item-title{
                margin-right: 16px;
            }
            .list-item-content{
                border-bottom: 1px solid rgb(229,230,235);
                width: 100%;
                flex: 1;
                display: flex;
                .content{
                    margin-bottom: 20px;
                }
                .operate{
                    margin-left: auto;
                    color:var(--theme-color);
                    .operate-item{
                        padding: 0 8px;
                        cursor: pointer;
                    }
                }
            }
        }
    }

</style>