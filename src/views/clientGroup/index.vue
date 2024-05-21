<template>
    <div class="page-container clientGroup-page">

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
                    <el-table-column prop="icon" label="应用图标">
                        <template #default="scope">
                            <i :class=" 'iconfont ' + scope.row.icon " v-if="scope.row.icon"></i>
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" label="分组名称"/>
                    <el-table-column prop="sort" label="排序"/>
                    <el-table-column prop="clientNumber" label="客户端数量"/>
                    <el-table-column label="操作" width="200">
                        <template #default="scope">
                            <el-button  type="text" size="small">查看</el-button>
                            <el-button  type="text" size="small" @click="editClick(scope.row)">编辑</el-button>
                            <el-button  type="text" size="small" @click="deleteClick(scope.row.id)">删除</el-button>
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

        <el-dialog
                v-model="dialogVisible"
                :title="dialogTitle"
                @close="dialogClose"
                width="40%"
                draggable>
            <div>
                <el-form
                        ref="addForm"
                        :model="addForm"
                        :rules="rules"
                        label-width="100px">

                    <el-form-item label="分组名称" prop="name">
                        <el-input v-model="addForm.name" placeholder="请输入分组名称"/>
                    </el-form-item>

                    <el-form-item label="图标" prop="icon">
                        <el-input v-model="addForm.icon" placeholder="请选择图标" @click="beforeSelectIcon" readonly>
                            <template #append>
                                <i :class=" 'iconfont ' + addForm.icon "></i>
                            </template>
                        </el-input>
                    </el-form-item>

                    <el-form-item label="排序">
                        <el-input-number v-model="addForm.sort" :min="1" :max="999" placeholder="请输入排序"/>
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

        <icon @selectIconCallback="selectIcon" ref="iconSelectDialog"></icon>
    </div>
    
</template>

<script>
    import "@/assets/styles/common.css"
    import clientGroup from '@/js/clientGroup/index';
    import Icon from "@/components/icon";
    export default {
        components: {Icon},

        ...clientGroup,
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