<template>
    <div class="page-container role-container" >
        <div style="display: flex;height: 100%">
            <div class="base-container" style="width: 500px;height: 100%">
                <div class="table-container">
                    <el-table
                            row-key="id"
                            v-loading = "clientLoading"
                            element-loading-background = "rgba(255, 255, 255, 0.8)"
                            element-loading-text = "数据正在加载中"
                            element-loading-spinner = "el-icon-loading"
                            highlight-current-row
                            @current-change="handleCurrentChange"
                            :data="clientTableData" style="width: 100%">
                        <el-table-column prop="name" label="客户端">
                            <template #default="scope">
                                <div style="display: flex;align-items: center">
                                    <el-image style="width: 30px; height: 30px;border-radius: 50%" :src="fileServerUrl+scope.row.icon" fit="contain" />
                                    <span>{{scope.row.name}}</span>
                                </div>
                            </template>
                        </el-table-column>

                        <el-table-column label="授权" width="100">
                            <template #default="scope">
                                <el-switch v-model="scope.row.authority" @change="clientAuthChange(scope.row)"/>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
            <div class="base-container" style="height: 100%;width: 100%;margin-left: 20px;overflow-y: auto">
                <el-tabs v-model="activeTabName" class="demo-tabs" @tab-change="tabChange">
                    <el-tab-pane label="菜单授权" name="menu">
                        <div class="table-container">
                            <el-table
                                    row-key="id"
                                    v-loading = "menuLoading"
                                    element-loading-background = "rgba(255, 255, 255, 0.8)"
                                    element-loading-text = "数据正在加载中"
                                    element-loading-spinner = "el-icon-loading"
                                    :data="menuTableData" style="width: 100%">
                                <el-table-column prop="name" label="菜单名称"/>

                                <el-table-column prop="icon" label="图标">
                                    <template #default="scope">
                                        <i :class="scope.row.icon " v-if="scope.row.icon"></i>
                                    </template>
                                </el-table-column>

                                <el-table-column label="授权" width="100">
                                    <template #default="scope">
                                        <el-switch v-model="scope.row.authority" @change="clientMenuChange(scope.row)"/>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="功能&路由授权" name="router">
                        <el-table
                                row-key="id"
                                v-loading = "routerLoading"
                                element-loading-background = "rgba(255, 255, 255, 0.8)"
                                element-loading-text = "数据正在加载中"
                                element-loading-spinner = "el-icon-loading"
                                :data="routerTableData"
                                lazy
                                :load="loadFunction"
                                :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
                                style="width: 100%;">
                            <el-table-column prop="name" label="名称"/>
                            <el-table-column prop="type" label="类型" width="60">
                                <template #default="scope">
                                    <span style="padding-left: 0;color: #2E5CF6" v-if="scope.row.type == 'ROUTER'">路由</span>
                                    <span style="padding-left: 0;color: #67c23a" v-if="scope.row.type == 'FUNCTION'">功能</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="path" label="地址" min-width="100"/>
                            <el-table-column label="操作" width="80">
                                <template #default="scope">
                                    <el-switch v-model="scope.row.authority" @change="clientRouterChange(scope.row)"/>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
    </div>
</template>

<script>
    import "@/assets/styles/common.css"

    import authority from '@/js/authority/index';
    export default {
        ...authority,
    }
</script>

<style scoped lang="scss">

    .box-top-nav{


    }
</style>