import {ElMessage} from "element-plus";
import utils from "@/utils/common";
import {roleResourceApi, clientGroupApi} from '@/api';


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
        }
    },

    mounted() {
        this.roleId = this.$route.query.roleId;

        this.getRoleClient();
    },

    methods: {

        getRoleClient(){
            roleResourceApi.getClientList(
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
            roleResourceApi.getMenuList(
                {
                    roleId:this.roleId,
                    clientId:this.clientId
                }
            ).then(response => {
                if(response.resultCode == "0000"){
                    this.menuTableData = response.data;

                    this.menuTableData.forEach((item, i) => {
                        if(item.roleResourceId){
                            item.authority = true;
                        }else{
                            item.authority = false;
                        }
                    });

                    var menuTableData = utils.transformTreeData(this.menuTableData, "0","上级菜单");

                    this.menuTableData = menuTableData;

                }
            }).catch(error => {
                console.log('page===========', error)
            })
        },

        getRouterList(){
            roleResourceApi.getRouterList(
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
            roleResourceApi.getFunctionList(
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
                roleResourceApi.openClientAuth(
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
                roleResourceApi.closeClientAuth(row.roleResourceId).then(response => {
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
                roleResourceApi.openMenuAuth(
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
                roleResourceApi.closeMenuAuth(row.roleResourceId).then(response => {
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
                    roleResourceApi.openRouterAuth(
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
                    roleResourceApi.closeRouterAuth(row.roleResourceId).then(response => {
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
                    roleResourceApi.openFunctionAuth(
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
                    roleResourceApi.closeFunctionAuth(row.roleResourceId).then(response => {
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
    }
}