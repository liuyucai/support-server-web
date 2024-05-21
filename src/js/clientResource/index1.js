// 导入axios实例
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

import {serviceApi, clientApi, clientGroupApi,clientServiceApi,clientMenu1Api,clientRouterApi} from '@/api';
import utils from '@/utils/common'


export default {
    name: "clientResource1",

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
                pageSize:1,
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
                menuType:"DIR",
                keepAlive:0,
                visiable:1,
                sort:1,
                permission:"",
                authentication:"1"
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
                    value:"DIR"
                },{
                    label:"菜单",
                    value:"MENU"
                },{
                    label:"路由",
                    value:"ROUTER"
                },{
                    label:"功能",
                    value:"FUNCTION"
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

            menuSelectTree:[],

            apiDialogVisible:false,

            searchApiForm:{
                serviceIds:"",
                url:"",
                menuId:""
            },

            apiTableData:[],

            apiPage:{
                currentPage:1,
                pageSize:10,
                total:0
            },

            serviceList:[],

            authApiDrawer:false,

            searchSelectApiForm:{
                serviceIds:"",
                name:"",
                url:"",
                menuId:""
            },

            selectApiTableData:[],

            selectApiPage:{
                currentPage:1,
                pageSize:10,
                total:0
            },

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
                    'size': this.clientServicePage.pageSize ? this.clientServicePage.pageSize : 10,
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
            clientMenu1Api.getAllList(
                {
                    clientId:this.activeClientId,
                    sort: [
                        {
                            "direction": "sort",
                            "property": "DESC"
                        }
                    ]
                }
            ).then(response => {
                if(response.resultCode == "0000"){

                    let responseData1 = JSON.parse(JSON.stringify(response.data));

                    let menuTableData = utils.transformMenuTreeData1(response.data, "0","上级菜单","DIR");

                    var menuSelectTreeData = utils.transformMenuTreeData2(responseData1, "0","上级菜单","DIR");


                    // var menuSelectTreeData = [];

                    this.menuTableData = menuTableData;

                    //this.menuSelectTree  不显示功能
                    this.menuSelectTree = [{
                        id:"0",
                        name:"根菜单",
                        children:menuSelectTreeData,
                        parentType:"DIR",
                        menuType:"DIR",
                    }];

                    console.log("aaaaaaaaaaaaaaa");
                    console.log(menuTableData);
                    console.log(this.menuSelectTree);
                }else{
                    ElMessage.error('加载失败。')
                    this.menuSelectTree = [{
                        id:"0",
                        name:"根菜单",
                        children:[],
                        parentType:"DIR",
                        menuType:"DIR",
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
                    children:[],
                    parentType:"DIR",
                    menuType:"DIR",
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
                        clientMenu1Api.save(this.addMenuForm).then(response => {
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

        selectMenu(data,node,self){

            console.log("2222222222222222222222");
            console.log(data);
            this.addMenuForm.pid = data.id;
            this.addMenuForm.parentName = data.name;
            this.addMenuForm.parentType = data.menuType

            if(data.menuType == 'DIR'){
                if(this.addMenuForm.menuType == 'ROUTER' || this.addMenuForm.menuType == 'FUNCTION'){
                    this.addMenuForm.menuType = 'MENU';
                }
            }else if(data.menuType== 'MENU'){
                if(this.addMenuForm.menuType == 'DIR' || this.addMenuForm.menuType == 'MENU'){
                    this.addMenuForm.menuType = 'ROUTER';
                }
            }else if(data.menuType== 'ROUTER'){
                if(this.addMenuForm.menuType == 'DIR' || this.addMenuForm.menuType == 'MENU' || this.addMenuForm.menuType == 'ROUTER'){
                    this.addMenuForm.menuType = 'FUNCTION';
                }
            }
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
            // this.addMenuForm.menuType = row.menuType;
            this.addMenuForm.parentType = row.menuType;

            if(row.parentType == "DIR"){
                this.addMenuForm.menuType = "MENU";
            }else if(row.parentType == "MENU"){
                this.addMenuForm.menuType = "ROUTER";
            }else if(row.parentType == "ROUTER"){
                this.addMenuForm.menuType = "FUNCTION";
            }
            //如果上级上级菜单是  路由，只能添加功能   如果是 菜单，可以添加 路由和功能,  如果是目录 可以是 菜单
            // row.parentType

            //添加


            //编辑

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

            this.addMenuForm.authentication = row.authentication;
            this.addMenuForm.permission = row.permission;

            this.addMenuForm.parentType = row.parentType;

            //如果是菜单 修改为 目录时，如果其下有功能配置，该功能信息会删除，  还是说先提示？

            //如果 菜单想变成目录，那要            菜单->路由->功能   变不了，
            // 路由：只能选择 上级菜单是 菜单/目录，选择目录，就会变为菜单    上级菜单 只有 目录/菜单/路由     如果路由，选择变为目录，那 下面的功能 就会被删除
            // 菜单：只能选择 上级菜单是目录，如果有功能，  如果菜单，变为目录，其下 路由和功能 就会被删除
            //如果 目录 变为 菜单/路由， 其下的菜单，菜单下的路由 就会被删除


            //如果有子节点，
                    //如果是目录，只能 挂在目录下， 不能变，
                    //如果是菜单，只能挂在 目录下
                    //如果是路由，只能挂在菜单下，     路由 可以变为菜单，
            //如果子节点没有，随意

            //能变什么，由其所选的上级菜单决定，   如果 上级菜单是目录，如果其有子节点，只能选菜单    如果是菜单， 路由 ->菜单 无所谓



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
                    }
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
        },

        handleApiPageSizeChange(val){
            this.apiPage.pageSize = val;
            this.onApiSearch();
        },

        handleApiPageCurrentChange(val){
            this.apiPage.currentPage = val;
            this.onApiSearch();
        },

        apiBoundClick(row){
            this.getServiceList();

            this.searchApiForm.menuId = row.id;

            this.onApiSearch();
            this.apiDialogVisible = true;
        },

        getServiceList(){
            serviceApi.getAllList().then(response => {
                if(response.resultCode == "0000"){
                    this.serviceList = response.data
                }else{
                    ElMessage.error('加载失败。')
                }
            }).catch(error => {
                console.log('page===========', error)
                ElMessage.error('加载失败。')
            })
        },

        addApiBtnClick(){

            this.onSelectApiSearch();
            this.authApiDrawer = true;
        },

        deleteApiClick(row){
            //删除权限
            clientMenu1Api.closeApiAuth(row.menuApiId).then(response => {
                if(response.resultCode == "0000"){
                    //重新加载api
                    this.onApiSearch();
                }else{
                    ElMessage.error('保存失败。');

                }
            }).catch(error => {
                console.log('page===========', error)
                ElMessage.error('保存失败。');
            })
        },

        onApiSearch(){
            clientMenu1Api.getMenuApiList({
                'page': this.apiPage.currentPage,
                'size': this.apiPage.pageSize ? this.apiPage.pageSize : 10,
                'condition':this.searchApiForm
            }).then(response => {
                if(response.resultCode == "0000"){
                    this.apiPage.currentPage = response.page
                    this.apiPage.pageSize = response.size
                    this.apiPage.total = response.totalElement
                    this.apiTableData = response.data
                }else{
                    ElMessage.error('加载失败。')
                }
            }).catch(error => {
                console.log('page===========', error)
                ElMessage.error('加载失败。')
            })
        },

        onSelectApiSearch(){
            clientMenu1Api.getApiList({
                'page': this.selectApiPage.currentPage,
                'size': this.selectApiPage.pageSize ? this.selectApiPage.pageSize : 10,
                'condition':this.searchSelectApiForm
            }).then(response => {
                if(response.resultCode == "0000"){
                    this.selectApiPage.currentPage = response.page;
                    this.selectApiPage.pageSize = response.size;
                    this.selectApiPage.total = response.totalElement;
                    this.selectApiTableData = response.data;

                    this.selectApiTableData.forEach(item =>{
                        if(item.menuApiId){
                            item.authority = true;
                        }else{
                            item.authority = false;
                        }
                    })

                }else{
                    ElMessage.error('加载失败。')
                }
            }).catch(error => {
                console.log('page===========', error)
                ElMessage.error('加载失败。')
            })
        },

        handleSelectApiPageSizeChange(val){
            this.selectApiPage.pageSize = val;
            this.onSelectApiSearch();
        },

        handleSelectApiPageCurrentChange(val){
            this.selectApiPage.currentPage = val;
            this.onSelectApiSearch();
        },

        getFilter(){
            let arr = [];

            this.serviceList.forEach(item =>{
                arr.push({
                    text: item.name,
                    value: item.id
                });
            })

            return arr;
        },

        filterChanged(filters){
            console.log(filters);
            console.log(filters.serviceId);

            this.searchSelectApiForm.serviceIds = "";
            if(filters.serviceId.length>0){
                let i = 0;
                filters.serviceId.forEach(item =>{
                    if(i==0){
                        this.searchSelectApiForm.serviceIds = item;
                    }else{
                        this.searchSelectApiForm.serviceIds = this.searchSelectApiForm.serviceIds +","+item;
                    }
                    i++;
                })
            }

            this.onSelectApiSearch();


        },

        filterHandler(value, row, column){
            // console.log(value);
        },

        formatterServiceName(row, column, cellValue, index){
            let name = "";

            this.serviceList.forEach(item =>{
                if(item.id == row.serviceId){
                    name = item.name;
                }
            });
            return name;
        },

        apiAuthChange(row){
            if(row.authority){
                //授予权限
                clientMenu1Api.openApiAuth({
                    menuId: this.searchApiForm.menuId,
                    apiId: row.id
                }).then(response => {
                    if(response.resultCode == "0000"){
                        //重新加载api
                        this.onApiSearch();
                    }else{
                        ElMessage.error('保存失败。');
                        row.authority = false;
                    }
                }).catch(error => {
                    console.log('page===========', error)
                    ElMessage.error('保存失败。');
                    row.authority = false;
                })
            }else{
                //删除权限
                clientMenu1Api.closeApiAuth(row.menuApiId).then(response => {
                    if(response.resultCode == "0000"){
                        //重新加载api
                        this.onApiSearch();
                    }else{
                        ElMessage.error('保存失败。');
                        row.authority = true;
                    }
                }).catch(error => {
                    console.log('page===========', error)
                    ElMessage.error('保存失败。');
                    row.authority = true;
                })
            }
        },

        apiDialogClose(){

        }
    }
}