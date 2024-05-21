// 导入axios实例
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

import {serviceApi, clientApi, clientGroupApi,clientServiceApi,clientMenuApi,clientRouterApi} from '@/api';
import utils from '@/utils/common'


export default {
    name: "clientResource",

    data() {
        return {
            searchForm:{
                name:""
            },
            menuDialogVisible:false,
            routerDialogVisible:false,

            functionDialogVisible:false,

            menuLoading:false,
            routerLoading:false,

            clientServiceData:[],
            routerPage:{
                currentPage:1,
                pageSize:10,
                total:0
            },
            clientServicePage:{
                currentPage:1,
                pageSize:9,
                total:0
            },

            menuDialogTitle:"新增",
            routerDialogTitle:"新增",
            functionDialogTitle:"新增",

            addMenuForm:{
                id:"",
                clientId:"",
                name:"",
                parentName:"",
                pid:"",
                path:"",
                icon:"",
                action:"router",
                keepAlive:0,
                visiable:1,
                sort:1,
                menuType:"1"
            },

            addRouterForm:{
                id:"",
                clientId:"",
                name:"",
                path:"",
                authentication:1,
                sort:1
            },

            addFunctionForm:{
                id:"",
                pid:"",
                clientId:"",
                name:"",
                permission:"",
                sort:1
            },

            fileServerUrl: `${process.env.VUE_APP_FILE_SERVER}`+`${process.env.VUE_APP_FILE_ENDPOINT}`+'/',

            menuRules:{
                name: [
                    { required: true, message: '请输入菜单名称', trigger: 'blur' }
                ],
                parentName: [
                    { required: true, message: '请选择上级菜单', trigger: 'change' }
                ],
                path: [
                    { required: true, message: '请输入服务菜单地址', trigger: 'blur' }
                ],
                sort: [
                    { required: true, message: '请输入排序', trigger: 'change' }
                ],
                action: [
                    { required: true, message: '请选择', trigger: 'change' }
                ],
                menuType: [
                    { required: true, message: '请选择', trigger: 'change' }
                ],
                visiable: [
                    { required: true, message: '请选择', trigger: 'change' }
                ],
                keepAlive: [
                    { required: true, message: '请选择', trigger: 'change' }
                ],
            },

            routerRules:{
                name: [
                    { required: true, message: '请输入路由名称', trigger: 'blur' }
                ],
                path: [
                    { required: true, message: '请输入路由地址', trigger: 'blur' }
                ],
                sort: [
                    { required: true, message: '请输入排序', trigger: 'change' }
                ],
                authentication: [
                    { required: true, message: '请选择', trigger: 'change' }
                ]
            },

            functionRules:{
                name: [
                    { required: true, message: '请输入功能名称', trigger: 'blur' }
                ],
                permission: [
                    { required: true, message: '请输入权限标识', trigger: 'blur' }
                ],
                sort: [
                    { required: true, message: '请输入排序', trigger: 'change' }
                ]
            },

            clientList:[],

            activeTabName:"service",

            activeClientId:"",

            saveFlag:false,

            loading:false,
            url:"",
            value1:"1",

            routerTableData:[],

            menuTableData:[],

            defaultProps: {
                children: 'children',
                label: 'name'
            },
            selectMenuFilterText:"",

            showSelectMenuTree:false,

            actionList:[
                {
                    label:"路由",
                    value:"router"
                },{
                    label:"新窗口",
                    value:"blank"
                }
            ],

            menuTypeList:[
                {
                    label:"目录",
                    value:"1"
                },{
                    label:"菜单",
                    value:"2"
                }
            ],

            visiableList:[
                {
                    label:"是",
                    value:1
                },{
                    label:"否",
                    value:0
                }
            ],
            keepAliveList:[
                {
                    label:"是",
                    value:1
                },{
                    label:"否",
                    value:0
                }
            ],
            authenticationList:[
                {
                    label:"是",
                    value:1
                },{
                    label:"否",
                    value:0
                }
            ],

            menuSelectTree:[]

        }
    },

    mounted(){
        this.getClientList();
    },

    watch: {
        //tree过滤要设置监听才可以
        selectMenuFilterText(val) {
            this.$refs.selectMenuTree.filter(val);
        },
    },

    methods:{

        getClientList(){
            clientApi.getAllList(
                {
                    "sort": [
                        {
                            "direction": "sort",
                            "property": "DESC"
                        }
                    ]
                }
            ).then(response => {
                if(response.resultCode == "0000"){
                    this.clientList = response.data

                    if(!this.activeClientId && this.clientList.length>0){
                        this.activeClientId = this.clientList[0].id
                    }

                    this.onloadTabList();
                }
            }).catch(error => {
                console.log('page===========', error)
            })
        },

        addMenuBtnClick(){
            this.menuDialogVisible = true;
        },

        onloadTabList(){
            if(this.activeTabName == 'service'){
                this.getClientServiceList()
            }else if(this.activeTabName == 'router'){
                this.getRouterList();
            }else if(this.activeTabName == 'menu'){
                this.getClientMenu();
            }
        },


        getClientServiceList(){

            clientServiceApi.getPageList(
                {
                    'page': this.clientServicePage.currentPage,
                    'size': this.clientServicePage.pageSize ? this.clientServicePage.pageSize : 9,
                    'condition':{
                        clientId:this.activeClientId
                    }
                }
            ).then(response => {
                if(response.resultCode == "0000"){
                    this.clientServicePage.currentPage = response.page
                    this.clientServicePage.pageSize = response.size
                    this.clientServicePage.total = response.totalElement
                    this.clientServiceData = response.data

                    this.clientServiceData.forEach((item, i) => {
                        if(item.clientServiceId){
                            item.switch = '1';
                        }else{
                            item.switch = '0';
                        }
                    });
                }else{
                    ElMessage.error('加载失败。')
                }
                this.loading = false;
            }).catch(error => {
                console.log('page===========', error)
                ElMessage.error('加载失败。')
                this.loading = false;
            })
        },

        getClientMenu(){
            clientMenuApi.getAllList(
                {
                    clientId:this.activeClientId,
                    sort: [
                        {
                            "direction": "ASC",
                            "property": "sort"
                        }
                    ]
                }
            ).then(response => {
                if(response.resultCode == "0000"){

                    var menuTableData = utils.transformTreeData(response.data, "0","上级菜单");

                    this.menuTableData = menuTableData;
                    this.menuSelectTree = [{
                        id:"0",
                        name:"根菜单",
                        children:menuTableData
                    }];

                    console.log("aaaaaaaaaaaaaaa");
                    console.log(menuTableData);
                    console.log(this.menuSelectTree);
                }else{
                    ElMessage.error('加载失败。')
                    this.menuSelectTree = [{
                        id:"0",
                        name:"根菜单",
                        children:[]
                    }]
                }
                this.loading = false;
            }).catch(error => {
                console.log('page===========', error)
                ElMessage.error('加载失败。')
                this.loading = false;
                this.menuSelectTree = [{
                    id:"0",
                    name:"根菜单",
                    children:[]
                }]
            })
        },


        saveMenuInfo(){
            if(this.saveFlag){
                return;
            }else{
                this.$refs["addMenuForm"].validate((valid) => {
                    if (valid) {
                        this.saveFlag = true;
                        this.addMenuForm.clientId = this.activeClientId;
                        clientMenuApi.save(this.addMenuForm).then(response => {
                            // debugger;
                            //适应两种分页格式
                            if(response.resultCode == "0000"){
                                this.saveFlag = false;
                                ElMessage({
                                    message: '保存成功。',
                                    type: 'success',
                                })
                                this.onloadTabList();
                                this.menuDialogVisible = false
                            }else{
                                ElMessage.error('保存失败。')
                            }
                            this.saveFlag = false;
                        }).catch(error => {
                            ElMessage.error('保存失败。')
                            console.log('page===========', error)
                            this.saveFlag = false;
                        })
                    }
                })
            }
        },


        tabChange(val){
            this.onloadTabList();
        },

        serviceSwitchChange(item){
            console.log(item)

            if(item.switch == '1'){
                //开启
                clientServiceApi.save({
                    clientId:this.activeClientId,
                    serviceId:item.id
                }).then(response => {
                    //适应两种分页格式
                    if(response.resultCode == "0000"){
                        this.saveFlag = false;
                        ElMessage({
                            message: '保存成功。',
                            type: 'success',
                        })
                        this.onloadTabList();
                    }else{
                        ElMessage.error('保存失败。');
                        this.onloadTabList();
                    }
                    this.saveFlag = false;
                }).catch(error => {
                    ElMessage.error('保存失败。')
                    console.log('page===========', error)
                    this.saveFlag = false;
                    this.onloadTabList();
                })
            }else if(item.switch == '0'){
                //开启
                clientServiceApi.deleted(item.clientServiceId).then(response => {
                    //适应两种分页格式
                    if(response.resultCode == "0000"){
                        this.saveFlag = false;
                        ElMessage({
                            message: '保存成功。',
                            type: 'success',
                        })
                        this.onloadTabList();
                    }else{
                        ElMessage.error('保存失败。');
                        this.onloadTabList();
                    }
                    this.saveFlag = false;
                }).catch(error => {
                    ElMessage.error('保存失败。')
                    console.log('page===========', error)
                    this.saveFlag = false;
                    this.onloadTabList();
                })
            }
        },

        handleClientServicePageChange(val){
            this.clientServicePage.pageSize = val;
            this.onloadTabList();
        },

        handleClientServiceCurrentChange(val){
            this.clientServicePage.currentPage = val;
            this.onloadTabList();
        },

        handleRouterPageChange(){
            this.routerPage.pageSize = val;
            this.onloadTabList();
        },

        handleRouterCurrentChange(){
            this.routerPage.currentPage = val;
            this.onloadTabList();
        },


        selectSearchArea(data,node,self){

            this.searchForm.deviceItemValues = data.areaId;
            this.searchForm.areaName = data.areaName;
            this.$refs.searchAreaSelect.blur();
        },

        filterSearchNode(value, data) {
            if (!value) return true;
            return data.name.indexOf(value) !== -1;
        },

        selectArea(data,node,self){

            this.addMenuForm.pid = data.id;
            this.addMenuForm.parentName = data.name;
            this.$refs.menuTreeSelect.blur();
        },

        filterNode(value, data) {
            if (!value) return true;
            return data.name.indexOf(value) !== -1;
        },

        //阻止冒泡事件
        stopBubbing(){
            console.log("aaaa");
        },

        beforeSelectIcon(){
            this.$refs.iconSelectDialog.openSelectDialog();
        },


        selectIcon(icon){
            this.addMenuForm.icon = icon;
        },

        menuDialogClose(){
            this.$refs["addMenuForm"].resetFields();
        },

        formatAction(action){
            if(action=='router'){
                return "路由";
            }else if(action=='blank'){
                return "新窗口";
            }
        },

        addSubMenu(row){
            console.log(row);
            this.addMenuForm.pid = row.id;
            this.addMenuForm.parentName = row.name;

            this.menuDialogVisible = true;
        },

        editMenu(row){
            console.log(row);

            this.addMenuForm.id = row.id;
            this.addMenuForm.name = row.name;
            this.addMenuForm.clientId = row.clientId;
            this.addMenuForm.pid = row.pid;
            this.addMenuForm.parentName = row.parentName;
            this.addMenuForm.path = row.path;
            this.addMenuForm.icon = row.icon;
            this.addMenuForm.action = row.action;
            this.addMenuForm.visiable = row.visiable;
            this.addMenuForm.keepAlive = row.keepAlive;
            this.addMenuForm.sort = row.sort;
            this.addMenuForm.menuType = row.menuType;

            this.menuDialogVisible = true;
        },

        editRouter(row){
            if(row.type == 'ROUTER'){
                Object.assign(this.addRouterForm,row);
                this.routerDialogVisible = true;

            }else if(row.type == 'FUNCTION'){
                Object.assign(this.addFunctionForm,row);
                this.functionDialogVisible = true;
            }
        },

        routerDialogClose(){

            this.addRouterForm.id = "";
            this.addRouterForm.clientId = this.activeClientId;
            this.addRouterForm.name = "";
            this.addRouterForm.path = "";
            this.addRouterForm.authentication = 1;
            this.addRouterForm.sort = 1;
            // this.$refs["addRouterForm"].resetFields();
        },

        functionDialogClose(){
            this.addFunctionForm.id = "";
            this.addFunctionForm.pid = "";
            this.addFunctionForm.clientId = "";
            this.addFunctionForm.name = "";
            this.addFunctionForm.permission = "";
            this.addFunctionForm.sort = 1;
            // this.$refs["addFunctionForm"].resetFields();
        },

        addRouterBtnClick(){
            this.routerDialogVisible = true;
        },

        getRouterList(){
            clientRouterApi.getPageList(
                {
                    'page': this.routerPage.currentPage,
                    'size': this.routerPage.pageSize ? this.routerPage.pageSize : 10,
                    'condition':{
                        clientId:this.activeClientId,
                        type:'ROUTER'
                    },
                    sort:[
                        {
                            "property":"sort",
                            "direction":"ASC"
                        }
                    ]
                }
            ).then(response => {
                if(response.resultCode == "0000"){

                    this.routerPage.currentPage = response.page
                    this.routerPage.pageSize = response.size
                    this.routerPage.total = response.totalElement
                    this.routerTableData = response.data;


                    this.routerTableData.forEach(item =>{
                        if(item.functionNumber>0){
                            item.hasChildren=true;
                            item.type = "ROUTER";
                        }
                    })
                    console.log(this.routerTableData);
                }else{
                    ElMessage.error('加载失败。')

                }
                this.loading = false;
            }).catch(error => {
                console.log('page===========', error)
                ElMessage.error('加载失败。')
                this.loading = false;
            })
        },

        saveRouterInfo(){
            if(this.saveFlag){
                return;
            }else{
                this.$refs["addRouterForm"].validate((valid) => {
                    if (valid) {
                        this.saveFlag = true;
                        this.addRouterForm.clientId = this.activeClientId;
                        clientRouterApi.saveRouter(this.addRouterForm).then(response => {
                            // debugger;
                            //适应两种分页格式
                            if(response.resultCode == "0000"){
                                this.saveFlag = false;
                                ElMessage({
                                    message: '保存成功。',
                                    type: 'success',
                                })
                                this.onloadTabList();
                                this.routerDialogVisible = false
                            }else{
                                ElMessage.error('保存失败。')
                            }
                            this.saveFlag = false;
                        }).catch(error => {
                            ElMessage.error('保存失败。')
                            console.log('page===========', error)
                            this.saveFlag = false;
                        })
                    }
                })
            }
        },

        addFunctionClick(row){
            this.addFunctionForm.pid = row.id;
            this.functionDialogVisible = true;
        },

        saveFunctionInfo(){
            if(this.saveFlag){
                return;
            }else{
                this.$refs["addFunctionForm"].validate((valid) => {
                    if (valid) {
                        this.saveFlag = true;
                        this.addFunctionForm.clientId = this.activeClientId;
                        clientRouterApi.saveFunction(this.addFunctionForm).then(response => {
                            // debugger;
                            //适应两种分页格式
                            if(response.resultCode == "0000"){
                                this.saveFlag = false;
                                ElMessage({
                                    message: '保存成功。',
                                    type: 'success',
                                })
                                this.onloadTabList();
                                this.functionDialogVisible = false
                            }else{
                                ElMessage.error('保存失败。')
                            }
                            this.saveFlag = false;
                        }).catch(error => {
                            ElMessage.error('保存失败。')
                            console.log('page===========', error)
                            this.saveFlag = false;
                        })
                    }
                })
            }
        },


        loadFunction(row, treeNode, resolve){
            clientRouterApi.getFunctionList(
                {
                    pid:row.id
                }
            ).then(response => {
                if(response.resultCode == "0000"){

                    response.data.forEach(item =>{
                        item.type = "FUNCTION";
                    })
                    resolve(response.data);

                }else{
                    ElMessage.error('加载失败。')

                }
                this.loading = false;
            }).catch(error => {
                console.log('page===========', error)
                ElMessage.error('加载失败。')
                this.loading = false;
            })
        },

        clientSelect(item){
            this.activeClientId = item.id;

            this.onloadTabList();
        }
    }
}