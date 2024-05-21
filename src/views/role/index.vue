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
                            :filter-node-method="filterNode"
                            @node-click="orgClick"/>
                </div>
            </el-aside>
            <el-main style="padding-top: 0">
                <div class="search-container">
                    <el-form :inline="true" :model="searchForm" class="demo-form-inline">
                        <el-form-item label="角色名称">
                            <el-input v-model="searchForm.name" placeholder="请输入机构名称" />
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
                            <el-table-column prop="name" label="角色名称"/>
                            <el-table-column prop="type" label="角色类型">
                                <template #default="scope">
                                    <span>{{formatRoleType(scope.row.type)}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="useScope" label="使用范围">
                                <template #default="scope">
                                    <span>{{formatUseScope(scope.row.useScope)}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="sort" label="排序"/>
                            <el-table-column prop="description" label="描述"/>
                            <el-table-column label="操作" width="200">
                                <template #default="scope">
                                    <span class="column-operate-span" @click="editClick(scope.row)">编辑</span>
                                    <span class="column-operate-span" style="padding-left: 0" @click="settingClick(scope.row)">授权</span>
                                    <span class="column-operate-span" @click="deleteClick(scope.row)">删除</span>
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
                <el-form :model="addForm" label-width="100px" ref="addForm" :rules="rules">

                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="角色名称" prop="name">
                                <el-input v-model="addForm.name" placeholder="请输入角色名称"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="所属机构" prop="orgName">
                                <el-select
                                        v-model="addForm.orgName"
                                        ref="treeSelect"
                                        placeholder="请选择所属机构">
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
                    </el-row>

                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="角色类型" prop="type">
                                <el-select v-model="addForm.type" placeholder="请选择角色类型" @change="roleTypeChange">
                                    <el-option
                                            v-for="item in roleTypeList"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="使用范围" prop="useScope">
                                <el-select v-model="addForm.useScope" placeholder="请选择使用范围" :disabled="addForm.type == 'CUSTOM'?true:false">
                                    <el-option
                                            v-for="item in useScopeList"
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
                            <el-form-item label="数据权限" prop="dataScope">
                                <el-select v-model="addForm.dataScope" placeholder="请选择数据权限">
                                    <el-option
                                            v-for="item in dataScopeList"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="排序">
                                <el-input-number v-model="addForm.sort" :min="1" :max="999" placeholder="请输入排序"/>
                            </el-form-item>
                        </el-col>
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
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="saveInfo()">
                  确定
                </el-button>
              </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>
    import "@/assets/styles/common.css"

    import role from '@/js/role/index';
    export default {
        ...role,
    }

</script>

<style scoped>
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