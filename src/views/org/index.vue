<template>
    <div class="page-container">
        <div class="search-container">
            <el-form :inline="true" :model="searchForm" class="demo-form-inline">
                <el-form-item label="机构名称">
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
                <el-table row-key="id" :data="tableData" style="width: 100%">
                    <el-table-column prop="name" label="机构名称"/>
                    <el-table-column prop="sort" label="排序"/>
                    <el-table-column label="操作" width="200">
                        <template #default="scope">
                            <span class="column-operate-span" style="padding-left: 0" @click="addClick(scope.row)">添加</span>
                            <span class="column-operate-span" @click="editClick(scope.row)">编辑</span>
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


        <el-dialog
                @close="dialogClose"
                v-model="dialogVisible"
                :title="dialogTitle" width="40%"
                draggable>
            <div>
                <el-form :model="addForm" label-width="100px" ref="addForm" :rules="rules">
                    <el-form-item label="上级机构" prop="parentName">
                        <el-select
                                v-model="addForm.parentName"
                                ref="treeSelect"
                                placeholder="请选择上级菜单"
                                prop="parentName">
                            <el-option
                                    :key="addForm.pid"
                                    :label="addForm.name"
                                    :value="addForm.pid"
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
                    <el-form-item label="机构名称" prop="name">
                        <el-input v-model="addForm.name" placeholder="请输入机构名称"/>
                    </el-form-item>

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
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="排序">
                                <el-input-number v-model="addForm.sort" :min="1" :max="999" placeholder="请输入排序"/>
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
    </div>
</template>

<script>
    import "@/assets/styles/common.css"

    import org from '@/js/org/index';
    export default {
        ...org,
    }

</script>

<style scoped>
    ::v-deep .el-select{
        width: 100%;
    }
</style>