<template>
    <div class="icon-page">
        <el-dialog v-model="dialogVisible" :title="dialogTitle" width="768px" draggable>
            <div class="icon-page-main">
                <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
                    <el-tab-pane label="阿里" name="alibaba">
                        <div class="icon-main">
                            <div class="icon-main-body" v-for="(item, index) in iconData.alibaba" :key="index">
                                <div v-if="item.groupName" class="group-name">{{item.groupName}}</div>
                                <div
                                    :class="{'icon-item':true,'first-line-item':iconIndex<6,'first-item':iconIndex%6==0,'last-item':iconIndex>0&&iconIndex%5==0}"
                                    v-for="(icon, iconIndex) in item.icons" :key="iconIndex" @click="selectIcon(icon)">
                                    <div class="icon-item-main">
                                        <div class="icon-value"><i :class=" icon.value "></i></div>
                                        <div class="icon-name">{{icon.name}}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="字节" name="byteJump">Config</el-tab-pane>
                </el-tabs>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "icon",

        data() {
            return {
                dialogVisible:false,

                dialogTitle:"选择图标",

                activeName:"alibaba",

                iconData:{
                    alibaba:[
                        {
                            groupName:"线性",
                            icons:[
                                {
                                    name:"icon-add",
                                    value:"iconfont icon-add"
                                },{
                                    name:"icon-minus",
                                    value:"iconfont icon-minus"
                                },{
                                    name:"icon-ashbin",
                                    value:"iconfont icon-ashbin"
                                },{
                                    name:"icon-close",
                                    value:"iconfont icon-close"
                                },{
                                    name:"icon-direction-up",
                                    value:"iconfont icon-direction-up"
                                },{
                                    name:"icon-direction-right",
                                    value:"iconfont icon-direction-right"
                                },{
                                    name:"icon-direction-down",
                                    value:"iconfont icon-direction-down"
                                },{
                                    name:"icon-direction-left",
                                    value:"iconfont icon-direction-left"
                                },{
                                    name:"icon-jigouxinxi",
                                    value:"iconfont icon-jigouxinxi"
                                },{
                                    name:"icon-jigou",
                                    value:"iconfont icon-jigou"
                                },{
                                    name:"icon-quanxianguanli",
                                    value:"iconfont icon-quanxianguanli"
                                },{
                                    name:"icon-ziyuan-xianxing",
                                    value:"iconfont icon-ziyuan-xianxing"
                                },{
                                    name:"icon-zhanghaoguanli",
                                    value:"iconfont icon-zhanghaoguanli"
                                },{
                                    name:"icon-diannao",
                                    value:"iconfont icon-diannao"
                                },{
                                    name:"icon-houtairizhiguanli",
                                    value:"iconfont icon-houtairizhiguanli"
                                },{
                                    name:"icon-navicon-jsgl",
                                    value:"iconfont icon-navicon-jsgl"
                                },{
                                    name:"icon-fuwuqi",
                                    value:"iconfont icon-fuwuqi"
                                },{
                                    name:"icon-fenzu1",
                                    value:"iconfont icon-fenzu1"
                                },{
                                    name:"icon-caidan",
                                    value:"iconfont icon-caidan"
                                },{
                                    name:"icon-yonghu",
                                    value:"iconfont icon-yonghu"
                                },{
                                    name:"icon-quanxianguanli1",
                                    value:"iconfont icon-quanxianguanli1"
                                },{
                                    name:"icon--quanxianguanli",
                                    value:"iconfont icon--quanxianguanli"
                                },{
                                    name:"icon-rizhiguanli",
                                    value:"iconfont icon-rizhiguanli"
                                },{
                                    name:"icon-zuzhijigou",
                                    value:"iconfont icon-zuzhijigou"
                                },{
                                    name:"icon-2fuwuguanli",
                                    value:"iconfont icon-2fuwuguanli"
                                },{
                                    name:"icon-kehuduanguanli",
                                    value:"iconfont icon-kehuduanguanli"
                                },{
                                    name:"icon-xitongguanli",
                                    value:"iconfont icon-xitongguanli"
                                },{
                                    name:"icon-jiaoseguanli",
                                    value:"iconfont icon-jiaoseguanli"
                                },{
                                    name:"icon-jiaoseguanli",
                                    value:"iconfont icon-jiaoseguanli"
                                },{
                                    name:"icon-a-huaban1fuben10",
                                    value:"iconfont icon-a-huaban1fuben10"
                                },{
                                    name:"icon-gongyinglianfuwu",
                                    value:"iconfont icon-gongyinglianfuwu"
                                },{
                                    name:"icon-fenzu",
                                    value:"iconfont icon-fenzu"
                                }

                            ]
                        },
                        {
                            groupName:"面性",
                            icons:[
                                {
                                    name:"icon-arrow-up-filling",
                                    value:"iconfont icon-arrow-up-filling"
                                },{
                                    name:"icon-arrow-down-filling",
                                    value:"iconfont icon-arrow-down-filling"
                                },{
                                    name:"icon-arrow-left-filling",
                                    value:"iconfont icon-arrow-left-filling"
                                },{
                                    name:"icon-arrow-right-filling",
                                    value:"iconfont icon-arrow-right-filling"
                                },{
                                    name:"icon-icon-mianxing_fuzhi_kehuduan",
                                    value:"iconfont icon-icon-mianxing_fuzhi_kehuduan"
                                },{
                                    name:"icon-ziyuan",
                                    value:"iconfont icon-ziyuan"
                                },{
                                    name:"icon-jigou1",
                                    value:"iconfont icon-jigou1"
                                }
                            ]
                        }
                    ]
                }
            }
        },

        methods:{
            handleClick(){

            },

            selectIcon(icon){
                this.dialogVisible = false;
                this.$emit('selectIconCallback',icon.value);
            },
            openSelectDialog(){
                this.dialogVisible = true;
            }
        }
    }
</script>

<style scoped lang="scss">
    ::v-deep .el-dialog__body{
        padding-top: 0;
    }
    .icon-page{
        .icon-main{
            .icon-main-body{

                .group-name{
                    height: 30px;
                    line-height: 30px;
                }

                .icon-item.first-item{
                    /*border-top: 1px solid #c2c2c2;*/
                    border-left: 1px solid #c2c2c2;
                    /*border-top-left-radius: 6px;*/
                }
                /*.icon-item.last-item{*/
                /*    border-top-right-radius: 6px;*/
                /*}*/

                .icon-item.first-line-item{
                    border-top: 1px solid #c2c2c2;
                }

                .icon-item{
                    display: inline-block;
                    width: 120px;
                    height: 94px;
                    border-bottom: 1px solid #c2c2c2;
                    border-right: 1px solid #c2c2c2;
                    .icon-item-main{
                        width: 100%;
                        height: 100%;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        cursor: pointer;
                        font-size: 20px;
                        text-align: center;
                        box-sizing: border-box;
                        .icon-value{
                            height: 55px;
                            line-height: 55px;
                        }
                        .iconfont{
                            font-size: 30px;
                        }
                        .icon-name{
                            height: 35px;
                            padding: 0px 4px 0 4px;
                            font-size: 12px;
                            overflow:hidden;
                            text-overflow: ellipsis;
                            -o-text-overflow:ellipsis;
                            word-break: normal;
                            white-space: pre-wrap;
                        }
                    }
                    .icon-item-main:hover {
                        background-color: #f2f6fc;
                    }
                }
            }
        }
    }
</style>