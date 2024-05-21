<template>
    <div class="page-container service-page">

        <div class="search-container">
            <el-form :inline="true" :model="searchForm" class="demo-form-inline">
                <el-form-item label="分组名称">
                    <el-input v-model="searchForm.name" placeholder="请输入客户端分组名称" />
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
                <el-table
                        v-loading = "loading"
                        element-loading-background = "rgba(255, 255, 255, 0.8)"
                        element-loading-text = "数据正在加载中"
                        element-loading-spinner = "el-icon-loading"
                        :data="tableData"
                        style="width: 100%">
                    <el-table-column prop="name" label="服务名称"/>
                    <el-table-column prop="code" label="服务编码"/>
                    <el-table-column prop="description" label="服务描述"/>
                    <el-table-column label="操作" width="120">
                        <template #default="scope">
                            <span class="column-operate-span" style="padding-left: 0" @click="editClick(scope.row)">编辑</span>

                            <span class="column-operate-span" @click="authClick(scope.row)">授权</span>
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

        <el-dialog v-model="dialogVisible" :title="dialogTitle" width="40%" draggable>
            <div>
                <el-form
                        ref="addForm"
                        :model="addForm"
                        :rules="rules"
                        label-width="100px">

                    <el-form-item label="服务名称" prop="name">
                        <el-input v-model="addForm.name" placeholder="请输入分组名称"/>
                    </el-form-item>

                    <el-form-item label="服务编码" prop="code">
                        <el-input v-model="addForm.code" placeholder="请输入服务编码"/>
                    </el-form-item>

                    <el-form-item label="描述" prop="description">
                        <el-input v-model="addForm.description" placeholder="请输入描述" type="textarea"/>
                    </el-form-item>


                </el-form>
            </div>
            <template #footer>
              <span class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveInfo">确 定</el-button>
              </span>
            </template>
        </el-dialog>

        <el-drawer v-model="editDrawer" direction="rtl" size="80%">
            <template #header>
                <div class="drawer-title">编辑</div>
            </template>
            <template #default>
                <el-row :gutter="20" style="height: 100%">
                    <el-col :span="6" style="height: 100%">
                        <div class="lyc-card">
                            <div class="card-header">
                                <span>服务信息</span>
                                <el-icon class="edit-icon" @click="editServiceClick"><Edit /></el-icon>
                            </div>
                            <div class="card-body">
                                <div class="info-item">
                                    <div class="info-name">服务名称：</div>
                                    <div class="info-text">{{editForm.name}}</div>
                                </div>
                                <div class="info-item">
                                    <div class="info-name">服务编码：</div>
                                    <div class="info-text">{{editForm.code}}</div>
                                </div>
                                <div class="info-item">
                                    <div class="info-name">描述：</div>
                                    <div class="info-text">{{editForm.description}}</div>
                                </div>
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="18" style="height: 100%">
                        <div class="lyc-card">
                            <div class="card-header">
                                API信息
                            </div>
                            <div class="card-body">
                                <div class="search-container">
                                    <el-form :inline="true" :model="apiSearchForm" class="demo-form-inline">
                                        <el-form-item label="API地址">
                                            <el-input v-model="apiSearchForm.url" placeholder="请输入API地址" />
                                        </el-form-item>

                                        <el-form-item label="名称">
                                            <el-input v-model="apiSearchForm.name" placeholder="请输入名称" />
                                        </el-form-item>
                                        <el-form-item>
                                            <el-button type="primary" @click="onApiSearch">查询</el-button>
                                        </el-form-item>
                                    </el-form>
                                </div>
                                <div class="body-container">
                                    <div class="operate-container">
                                        <el-button type="primary" @click="addApiBtnClick">新 增</el-button>
                                    </div>
                                    <div class="table-container">
                                        <el-table :data="apiTableData" style="width: 100%" :row-class-name="tableRowClassName">
                                            <el-table-column prop="url" label="API地址"/>
                                            <el-table-column prop="requestMethod" label="请求方法" width="100">

                                                <template #default="scope">
                                                    <el-button type="primary" v-if="scope.row.requestMethod == 'GET'" size="small">GET</el-button>
                                                    <el-button type="success" v-else-if="scope.row.requestMethod == 'POST'" size="small">POST</el-button>
                                                    <el-button type="info" v-else-if="scope.row.requestMethod == 'PATCH'" size="small">PATCH</el-button>
                                                    <el-button type="warning" v-else-if="scope.row.requestMethod == 'PUT'" size="small">PUT</el-button>
                                                    <el-button type="danger" v-else-if="scope.row.requestMethod == 'DELETE'" size="small">DELETE</el-button>
                                                    <el-button  v-else>{{scope.row.requestMethod}}</el-button>
                                                </template>

                                            </el-table-column>
                                            <el-table-column prop="name" label="名称"/>
                                            <el-table-column prop="authStatus" label="鉴权" width="60">
                                                <template #default="scope">

                                                    <el-tag v-if="scope.row.authStatus == '1'">是</el-tag>
                                                    <el-tag v-if="scope.row.authStatus == '0'" class="ml-2" type="warning">否</el-tag>
                                                </template>
                                            </el-table-column>
                                            <el-table-column prop="sourceType" label="来源" width="60">
                                                <template #default="scope">
                                                    <span v-if="scope.row.sourceType == 'SYSTEM'">系统</span>
                                                    <span v-if="scope.row.sourceType != 'SYSTEM'">人工</span>
                                                </template>
                                            </el-table-column>

                                            <el-table-column label="操作" width="120">
                                                <template #default="scope">
                                                    <!--只有人工添加的才可以编辑-->
                                                    <span class="disable-column-operate-span" style="padding-left: 0" v-if="scope.row.compareStatus == '0'">编辑</span>
                                                    <span class="column-operate-span" style="padding-left: 0" @click="editApiClick(scope.row)" v-if="scope.row.compareStatus != '0'">编辑</span>
                                                    <!--比对失败的、和用户手动添加的可以删除-->
                                                    <span class="column-operate-span"  @click="deleteApiClick(scope.row)">删除</span>
                                                </template>
                                            </el-table-column>
                                        </el-table>
                                    </div>
                                    <div class="pagination-container clearfix">
                                        <el-pagination
                                                style="float: right"
                                                v-model:current-page="apiPage.currentPage"
                                                v-model:page-size="apiPage.pageSize"
                                                :page-sizes="[10, 20, 30, 40]"
                                                :background="true"
                                                layout="total, sizes, prev, pager, next, jumper"
                                                :total="apiPage.total"
                                                @size-change="handleApiSizeChange"
                                                @current-change="handleApiCurrentChange"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </el-col>
                </el-row>

            </template>
<!--            <template #footer>-->
<!--                <div style="flex: auto">-->
<!--                    <el-button type="primary">关闭</el-button>-->
<!--                </div>-->
<!--            </template>-->
        </el-drawer>


        <el-dialog v-model="dialogApiVisible" :title="dialogApiTitle" width="40%" draggable @close="addApiDialogClose">
            <div>
                <el-form
                        ref="addApiForm"
                        :model="addApiForm"
                        :rules="apiRules"
                        label-width="100px">

                    <el-form-item label="请求类型" prop="requestMethod">
                        <el-radio-group v-model="addApiForm.requestMethod" :disabled="editApiDisabled">
                            <el-radio-button
                                    v-for="(item, index) in requestMethodList"
                                    :label="item.value"
                                    :key="index">{{item.label}}
                            </el-radio-button>
                        </el-radio-group>
                    </el-form-item>

                    <el-form-item label="API地址" prop="url">
                        <el-input v-model="addApiForm.url" placeholder="请输入API地址" :disabled="editApiDisabled"/>
                    </el-form-item>

                    <el-form-item label="API名称" prop="name">
                        <el-input v-model="addApiForm.name" placeholder="请输入API名称" :disabled="editApiDisabled"/>
                    </el-form-item>

                    <el-form-item label="权限标识" prop="permission">
                        <el-input v-model="addApiForm.permission" placeholder="请输入权限标识" :disabled="addApiForm.permissionType == 'CODE'"/>
                    </el-form-item>

                    <el-form-item label="是否鉴权" prop="authStatus">
                        <el-radio-group v-model="addApiForm.authStatus">
                            <el-radio-button
                                    v-for="(item, index) in authStatusList"
                                    :label="item.value"
                                    :key="index">{{item.label}}
                            </el-radio-button>
                        </el-radio-group>
                    </el-form-item>

                    <el-form-item label="控制器" prop="handler">
                        <el-input v-model="addApiForm.handler" placeholder="请输入控制器名称" :disabled="editApiDisabled"/>
                    </el-form-item>
                </el-form>
            </div>
            <template #footer>
              <span class="dialog-footer">
                <el-button @click="dialogApiVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveApi">确 定</el-button>
              </span>
            </template>
        </el-dialog>


        <el-drawer v-model="authServiceDrawer" direction="rtl" size="70%">
            <template #header>
                <div class="drawer-title">服务授权</div>
            </template>
            <template #default>
                <div style="height: 100%">
                    <el-row :gutter="20">
                        <el-col :span="8" v-for="(item, index) in authServiceData">
                            <div class="service-item-card">
                                <div class="item-column">
                                    <div class="column-title">服务名称：</div>
                                    <div class="column-text" style="padding-right: 60px">{{item.name}}</div>
                                    <el-switch
                                            style="position: absolute;top: 0;right: 0;height: 20px"
                                            @change="serviceSwitchChange(item)"
                                            v-model="item.switch"
                                            class="ml-2"
                                            inline-prompt
                                            active-value="1"
                                            inactive-value="0"
                                            active-text="开启"
                                            inactive-text="关闭"
                                    />
                                </div>
                                <div class="item-column">
                                    <div class="column-title">服务编码：</div>
                                    <div class="column-text">{{item.code}}</div>
                                </div>
                                <div class="item-column" style="margin-bottom: 0">
                                    <div class="column-title">描述：</div>
                                    <div class="column-text">{{item.description}}</div>
                                </div>
                            </div>
                        </el-col>
                    </el-row>
                    <div class="pagination-container clearfix">
                        <el-pagination
                                style="float: right"
                                v-model:current-page="authServicePage.currentPage"
                                v-model:page-size="authServicePage.pageSize"
                                :page-sizes="[9, 18, 27, 36]"
                                :background="true"
                                layout="total, sizes, prev, pager, next, jumper"
                                :total="authServicePage.total"
                                @size-change="handleAuthServicePageChange"
                                @current-change="handleAuthServiceCurrentChange"
                        />
                    </div>
                </div>

            </template>
            <!--            <template #footer>-->
            <!--                <div style="flex: auto">-->
            <!--                    <el-button type="primary">关闭</el-button>-->
            <!--                </div>-->
            <!--            </template>-->
        </el-drawer>


    </div>
    
</template>

<script>
    import "@/assets/styles/common.css"
    import service from '@/js/service/index';
    export default {
        ...service,
    }
</script>

<style lang="scss" scoped>
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

    .lyc-card{
        border: 1px solid #e4e7ed;
        height: 100%;
        box-sizing: border-box;
        .card-header{
            display: flex;
            align-items: center;
            border-bottom:1px solid #e4e7ed;
            padding: 0 20px;
            text-align: left;
            height: 50px;
            line-height: 50px;
            font-weight: bold;
            color: rgb(84, 92, 100);
            .edit-icon{
                margin-left: auto;
                font-size: 20px;
                cursor: pointer
            }
            .edit-icon:hover{
                color: var(--el-color-primary);
            }
        }
        .card-body{
            padding: 20px;
            height: calc(100% - 50px);

            .info-item{
                display: flex;
                align-items: center;
                line-height: 30px;
                margin-bottom: 10px;
            }
            .search-container{
                padding-top: 10px;
                margin-bottom: 10px;
            }
            .body-container{
                height: calc(100% - 70px);
                box-sizing: border-box;
                position: relative;
                .table-container{
                    height: 100%;
                    padding-bottom: 100px;
                }
                .pagination-container{
                    position: absolute;
                    bottom: 0;
                    width: 100%;
                }
            }
        }
    }
    ::v-deep .card-body .el-table{
        height: 100%;
    }
    ::v-deep .card-body .el-table__body-wrapper{
        height: calc(100% - 40px);
        overflow: auto;
    }

    ::v-deep.el-table .warning-row {
        --el-table-tr-bg-color: var(--el-color-warning-light-9);
    }
    ::v-deep.el-table .success-row {
        --el-table-tr-bg-color: var(--el-color-success-light-9);
    }

    .service-item-card{
        width: 100%;
        margin-bottom: 10px;
        border: 1px solid #e4e7ed;
        border-radius: 4px;
        box-shadow: 0px 0px 12px rgba(0, 0, 0, .12);
        padding: 10px;
        box-sizing: border-box;

        .item-column{
            display: flex;
            position: relative;
            margin-bottom: 8px;
            .column-title{
                white-space: nowrap;
            }
            .column-text{
                color: #909399;
                white-space: nowrap;
                text-overflow:ellipsis;
            }
        }
    }
</style>