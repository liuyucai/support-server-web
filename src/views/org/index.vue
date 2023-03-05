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
                <el-table :data="tableData" style="width: 100%">
                    <el-table-column prop="date" label="机构名称"/>
                    <el-table-column prop="name" label="排序"/>
                    <el-table-column label="操作" width="200">
                        <template #default>
                            <el-button  type="text" size="small">查看</el-button>
                            <el-button  type="text" size="small">编辑</el-button>
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
                <el-form :model="addForm" label-width="100px">
                    <el-form-item label="上级机构">
                        <el-select v-model="addForm.parentName" placeholder="请选择上级机构">
                            <el-option label="Zone one" value="shanghai" />
                            <el-option label="Zone two" value="beijing" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="机构名称">
                        <el-input v-model="addForm.name" placeholder="请输入机构名称"/>
                    </el-form-item>
                    <el-form-item label="排序">
                        <el-input v-model="addForm.sort" placeholder="请输入排序"/>
                    </el-form-item>

                </el-form>
            </div>
            <template #footer>
              <span class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="dialogVisible = false">
                  确定
                </el-button>
              </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>
    import "@/assets/styles/common.css"
    // 导入axios实例
    import httpRequest from '@/utils/request'
    export default {
        name: "orgView",

        data() {
            return {
                searchForm:{
                    name:""
                },
                tableData:[
                    {
                        date: '2016-05-03',
                        name: 'Tom',
                        address: 'No. 189, Grove St, Los Angeles',
                    },
                    {
                        date: '2016-05-02',
                        name: 'Tom',
                        address: 'No. 189, Grove St, Los Angeles',
                    },
                    {
                        date: '2016-05-04',
                        name: 'Tom',
                        address: 'No. 189, Grove St, Los Angeles',
                    },
                    {
                        date: '2016-05-01',
                        name: 'Tom',
                        address: 'No. 189, Grove St, Los Angeles',
                    }
                ],

                page:{
                    currentPage:1,
                    pageSize:1,
                    total:0
                },

                dialogVisible:false,

                dialogTitle:"新增",

                addForm:{
                    parentName:"",
                    id:"",
                    name:"",
                    sort:""
                }
            }
        },
        mounted() {

            this.onload();
        },
        methods: {

            onload(){
                httpRequest.post('/alert/page', {}).then(response => {

                }).catch(error => {

                })
            },
            onSearch(){

            },

            handleSizeChange(){

            },
            handleCurrentChange(){

            },

            addBtnClick(){
                this.dialogVisible = true;
            }
        }
    }
</script>

<style scoped>
    ::v-deep .el-select{
        width: 100%;
    }
</style>