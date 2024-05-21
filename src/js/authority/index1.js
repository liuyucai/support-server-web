import {ElMessage} from "element-plus";
import utils from "@/utils/common";
import {roleResource1Api, clientGroupApi} from '@/api';

import { nextTick  } from 'vue';


export default {
    name: "authority",

    data() {
        return {

            roleId:"",
            clientId:"",
            fileServerUrl: `${process.env.VUE_APP_FILE_SERVER}`+`${process.env.VUE_APP_FILE_ENDPOINT}`+'/',
            clientLoading:false,
            clientTableData:[],

            activeTabName:"menu",

            menuLoading:false,
            routerLoading:false,
            menuTableData:[],
            routerTableData:[],

            defaultProps:{
                children: 'children',
                label: 'name',
            },

            checkStrictly:false,
            selectAll:false,

            currentClient:{
                authority:false
            }
        }
    },

    mounted() {
        this.roleId = this.$route.query.roleId;

        this.getRoleClient();
    },

    methods: {

        getRoleClient(){
            roleResource1Api.getClientList(
                {
                    roleId:this.roleId
                }
            ).then(response => {
                if(response.resultCode == "0000"){
                    this.clientTableData = response.data;

                    this.clientTableData.forEach((item, i) => {
                        if(item.roleResourceId){
                            item.authority = true;
                        }else{
                            item.authority = false;
                        }
                    })

                }
            }).catch(error => {
                console.log('page===========', error)
            })
        },

        getMenuList(){
            roleResource1Api.getMenuList(
                {
                    roleId:this.roleId,
                    clientId:this.clientId
                }
            ).then(response => {
                if(response.resultCode == "0000"){
                    this.menuTableData = response.data;

                    let tempData = JSON.parse(JSON.stringify(response.data));

                    var menuTableData = utils.transformTreeData(this.menuTableData, "0","上级菜单");

                    this.menuTableData = menuTableData;

                    nextTick(()=>{
                        tempData.forEach(item =>{
                            if(item.roleResourceId){
                                console.log(item);
                                this.$refs.menuTree.setChecked(item.id,true,false);
                            }
                        })
                    });
                }
            }).catch(error => {
                console.log('page===========', error)
            })
        },

        getRouterList(){
            roleResource1Api.getRouterList(
                {
                    roleId:this.roleId,
                    clientId:this.clientId
                }
            ).then(response => {
                if(response.resultCode == "0000"){
                    this.routerTableData = response.data;
                    this.routerTableData.forEach((item, i) => {
                        if(item.roleResourceId){
                            item.authority = true;
                        }else{
                            item.authority = false;
                        }

                        if(item.functionNumber>0){
                            item.hasChildren=true;
                        }
                    })
                }
            }).catch(error => {
                console.log('page===========', error)
            })
        },

        addSubMenu(){

        },
        tabChange(val){
            this.onloadTabList();
        },
        loadFunction(row, treeNode, resolve){
            roleResource1Api.getFunctionList(
                {
                    roleId:this.roleId,
                    clientId:this.clientId,
                    pid:row.id
                }
            ).then(response => {
                if(response.resultCode == "0000"){

                    response.data.forEach(item =>{
                        if(item.roleResourceId){
                            item.authority = true;
                        }else{
                            item.authority = false;
                        }
                    })
                    resolve(response.data);
                }
            }).catch(error => {
                console.log('page===========', error)
            })
        },

        handleCurrentChange(item){

            this.clientId = item.id;

            this.currentClient = item;

            console.log(item);

            this.onloadTabList();
        },

        onloadTabList(){
            if(this.activeTabName == 'menu'){
                this.getMenuList()
            }else if(this.activeTabName == 'router'){
                this.getRouterList();
            }
        },

        clientAuthChange(row){
            if(row.authority){
                roleResource1Api.openClientAuth(
                    {
                        roleId:this.roleId,
                        clientId:row.id
                    }
                ).then(response => {
                    if(response.resultCode == "0000"){
                        ElMessage({message: '操作成功。', type: 'success',})
                        this.getRoleClient();
                    }else{
                        ElMessage.error('操作失败。')
                        row.authority = !row.authority;
                    }
                }).catch(error => {
                    console.log('page===========', error)
                    ElMessage.error('操作失败。');
                    row.authority = !row.authority;
                })
            }else{
                roleResource1Api.closeClientAuth(row.roleResourceId).then(response => {
                    if(response.resultCode == "0000"){
                        ElMessage({message: '操作成功。', type: 'success',});
                        this.getRoleClient();
                        this.getMenuList();
                    }else{
                        ElMessage.error('操作失败。')
                        row.authority = !row.authority;
                    }
                }).catch(error => {
                    console.log('page===========', error)
                    ElMessage.error('操作失败。')
                    row.authority = !row.authority;
                })
            }
            console.log(row);
        },

        clientMenuChange(row){
            if(row.authority){
                roleResource1Api.openMenuAuth(
                    {
                        roleId:this.roleId,
                        clientId:this.clientId,
                        resourceId:row.id
                    }
                ).then(response => {
                    if(response.resultCode == "0000"){
                        ElMessage({message: '操作成功。', type: 'success',});
                        this.getMenuList();
                    }else{
                        ElMessage.error('操作失败。')
                        row.authority = !row.authority;
                    }
                }).catch(error => {
                    console.log('page===========', error)
                    ElMessage.error('操作失败。');
                    row.authority = !row.authority;
                })
            }else{
                roleResource1Api.closeMenuAuth(row.roleResourceId).then(response => {
                    if(response.resultCode == "0000"){
                        ElMessage({message: '操作成功。', type: 'success',});
                        this.getMenuList();
                    }else{
                        ElMessage.error('操作失败。')
                        row.authority = !row.authority;
                    }
                }).catch(error => {
                    console.log('page===========', error)
                    ElMessage.error('操作失败。')
                    row.authority = !row.authority;
                })
            }
        },

        clientRouterChange(row){

            if(row.type == 'ROUTER'){
                if(row.authority){
                    roleResource1Api.openRouterAuth(
                        {
                            roleId:this.roleId,
                            clientId:this.clientId,
                            resourceId:row.id
                        }
                    ).then(response => {
                        if(response.resultCode == "0000"){
                            ElMessage({message: '操作成功。', type: 'success',});
                            this.getRouterList();
                        }else{
                            ElMessage.error('操作失败。')
                            row.authority = !row.authority;
                        }
                    }).catch(error => {
                        console.log('page===========', error)
                        ElMessage.error('操作失败。');
                        row.authority = !row.authority;
                    })
                }else{
                    roleResource1Api.closeRouterAuth(row.roleResourceId).then(response => {
                        if(response.resultCode == "0000"){
                            ElMessage({message: '操作成功。', type: 'success',});
                            this.getRouterList();
                        }else{
                            ElMessage.error('操作失败。')
                            row.authority = !row.authority;
                        }
                    }).catch(error => {
                        console.log('page===========', error)
                        ElMessage.error('操作失败。')
                        row.authority = !row.authority;
                    })
                }
            }else if(row.type == 'FUNCTION'){
                if(row.authority){
                    roleResource1Api.openFunctionAuth(
                        {
                            roleId:this.roleId,
                            clientId:this.clientId,
                            resourceId:row.id
                        }
                    ).then(response => {
                        if(response.resultCode == "0000"){
                            ElMessage({message: '操作成功。', type: 'success',});
                            this.getRouterList();
                        }else{
                            ElMessage.error('操作失败。')
                            row.authority = !row.authority;
                        }
                    }).catch(error => {
                        console.log('page===========', error)
                        ElMessage.error('操作失败。');
                        row.authority = !row.authority;
                    })
                }else{
                    roleResource1Api.closeFunctionAuth(row.roleResourceId).then(response => {
                        if(response.resultCode == "0000"){
                            ElMessage({message: '操作成功。', type: 'success',});
                            this.getRouterList();
                        }else{
                            ElMessage.error('操作失败。')
                            row.authority = !row.authority;
                        }
                    }).catch(error => {
                        console.log('page===========', error)
                        ElMessage.error('操作失败。')
                        row.authority = !row.authority;
                    })
                }
            }
        },

        onSubmit(){

            let checkedKeys = this.$refs.menuTree.getCheckedKeys();

            console.log(checkedKeys);

            let list =[]

            if(checkedKeys){
                list = checkedKeys;
            }

            roleResource1Api.saveMenuAuth(
                {
                    roleId:this.roleId,
                    clientId:this.clientId,
                    menuList:list
                }
            ).then(response => {
                if(response.resultCode == "0000"){
                    ElMessage({message: '操作成功。', type: 'success',});
                    this.getMenuList();
                }else{
                    ElMessage.error('操作失败。')
                }
            }).catch(error => {
                console.log('page===========', error)
                ElMessage.error('操作失败。');
            })

            //  如果路由在菜单下面，这样的话，授予路由权限时，一定要授予菜单权限？。   如看详情时，一定要有上面的菜单权限。

            //  还是：选择路由时，可以不选菜单，选择菜单时，会级联？  有个父子联动的选项？不要，选中菜单/功能/目录时，自动选中上级的菜单，

            //  如果不要父子联动选项，选择父节点时，自动选择子节点，  还是说有父子联动选项，只是联动父  -> 子，  就用这个

            //  如果不要路由的类型，则路由详情 没有 层次！

            //  可以只选菜单，不选目录，因为菜单是路由。

            //  默认不开启父子联动，这样的话，只有选择功能时，才会自动选择路由/菜单，目录、菜单、路由不需要联动。



        },

        menuSelectClick(selection, row){
            console.log(selection);
            console.log(row)
        },

        checkChange(data,status,childStatus){


            /**
             *
             * 先判断是选中，还是取消选中
             *
             * 选中：
             *      先判断是否开启父子联动，
             *         是：不用管
             *         否：判断节点类型，是否是功能类型，
             *              是：判断是否选中了父节点，
             *              否：不用管
             * 取消选中，判断childStatus 是否有子节点被选中，如果是菜单或者路由，则，取消其下的功能选中
             *
             */
            if(status){
                if(!this.checkStrictly){
                    if(data.menuType== "FUNCTION"){
                        let hasParentChecked = false;

                        //获取当前被选中的数据
                        let checkedKeys = this.$refs.menuTree.getCurrentKey();

                        if(checkedKeys){
                            for(let i=0;i<checkedKeys.length;i++){
                                if(checkedKeys[i] == data.pid){
                                    hasParentChecked = true;
                                    break;
                                }
                            }
                            if(!hasParentChecked){

                                console.log("00000000000000000");
                                this.$refs.menuTree.setChecked(data.pid,true,false);
                            }
                        }else{
                            this.$refs.menuTree.setChecked(data.pid,true,false);
                        }

                    }
                }
            }else{
                //如果取消选中

                //判断是否是菜单或路由
                if(!this.checkStrictly){
                    if(data.menuType== "MENU" || data.menuType== "ROUTER"){
                        //如果是菜单/路由，就把下面的功能取消
                        //获取当前被选中的数据
                        let checkedNodes = this.$refs.menuTree.getCheckedNodes();

                        console.log(checkedNodes)

                        if(checkedNodes){
                            checkedNodes.forEach(item=>{
                                if(item.pid == data.id && item.menuType== "FUNCTION"){
                                    this.$refs.menuTree.setChecked(item.id,false,false);
                                }
                            })
                        }
                    }
                }
            }
        },
    }
}