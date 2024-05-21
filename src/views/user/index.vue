<template>
    <div class="page-container role-container">

        <el-container style="height: 100%">
            <el-aside width="200px" style="padding-right: 10px">
                <div class="left-tree-container">
                    <el-input v-model="filterText" placeholder="请输入机构名称" />
                    <el-tree
                            style="padding-top: 20px"
                            ref="treeRef"
                            class="filter-tree"
                            :data="orgTreeData"
                            :props="defaultProps"
                            default-expand-all
                            :expand-on-click-node=false
                            :filter-node-method="filterNode"
                            @node-click="orgClick"/>
                </div>
            </el-aside>
            <el-main style="padding: 0">
                <div class="search-container">
                    <el-form :inline="true" :model="searchForm" class="demo-form-inline">
                        <el-form-item label="用户名">
                            <el-input v-model="searchForm.userName" placeholder="请输入用户名" />
                        </el-form-item>
                        <el-form-item label="手机号">
                            <el-input v-model="searchForm.phoneNo" placeholder="请输入手机号" />
                        </el-form-item>
                        <el-form-item label="查找范围">
                            <el-select
                                    v-model="searchForm.queryRang"
                                    placeholder="请选择查找范围">
                                <el-option label="本机构" value="1" />
                                <el-option label="本机构及下级" value="2" />
                            </el-select>
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
                            <el-table-column prop="userName" label="账号名称"/>
                            <el-table-column prop="nickName" label="用户昵称"/>
                            <el-table-column prop="type" label="用户类型">
                                <template #default="scope">
                                    <el-tag class="ml-2" v-if="scope.row.type == '1'">主用户</el-tag>
                                    <el-tag class="ml-2" type="info" v-if="scope.row.type == '0'">普通用户</el-tag>
                                </template>
                            </el-table-column>
                            <el-table-column prop="realName" label="姓名"/>
                            <el-table-column prop="orgName" label="机构名称"/>
                            <el-table-column prop="phoneNo" label="手机号"/>
                            <el-table-column prop="enabled" label="状态" width="80">
                                <template #default="scope">
                                    <el-tag class="ml-2" type="success" v-if="scope.row.enabled == '1'">有效</el-tag>
                                    <el-tag class="ml-2" type="danger" v-if="scope.row.enabled == '0'">禁用</el-tag>
                                </template>
                            </el-table-column>

                            <el-table-column prop="createTime" label="创建时间" width="170"/>
                            <el-table-column label="操作" width="180">
                                <template #default="scope">
                                    <span class="column-operate-span" style="padding-left: 0" @click="addClick(scope.row)">角色管理</span>
                                    <span class="column-operate-span" @click="editClick(scope.row)">编辑</span>

                                    <el-popover :ref="scope.row.id+'delete'" trigger="click" placement="top" :width="160">
                                        <div style="padding-bottom: 8px;">
                                            <span style="padding-right: 8px">
                                                <el-icon><Warning /></el-icon>
                                            </span>
                                            <span>确定删除?</span>
                                        </div>
                                        <div style="text-align: right; margin: 0">
                                            <el-button size="small" text @click="cancelDelete(scope.row)">取消</el-button>
                                            <el-button size="small" type="primary" @click="deleteClick(scope.row)">确定</el-button>
                                        </div>
                                        <template #reference>
                                            <span class="column-operate-span">删除</span>
                                        </template>
                                    </el-popover>

<!--                                    <span class="column-operate-span" @click="deleteClick(scope.row)">删除</span>-->

                                    <el-popover :ref="scope.row.id+'type'" trigger="click" placement="top" :width="180">
                                        <div style="padding-bottom: 8px;">
                                            <span style="padding-right: 8px">
                                                <el-icon><Warning /></el-icon>
                                            </span>
                                            <span>确定切换为主用户?</span>
                                        </div>
                                        <div style="text-align: right; margin: 0">
                                            <el-button size="small" text @click="cancelChange(scope.row)">取消</el-button>
                                            <el-button size="small" type="primary" @click="changeUserTypeClick(scope.row)">确定</el-button>
                                        </div>
                                        <template #reference>
                                            <span class="column-operate-span" style="padding-left: 0">切换主用户</span>
                                        </template>
                                    </el-popover>
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
            </el-main>
        </el-container>


        <el-dialog
                @close="dialogClose"
                v-model="dialogVisible"
                :title="dialogTitle" width="50%"
                draggable>
            <div>
                <el-form :model="addForm" label-width="110px" ref="addForm" :rules="rules">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="用户账号" prop="userName">
                                <el-input
                                        @focus="beforeSelectAccount"
                                        v-model="addForm.userName"
                                        placeholder="请选择用户账号"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="用户昵称" prop="nickName">
                                <el-input v-model="addForm.nickName" placeholder="请输入用户昵称"/>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="归属机构" prop="orgName">
                                <el-select
                                        @change="orgSelectChange"
                                        v-model="addForm.orgName"
                                        ref="treeSelect"
                                        placeholder="请选择归属机构">
                                    <el-option
                                            :key="addForm.orgId"
                                            :label="addForm.orgName"
                                            :value="addForm.orgId"
                                            style="height: auto"
                                            class="tree-select-option">
                                        <div class="filter-div">
                                            <!--                  下面这个input点击要@click.stop.native阻止冒泡事件，否则触发el-option点击，关闭选项框 -->
                                            <el-input
                                                    size="small"
                                                    placeholder="输入关键字进行过滤"
                                                    @click.stop.native="stopBubbing"
                                                    v-model="selectFilterText">
                                            </el-input>
                                        </div>
                                        <el-tree class="select-tree filter-tree"
                                                 ref="selectTree"
                                                 :data="selectTreeData"
                                                 :expand-on-click-node="false"
                                                 node-key="id"
                                                 :check-strictly="true"
                                                 :props="defaultProps"
                                                 :filter-node-method="filterSearchNode"
                                                 @node-click="treeNodeClick">
                                        </el-tree>
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
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
                    </el-row>

                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="角色">
                                <el-select v-model="addForm.roleIds" multiple :disabled="addForm.orgId?false:true" placeholder="请选择角色">
                                    <el-option
                                            v-for="item in roleList"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="描述" prop="description">
                                <el-input
                                        v-model="addForm.description"
                                        type="textarea"
                                        placeholder="请输入描述..."/>
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


        <el-drawer v-model="accountSelectDrawer" direction="rtl" size="50%">
            <template #header>
                <div class="drawer-title">账号选择</div>
            </template>
            <template #default>
                <div>
                    <div class="search-container">
                        <el-form :inline="true" :model="accountSearchForm" class="demo-form-inline">
                            <el-form-item label="账号名称">
                                <el-input v-model="accountSearchForm.name" placeholder="请输入账号名称" />
                            </el-form-item>

                            <el-form-item label="手机号">
                                <el-input v-model="accountSearchForm.phoneNo" placeholder="请输入手机号" />
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="onAccountSearch">查询</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                    <div class="body-container">
                        <div class="table-container">
                            <el-table :data="accountTableData" style="width: 100%">
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

                                <el-table-column label="操作" width="80">
                                    <template #default="scope">
                                        <span class="column-operate-span" style="padding-left: 0" @click="selectClick(scope.row)">选择</span>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                        <div class="pagination-container clearfix">
                            <el-pagination
                                    style="float: right"
                                    v-model:current-page="userAccountPage.currentPage"
                                    v-model:page-size="userAccountPage.pageSize"
                                    :page-sizes="[10, 20, 30, 40]"
                                    :background="true"
                                    layout="total, sizes, prev, pager, next, jumper"
                                    :total="userAccountPage.total"
                                    @size-change="handleUserAccountSizeChange"
                                    @current-change="handleUserAccountCurrentChange"
                            />
                        </div>
                    </div>
                </div>

            </template>
            <template #footer>
                <div style="flex: auto">
                    <el-button type="primary">关闭</el-button>
                </div>
            </template>
        </el-drawer>

        <el-drawer v-model="roleInfoDrawer" direction="rtl" size="60%">
            <template #header>
                <div class="drawer-title">角色管理</div>
            </template>
            <template #default>
                <div>
                    <div class="search-container">
                        <el-form :inline="true" :model="roleSearchForm" class="demo-form-inline">
                            <el-form-item label="角色名称">
                                <el-input v-model="roleSearchForm.name" placeholder="请输入账号名称" />
                            </el-form-item>

                            <el-form-item>
                                <el-button type="primary" @click="onRoleSearch">查询</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                    <div class="body-container">
                        <div class="table-container">
                            <el-table :data="roleTableData" style="width: 100%">
                                <el-table-column prop="name" label="角色名称"/>
                                <el-table-column prop="type" label="角色类型">
                                    <template #default="scope">
                                        <span>{{formatRoleType(scope.row.type)}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="orgName" label="归属机构"/>
                                <el-table-column prop="useScope" label="使用范围">
                                    <template #default="scope">
                                        <span>{{formatUseScope(scope.row.useScope)}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="description" label="描述"/>

                                <el-table-column label="操作" width="80">
                                    <template #default="scope">
                                        <el-switch v-model="scope.row.switch" @change="roleItemChange(scope.row)"/>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                        <div class="pagination-container clearfix">
                            <el-pagination
                                    style="float: right"
                                    v-model:current-page="rolePage.currentPage"
                                    v-model:page-size="rolePage.pageSize"
                                    :page-sizes="[10, 20, 30, 40]"
                                    :background="true"
                                    layout="total, sizes, prev, pager, next, jumper"
                                    :total="rolePage.total"
                                    @size-change="handleRoleSizeChange"
                                    @current-change="handleRoleCurrentChange"
                            />
                        </div>
                    </div>
                </div>

            </template>
            <template #footer>
                <div style="flex: auto">
                    <el-button type="primary">关闭</el-button>
                </div>
            </template>
        </el-drawer>
    </div>
</template>

<script>
    import "@/assets/styles/common.css"

    import user from '@/js/user/index';
    export default {
        ...user,
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