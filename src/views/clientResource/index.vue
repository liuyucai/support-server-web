<template>
    <div class="page-container clientResource-page">
        <div class="page-main">
            <el-container class="padding15">
                <el-aside width="200px">
                    <div class="client-list-container">
                        <div class="container-title">客户端列表</div>
                        <div class="client-list-main">
                            <div :class="{'client-item':true,'active':activeClientId == item.id}" v-for="(item, index) in clientList" @click="clientSelect(item)">
                                <el-image style="width: 30px; height: 30px;border-radius: 50%" :src="fileServerUrl+item.icon" fit="contain" />
                                <div class="client-name">{{item.name}}</div>
                            </div>
                        </div>
                    </div>
                </el-aside>
                <el-main style="padding-top:0;background: #fff">
                    <div class="setting-container">
                        <el-tabs v-model="activeTabName" class="demo-tabs" @tab-change="tabChange">
                            <el-tab-pane label="服务" name="service">
                                <div class="tab-container service-tab-container">
                                    <el-row :gutter="20">
                                        <el-col :span="8" v-for="(item, index) in clientServiceData">
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
                                                v-model:current-page="clientServicePage.currentPage"
                                                v-model:page-size="clientServicePage.pageSize"
                                                :page-sizes="[9, 18, 27, 36]"
                                                :background="true"
                                                layout="total, sizes, prev, pager, next, jumper"
                                                :total="clientServicePage.total"
                                                @size-change="handleClientServicePageChange"
                                                @current-change="handleClientServiceCurrentChange"
                                        />
                                    </div>
                                </div>
                            </el-tab-pane>
                            <el-tab-pane label="菜单" name="menu">
                                <div class="tab-container menu-tab-container">
                                    <div class="operate-container">
                                        <el-button type="primary" @click="addMenuBtnClick">新 增</el-button>
                                    </div>
                                    <div class="table-container">
                                        <el-table
                                                row-key="id"
                                                v-loading = "menuLoading"
                                                element-loading-background = "rgba(255, 255, 255, 0.8)"
                                                element-loading-text = "数据正在加载中"
                                                element-loading-spinner = "el-icon-loading"
                                                :data="menuTableData" style="width: 100%">
                                            <el-table-column prop="name" label="菜单名称" min-width="80"/>
                                            <el-table-column prop="icon" label="图标" width="80">
                                                <template #default="scope">
                                                    <i :class=" 'iconfont ' + scope.row.icon " v-if="scope.row.icon"></i>
                                                </template>
                                            </el-table-column>
                                            <el-table-column prop="path" label="菜单地址" min-width="100"/>
                                            <el-table-column prop="action" label="动作" width="80">
                                                <template #default="scope">
                                                    {{formatAction(scope.row.action)}}
                                                </template>
                                            </el-table-column>
                                            <el-table-column prop="sort" label="排序" width="60"/>
                                            <el-table-column label="操作"  min-width="100">
                                                <template #default="scope">
                                                    <span class="column-operate-span" style="padding-left: 0" @click="addSubMenu(scope.row)">添加</span>
                                                    <span class="column-operate-span" @click="editMenu(scope.row)">编辑</span>
                                                    <span class="column-operate-span">删除</span>
                                                </template>
                                            </el-table-column>
                                        </el-table>
                                    </div>
                                </div>
                            </el-tab-pane>
                            <el-tab-pane label="路由" name="router">
                                <div class="tab-container router-tab-container">
                                    <div class="operate-container">
                                        <el-button type="primary" @click="addRouterBtnClick">新 增</el-button>
                                    </div>
                                    <div class="table-container">
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
                                            <el-table-column prop="name" label="名称" min-width="80"/>
                                            <el-table-column prop="type" label="类型" width="80">
                                                <template #default="scope">
                                                    <el-tag v-if="scope.row.type == 'ROUTER'">路由</el-tag>
                                                    <el-tag class="ml-2" type="success" v-if="scope.row.type == 'FUNCTION'">功能</el-tag>
<!--                                                    <span style="padding-left: 0;color: #2E5CF6" v-if="scope.row.type == 'ROUTER'">路由</span>-->
<!--                                                    <span style="padding-left: 0;color: #67c23a" v-if="scope.row.type == 'FUNCTION'">功能</span>-->
                                                </template>
                                            </el-table-column>
                                            <el-table-column prop="path" label="地址" min-width="100"/>
                                            <el-table-column prop="sort" label="排序" width="60"/>
                                            <el-table-column prop="authentication" label="鉴权" width="60">
                                                <template #default="scope">
                                                    <span style="color: #67c23a" v-if="scope.row.authentication == '1'">是</span>
                                                    <span v-if="scope.row.authentication == '0'">否</span>
                                                </template>
                                            </el-table-column>
                                            <el-table-column prop="permission" label="权限标识" width="80"/>
                                            <el-table-column label="操作"  min-width="80">
                                                <template #default="scope">
                                                    <span class="column-operate-span" style="padding-left: 0" @click="addFunctionClick(scope.row)">添加功能</span>
                                                    <span class="column-operate-span" @click="editRouter(scope.row)">编辑</span>
                                                    <span class="column-operate-span">删除</span>
                                                </template>
                                            </el-table-column>
                                        </el-table>
                                    </div>

                                    <div class="pagination-container clearfix">
                                        <el-pagination
                                                style="float: right"
                                                v-model:current-page="routerPage.currentPage"
                                                v-model:page-size="routerPage.pageSize"
                                                :page-sizes="[10, 20, 30, 40]"
                                                :background="true"
                                                layout="total, sizes, prev, pager, next, jumper"
                                                :total="routerPage.total"
                                                @size-change="handleRouterPageChange"
                                                @current-change="handleRouterCurrentChange"
                                        />
                                    </div>
                                </div>
                            </el-tab-pane>
                        </el-tabs>
                    </div>
                </el-main>
            </el-container>
        </div>

        <el-dialog
                @close="menuDialogClose"
                v-model="menuDialogVisible"
                :title="menuDialogTitle"
                width="50%" draggable>
            <div>
                <el-form
                        ref="addMenuForm"
                        :model="addMenuForm"
                        :rules="menuRules"
                        label-width="100px">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="上级菜单" prop="parentName">
                                <el-select
                                        v-model="addMenuForm.parentName"
                                        ref="menuTreeSelect"
                                        placeholder="请选择上级菜单">
                                    <el-option
                                            :key="addMenuForm.pid"
                                            :label="addMenuForm.name"
                                            :value="addMenuForm.pid"
                                            style="height: auto"
                                            class="tree-select-option">
                                        <div class="filter-div">
                                            <!--                  下面这个input点击要@click.stop.native阻止冒泡事件，否则触发el-option点击，关闭选项框 -->
                                            <el-input
                                                    size="small"
                                                    placeholder="输入关键字进行过滤"
                                                    @click.stop.native="stopBubbing"
                                                    v-model="selectMenuFilterText">
                                            </el-input>
                                        </div>
                                        <el-tree class="select-tree filter-tree"
                                                 ref="selectMenuTree"
                                                 :data="menuSelectTree"
                                                 :expand-on-click-node="false"
                                                 node-key="id"
                                                 :check-strictly="true"
                                                 :props="defaultProps"
                                                 :filter-node-method="filterSearchNode"
                                                 @node-click="selectArea">
                                        </el-tree>
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="菜单名称" prop="name">
                                <el-input v-model="addMenuForm.name" placeholder="请选择菜单名称"/>
                            </el-form-item>
                        </el-col>

                        <!--菜单类型-->
                        <el-col :span="12">
                            <el-form-item label="菜单类型" prop="menuType">
                                <el-radio-group v-model="addMenuForm.menuType">
                                    <el-radio-button
                                            v-for="(item, index) in menuTypeList"
                                            :label="item.value"
                                            :key="index">{{item.label}}
                                    </el-radio-button>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>

                        <el-col :span="12">
                            <el-form-item label="图标" prop="icon">
                                <el-input v-model="addMenuForm.icon" placeholder="请选择图标" @click="beforeSelectIcon" readonly>
                                    <template #append>
                                        <i :class=" 'iconfont ' + addMenuForm.icon "></i>
                                    </template>
                                </el-input>
                            </el-form-item>
                        </el-col>


                        <el-col :span="24" v-if="addMenuForm.menuType=='2'">
                            <el-form-item label="菜单地址" prop="path">
                                <el-input v-model="addMenuForm.path" placeholder="请输入菜单地址"/>
                            </el-form-item>
                        </el-col>

                        <el-col :span="12">
                            <el-form-item label="排序">
                                <el-input-number v-model="addMenuForm.sort" :min="1" :max="999" placeholder="请输入排序"/>
                            </el-form-item>
                        </el-col>

                        <el-col :span="12" v-if="addMenuForm.menuType=='2'">
                            <el-form-item label="触发动作" prop="action">
                                <el-radio-group v-model="addMenuForm.action">
                                    <el-radio-button
                                            v-for="(item, index) in actionList"
                                            :label="item.value"
                                            :key="index">{{item.label}}
                                    </el-radio-button>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>

                        <el-col :span="12">
                            <el-form-item label="是否显示" prop="visiable">
                                <el-radio-group v-model="addMenuForm.visiable">
                                    <el-radio-button
                                            v-for="(item, index) in visiableList"
                                            :label="item.value"
                                            :key="index">{{item.label}}
                                    </el-radio-button>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>

                        <el-col :span="12" v-if="addMenuForm.menuType=='2'">
                            <el-form-item label="缓冲" prop="keepAlive">
                                <el-radio-group v-model="addMenuForm.keepAlive">
                                    <el-radio-button
                                            v-for="(item, index) in keepAliveList"
                                            :label="item.value"
                                            :key="index">{{item.label}}
                                    </el-radio-button>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                    </el-row>

                </el-form>
            </div>
            <template #footer>
              <span class="dialog-footer">
                <el-button @click="menuDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveMenuInfo">确 定</el-button>
              </span>
            </template>
        </el-dialog>

        <el-dialog
                @close="routerDialogClose"
                v-model="routerDialogVisible"
                :title="routerDialogTitle"
                width="40%" draggable>
            <div>
                <el-form
                        ref="addRouterForm"
                        :model="addRouterForm"
                        :rules="routerRules"
                        label-width="100px">

                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="路由名称" prop="name">
                                <el-input v-model="addRouterForm.name" placeholder="请选择路由名称"/>
                            </el-form-item>
                        </el-col>

                        <el-col :span="24">
                            <el-form-item label="路由地址" prop="path">
                                <el-input v-model="addRouterForm.path" placeholder="请输入菜单地址"/>
                            </el-form-item>
                        </el-col>

                        <el-col :span="12">
                            <el-form-item label="是否鉴权" prop="authentication">
                                <el-radio-group v-model="addRouterForm.authentication">
                                    <el-radio-button
                                            v-for="(item, index) in authenticationList"
                                            :label="item.value"
                                            :key="index">{{item.label}}
                                    </el-radio-button>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>

                        <el-col :span="12">
                            <el-form-item label="排序">
                                <el-input-number v-model="addRouterForm.sort" :min="1" :max="999" placeholder="请输入排序"/>
                            </el-form-item>
                        </el-col>

                    </el-row>

                </el-form>
            </div>
            <template #footer>
              <span class="dialog-footer">
                <el-button @click="routerDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveRouterInfo">确 定</el-button>
              </span>
            </template>
        </el-dialog>

        <el-dialog
                @close="functionDialogClose"
                v-model="functionDialogVisible"
                :title="functionDialogTitle"
                width="40%" draggable>
            <div>
                <el-form
                        ref="addFunctionForm"
                        :model="addFunctionForm"
                        :rules="functionRules"
                        label-width="100px">

                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="功能名称" prop="name">
                                <el-input v-model="addFunctionForm.name" placeholder="请选择功能名称"/>
                            </el-form-item>
                        </el-col>

                        <el-col :span="24">
                            <el-form-item label="权限标识" prop="permission">
                                <el-input v-model="addFunctionForm.permission" placeholder="请输入权限标识"/>
                            </el-form-item>
                        </el-col>

                        <el-col :span="24">
                            <el-form-item label="排序">
                                <el-input-number v-model="addFunctionForm.sort" :min="1" :max="999" placeholder="请输入排序"/>
                            </el-form-item>
                        </el-col>

                    </el-row>

                </el-form>
            </div>
            <template #footer>
              <span class="dialog-footer">
                <el-button @click="functionDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveFunctionInfo">确 定</el-button>
              </span>
            </template>
        </el-dialog>

        <icon @selectIconCallback="selectIcon" ref="iconSelectDialog"></icon>
    </div>
    
</template>

<script>
    import "@/assets/styles/common.css"
    import clientResource from '@/js/clientResource/index';
    import Icon from "@/components/icon";
    export default {
        components: {Icon},
        ...clientResource,
    }
</script>

<style scoped lang="scss">
    .page-main{
        background: #fff;
        height: 100%;
        border-radius:4px;
        .el-container{
            height: 100%;
        }

        .client-list-container{
            height: 100%;
            box-sizing: border-box;
            padding-top: 40px;
            position: relative;
            .container-title{
                position: absolute;
                top: 0;
                left: 0;
                height: 40px;
                text-align: center;
                line-height: 40px;
                width: 100%;
            }
            .client-list-main{
                height: 100%;
                border-right: 1px solid #c2c2c2;
                overflow: auto;
                padding-right: 10px;
                .client-item{
                    display: flex;
                    align-items: center;
                    padding: 10px 10px 10px 6px;
                    cursor: pointer;
                    margin-bottom: 2px;
                    .client-name{
                        padding-left: 5px;
                        font-size: 14px;
                    }
                    .client-name:hover{
                        color: var(--el-color-primary);
                    }
                }
                .client-item.active{
                    border-left: 3px solid var(--el-color-primary);
                    background: #ecf5ff;
                }
                .client-item:hover{
                    background: #ecf5ff;
                }
            }
        }
        .setting-container{
            padding-left: 15px;
            height: 100%;

            .tab-container{
                overflow: auto;
                height: 100%;
            }
            .service-tab-container{
                padding-right: 4px;
                position: relative;
                box-sizing: border-box;
                padding-bottom: 42px;
                .pagination-container{
                    position: absolute;
                    bottom: 0;
                    right: 0;
                }
            }
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
    }

    ::v-deep .setting-container .el-tabs{
        display: flex;
        flex-direction: column;
        height: 100%;
        .el-tabs__content{
            height: 100%;
            .el-tab-pane{
                height: 100%;
            }
        }
    }
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