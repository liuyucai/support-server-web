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
            <div class="base-container menu-tab-container" style="height: 100%;width: 100%;margin-left: 20px;overflow-y: auto">
                <el-tabs v-model="activeTabName" class="demo-tabs" @tab-change="tabChange">
                    <el-tab-pane label="菜单授权" name="menu">
                        <div class="table-container">
<!--                            <el-table-->
<!--                                    @select="menuSelectClick"-->
<!--                                    ref="clientMenu"-->
<!--                                    row-key="id"-->
<!--                                    v-loading = "menuLoading"-->
<!--                                    element-loading-background = "rgba(255, 255, 255, 0.8)"-->
<!--                                    element-loading-text = "数据正在加载中"-->
<!--                                    element-loading-spinner = "el-icon-loading"-->
<!--                                    :data="menuTableData" style="width: 100%">-->
<!--                                <el-table-column type="selection" width="55" />-->
<!--                                <el-table-column prop="name" label="菜单名称"/>-->


<!--                                <el-table-column prop="menuType" label="类型">-->
<!--                                    <template #default="scope">-->
<!--                                        <el-tag v-if="scope.row.menuType == 'DIR'">目录</el-tag>-->
<!--                                        <el-tag class="ml-2" type="success" v-if="scope.row.menuType == 'MENU'">左菜单</el-tag>-->
<!--                                        <el-tag class="ml-2" type="warning" v-if="scope.row.menuType == 'ROUTER'">路由</el-tag>-->
<!--                                        <el-tag class="ml-2" type="info" v-if="scope.row.menuType == 'FUNCTION'">功能</el-tag>-->
<!--                                    </template>-->
<!--                                </el-table-column>-->

<!--                                <el-table-column prop="authentication" label="鉴权">-->
<!--                                    <template #default="scope">-->
<!--                                        <span style="color: #67c23a" v-if="scope.row.authentication == '1'">是</span>-->
<!--                                        <span v-if="scope.row.authentication == '0'">否</span>-->
<!--                                    </template>-->
<!--                                </el-table-column>-->
<!--                            </el-table>-->

                            <div class="custom-table">
                                <div class="custom-table-header">

                                    <div class="custom-table-name name1">菜单名称</div>

                                    <div class="custom-table-name name2">菜单类型</div>

                                    <div class="custom-table-name name3">鉴权</div>
                                </div>
                                <div class="custom-table-body">
                                    <el-tree
                                        ref="menuTree"
                                        :data="menuTableData"
                                        :check-strictly="!checkStrictly"
                                        :props="defaultProps"
                                        node-key="id"
                                        @check-change="checkChange"
                                        show-checkbox>
                                        <template #default="{ node, data }">
                                            <div class="custom-node-item">
                                                <span>{{ node.label }}</span>
                                                <div class="item1">
                                                    <el-tag v-if="data.menuType == 'DIR'">目录</el-tag>
                                                    <el-tag class="ml-2" type="success" v-if="data.menuType == 'MENU'">左菜单</el-tag>
                                                    <el-tag class="ml-2" type="warning" v-if="data.menuType == 'ROUTER'">路由</el-tag>
                                                    <el-tag class="ml-2" type="info" v-if="data.menuType == 'FUNCTION'">功能</el-tag>
                                                </div>
                                                <div class="item2">
                                                    <span style="color: #67c23a" v-if="data.authentication == '1'">是</span>
                                                    <span v-if="data.authentication == '0'">否</span>
                                                </div>
                                            </div>
                                        </template>
                                    </el-tree>
                                </div>
                            </div>
                        </div>
                    </el-tab-pane>
                </el-tabs>

                <div class="menu-operation">
                    <el-checkbox v-model="selectAll" label="全选/全不选" size="large" />
                    <el-checkbox v-model="checkStrictly" label="父子联动" size="large" />
                </div>

                <div class="tab-container-foot">
                    <el-button type="primary" @click="onSubmit" :disabled="!currentClient.authority">确 定</el-button>
                    <el-button>取 消</el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import "@/assets/styles/common.css"

    import authority from '@/js/authority/index1';
    export default {
        ...authority,
    }
</script>

<style scoped lang="scss">

    .box-top-nav{


    }
    .menu-tab-container{
        padding-bottom: 60px;
        position: relative;
        .tab-container-foot{
            position: absolute;
            bottom: 20px;
            left: 0;
            text-align: center;
            width: 100%;
        }
        .menu-operation{
            position: absolute;
            top: 20px;
            right: 30px;
        }
    }
    .demo-tabs{
        height: 100%;
    }

    .custom-table{
        .custom-table-header{
            padding-left: 30px;
            border-bottom: 1px solid #ebeef5;
            position: relative;
            .custom-table-name{
                padding: 8px 12px;
                color: #909399;
                font-weight: 600;
                font-size: 14px;
            }
            .custom-table-name.name2{
                position: absolute;
                width: 220px;
                top: 0;
                right: 220px;
            }
            .custom-table-name.name3{
                position: absolute;
                width: 220px;
                top: 0;
                right: 0;
            }

        }
        .custom-table-body{
            padding-top: 10px;
            .custom-node-item{
                width: 100%;
                position: relative;
                .item1{
                    position: absolute;
                    width: 220px;
                    top: -3px;
                    right: 220px;
                    padding-left: 12px;
                }
                .item2{
                    position: absolute;
                    width: 220px;
                    right: 0;
                    top: -3px;
                    padding-left: 12px;
                }
            }
        }
    }
    ::v-deep .el-tree-node__content{
        height: 30px;
    }
</style>