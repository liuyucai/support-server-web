<template>
    <div class="page-container client-page">
        <div class="search-container">
            <el-form :inline="true" :model="searchForm" class="demo-form-inline">
                <el-form-item label="客户端名称">
                    <el-input v-model="searchForm.name" placeholder="请输入客户端名称" />
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
                    <el-table-column prop="icon" label="应用图标">
                        <template #default="scope">
                            <el-image style="width: 45px; height: 45px;border-radius: 50%" :src="fileServerUrl+scope.row.icon" fit="contain" />
                        </template>
                    </el-table-column>
                    <el-table-column prop="clientSecret" label="客户端id"/>
                    <el-table-column prop="name" label="客户端名称"/>
                    <el-table-column prop="groupName" label="客户端组"/>
                    <el-table-column prop="appScene" label="应用场景">
                        <template #default="scope">
                            <span>{{formatAppScene(scope.row.appScene)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="appSource" label="应用来源">
                        <template #default="scope">
                            <span>{{formatAppSource(scope.row.appSource)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="grantType" label="授权模式">
                        <template #default="scope">
                            <div v-for="item in formatGrantType(scope.row.grantType)">{{item}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="anonymous" label="匿名访问">
                        <template #default="scope">
                            <span>{{scope.row.anonymous == "1"?"是":"否"}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="state" label="状态" width="60px">
                        <template #default="scope">
                            <span>{{formatState(scope.row.state)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="200">
                        <template #default="scope">
                            <span class="column-operate-span" style="padding-left: 0">查看</span>
                            <span class="column-operate-span" @click="editClick(scope.row)">编辑</span>
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
                        @current-change="handleCurrentChange"/>
            </div>
        </div>

        <el-dialog v-model="dialogVisible" :title="dialogTitle" width="50%" draggable>
            <div>
                <el-form
                        ref="addForm"
                        :model="addForm"
                        :rules="rules"
                        label-width="120px">
                    <el-form-item label="应用图标">
                        <el-upload
                                class="avatar-uploader"
                                :action="uploadUrl"
                                :headers="headers"
                                :show-file-list="false"
                                :on-success="handleAvatarSuccess"
                                :before-upload="beforeAvatarUpload">
                            <img v-if="addForm.icon" :src="fileServerUrl+addForm.icon" class="avatar" />
                            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
                        </el-upload>
                    </el-form-item>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="客户端名称" prop="name">
                                <el-input v-model="addForm.name" placeholder="请输入客户端名称"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="客户端组" prop="groupId">
                                <el-select v-model="addForm.groupId" placeholder="请选择客户端组">
                                    <el-option
                                            v-for="item in clientGroupList"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="应用场景" prop="appScene">
                                <el-radio-group v-model="addForm.appScene">
                                    <el-radio-button
                                            v-for="(item, index) in appSceneList"
                                            :label="item.value"
                                            :key="index">{{item.label}}
                                    </el-radio-button>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="应用来源" prop="appSource">
                                <el-select v-model="addForm.appSource" placeholder="请选择应用来源">
                                    <el-option
                                            v-for="item in appSourceList"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>


                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="状态" prop="state">
                                <el-radio-group v-model="addForm.state">
                                    <el-radio-button
                                            v-for="(item, index) in stateList"
                                            :label="item.value"
                                            :key="index">{{item.label}}
                                    </el-radio-button>
                                </el-radio-group>
                            </el-form-item>

                            <el-form-item label="匿名访问" prop="anonymous">
                                <el-radio-group v-model="addForm.anonymous">
                                    <el-radio-button
                                            v-for="(item, index) in anonymousList"
                                            :label="item.value"
                                            :key="index">{{item.label}}
                                    </el-radio-button>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="授权模式" prop="grantType">
                                <el-checkbox-group v-model="grantTypeCheckList" @change="grantTypeChange">
                                    <el-checkbox
                                            v-for="(item, index) in grantTypeList"
                                            :label="item.value"
                                            :key="index">{{item.label}}
                                    </el-checkbox>
                                </el-checkbox-group>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="令牌时效（S）" prop="accessTokenValidity">
                                <el-input v-model="addForm.accessTokenValidity" placeholder="请输入令牌时效"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="排序">
                                <el-input-number v-model="addForm.sort" :min="1" :max="999" placeholder="请输入排序"/>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row>
                        <el-form-item label="回调地址" class="auto-width" prop="redirectUri">
                            <el-input v-model="addForm.redirectUri" placeholder="请输入回调地址"/>
                        </el-form-item>
                    </el-row>

                    <el-row>
                        <el-form-item label="描述" class="auto-width">
                            <el-input v-model="addForm.description" placeholder="请输入描述" type="textarea"/>
                        </el-form-item>
                    </el-row>
                </el-form>
            </div>
            <template #footer>
              <span class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveInfo">确 定</el-button>
              </span>
            </template>
        </el-dialog>
    </div>
    
</template>

<script>
    import "@/assets/styles/common.css"
    import client from '@/js/client/index';
    export default {
        ...client,
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
</style>