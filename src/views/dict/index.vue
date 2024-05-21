<template>
    <div class="page-container dict-page">

        <div class="search-container">
            <el-form :inline="true" :model="searchForm" class="demo-form-inline">
                <el-form-item label="字典名称">
                    <el-input v-model="searchForm.name" placeholder="请输入字典名称" />
                </el-form-item>
                <el-form-item label="字典编码">
                    <el-input v-model="searchForm.code" placeholder="请输入字典编码" />
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
                    <el-table-column prop="name" label="字典名称"/>
                    <el-table-column prop="code" label="字典编码"/>
                    <el-table-column prop="type" label="字典类型">
                        <template #default="scope">
                            <el-tag class="ml-2"  v-if="scope.row.type == 'SYSTEM'">系统字典</el-tag>
                            <el-tag class="ml-2" type="success" v-if="scope.row.type == 'BUSINESS'">业务字典</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="serviceName" label="所属服务"/>
                    <el-table-column label="操作" width="220">
                        <template #default="scope">
                            <span class="column-operate-span" style="padding-left: 0" @click="dictClick(scope.row)">字典项</span>
                            <span class="column-operate-span"  @click="editClick(scope.row)">编辑</span>
                            <span class="column-operate-span"  @click="deleteClick(scope.row.id)">删除</span>
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

                    <el-form-item label="字典名称" prop="name">
                        <el-input v-model="addForm.name" placeholder="请输入分组名称"/>
                    </el-form-item>

                    <el-form-item label="字典编码" prop="code">
                        <el-input v-model="addForm.code" placeholder="请输入分组名称"/>
                    </el-form-item>

                    <el-form-item label="字典类型" prop="type">
                        <el-radio-group v-model="addForm.type">
                            <el-radio-button
                                    v-for="(item, index) in typeList"
                                    :label="item.value"
                                    :key="index">{{item.label}}
                            </el-radio-button>
                        </el-radio-group>
                    </el-form-item>

                    <el-form-item label="所属服务" prop="serviceName">
                        <el-select
                                @change="serviceSelectChange"
                                v-model="addForm.serviceName"
                                placeholder="请选择所属服务">
                            <el-option
                                    v-for="item in serviceList"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"/>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="描述" prop="description">
                        <el-input v-model="addForm.description" type="textarea" placeholder="请输入描述"/>
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

        <el-dialog
                v-model="dialogDictItemVisible"
                title="字典项管理"
                @close="dialogDictItemClose"
                width="50%"
                draggable>
            <div>
                <div class="operate-container">
                    <el-button type="primary" @click="addDictItemClick">新 增</el-button>
                </div>
                <div class="table-container">
                    <el-table
                            v-loading = "loading"
                            element-loading-background = "rgba(255, 255, 255, 0.8)"
                            element-loading-text = "数据正在加载中"
                            element-loading-spinner = "el-icon-loading"
                            :data="dictItemTableData"
                            style="width: 100%">
                        <el-table-column prop="name" label="字典项名称"/>
                        <el-table-column prop="code" label="字典项编码"/>
                        <el-table-column label="操作" width="160">
                            <template #default="scope">
                                <span class="column-operate-span" style="padding-left: 0" @click="editDictItemClick(scope.row)">编辑</span>
                                <span class="column-operate-span"  @click="deleteDictItemClick(scope.row.id)">删除</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="pagination-container clearfix">
                    <el-pagination
                            style="float: right"
                            v-model:current-page="dictItemPage.currentPage"
                            v-model:page-size="dictItemPage.pageSize"
                            :page-sizes="[10, 20, 30, 40]"
                            :background="true"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="dictItemPage.total"
                            @size-change="handleDictItemSizeChange"
                            @current-change="handleDictItemCurrentChange"/>
                </div>
            </div>
            <template #footer>
              <span class="dialog-footer">
                <el-button @click="dialogDictItemVisible = false">取 消</el-button>
              </span>
            </template>
        </el-dialog>

        <el-dialog
                v-model="dialogAddDictItemVisible"
                :title="dialogAddDictItemTitle"
                @close="dialogAddDictItemClose"
                width="40%"
                draggable>
            <div>
                <el-form
                        ref="addDictItemForm"
                        :model="addDictItemForm"
                        :rules="dictItemRules"
                        label-width="100px">
                    <el-form-item label="字典项名称" prop="name">
                        <el-input v-model="addDictItemForm.name" placeholder="请输入分组名称"/>
                    </el-form-item>

                    <el-form-item label="字典项编码" prop="code">
                        <el-input v-model="addDictItemForm.code" placeholder="请输入分组名称"/>
                    </el-form-item>

                    <el-form-item label="排序">
                        <el-input-number v-model="addDictItemForm.sort" :min="1" :max="999" placeholder="请输入排序"/>
                    </el-form-item>
                </el-form>
            </div>
            <template #footer>
              <span class="dialog-footer">
                <el-button @click="dialogAddDictItemVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveDictItem">确 定</el-button>
              </span>
            </template>
        </el-dialog>

    </div>
    
</template>

<script>
    import "@/assets/styles/common.css"
    import dict from '@/js/dict/index';
    export default {
        ...dict,
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