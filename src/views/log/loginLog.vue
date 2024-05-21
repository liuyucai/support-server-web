<template>
    <div class="page-container loginLog-page">

        <div class="search-container">
            <el-form :inline="true" :model="searchForm" class="demo-form-inline">
                <el-form-item label="账号名称">
                    <el-input v-model="searchForm.userName" placeholder="请输入账号名称" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSearch">查询</el-button>
                </el-form-item>
            </el-form>
        </div>

        <div class="body-container">
            <div class="table-container">
                <el-table
                        v-loading = "loading"
                        element-loading-background = "rgba(255, 255, 255, 0.8)"
                        element-loading-text = "数据正在加载中"
                        element-loading-spinner = "el-icon-loading"
                        :data="tableData"
                        style="width: 100%">
                    <el-table-column prop="userName" label="账号名称"/>
                    <el-table-column prop="nickName" label="用户昵称"/>
                    <el-table-column prop="ipAddress" label="ip地址"/>
                    <el-table-column prop="browser" label="浏览器"/>
                    <el-table-column prop="os" label="操作系统"/>
                    <el-table-column prop="status" label="登录状态"/>
                    <el-table-column prop="msg" label="描述"/>
                    <el-table-column prop="loginTime" label="登录时间"/>
                    <el-table-column prop="clientName" label="客户端"/>
                    <el-table-column label="操作" width="80">
                        <template #default>
                            <el-button  type="text" size="small">查看</el-button>
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

        <el-dialog v-model="dialogVisible" :title="dialogTitle" width="40%" draggable>
            <div>

            </div>
            <template #footer>
              <span class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
              </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>
    import "@/assets/styles/common.css"
    import loginLog from '@/js/log/loginLog';
    export default {
        ...loginLog,
    }
</script>

<style scoped>

</style>