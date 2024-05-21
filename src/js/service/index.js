// 导入axios实例
import httpRequest from '@/utils/request'
import { ref } from 'vue'
import { ElMessage,ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

import { UploadProps } from 'element-plus'

import {clientServiceApi, serviceApi} from '@/api';

export default {
    name: "service",

    data() {
        return {
            searchForm:{
                name:""
            },
            dialogVisible:false,
            tableData:[],
            page:{
                currentPage:1,
                pageSize:10,
                total:0
            },
            dialogTitle:"新增",
            addForm:{
                id:"",
                name:"",
                code:"",
                description:""
            },

            rules:{
                name: [
                    { required: true, message: '请输入客户端名称', trigger: 'blur' }
                ],
                code: [
                    { required: true, message: '请输入服务编码', trigger: 'blur' }
                ]
            },

            saveFlag:false,

            loading:false,

            editDrawer:false,

            apiTableData:[],

            apiSearchForm:{
                serviceId:"",
                url:"",
                name:""
            },
            apiPage:{
                currentPage:1,
                pageSize:10,
                total:0
            },

            authServicePage:{
                currentPage:1,
                pageSize:9,
                total:0
            },

            editForm:{
                id:"",
                name:"",
                code:"",
                description:""
            },

            apiLoading:false,

            dialogApiVisible:false,

            dialogApiTitle:"新增API",

            addApiForm:{
                id:"",
                requestMethod:"GET",
                url:"",
                name:"",
                authStatus:"1",
                handler:"",
                permission:""
            },

            apiRules:{
                requestMethod: [
                    { required: true, message: '请选择请求类型', trigger: 'change' }
                ],
                url: [
                    { required: true, message: '请输入api地址', trigger: 'blur' }
                ],
                name: [
                    { required: true, message: '请输入api名称', trigger: 'blur' }
                ],
                authStatus: [
                    { required: true, message: '请选择是否鉴权', trigger: 'change' }
                ],
                permission: [
                    { required: true, message: '请输入权限标识', trigger: 'blur' }
                ],
            },

            requestMethodList:[{
                label: "GET",
                value: "GET"
            },{
                label: "POST",
                value: "POST"
            },{
                label: "PUT",
                value: "PUT"
            },{
                label: "PATCH",
                value: "PATCH"
            },{
                label: "DELETE",
                value: "DELETE"
            }],
            authStatusList:[{
                label: "是",
                value: "1"
            },{
                label: "否",
                value: "0"
            }],

            serviceId:"",

            editApiDisabled:false,

            authServiceDrawer:false,

            authServiceData:[],

            activeServiceId:"",

        }
    },

    mounted(){
        this.onSearch();
    },

    methods:{

        onSearch(){
            this.getPageList();
        },

        addBtnClick(){
            console.log("................")
            this.dialogVisible = true;
        },

        handleSizeChange(val){

            this.page.pageSize = val;
            this.onSearch();
        },
        handleCurrentChange(val){
            this.page.currentPage = val;
            this.onSearch();
        },

        getPageList(){

            this.loading = true;
            serviceApi.getPageList(
                {
                    'page': this.page.currentPage,
                    'size': this.page.pageSize ? this.page.pageSize : 10,
                    'condition':this.searchForm
                }
            ).then(response => {
                if(response.resultCode == "0000"){
                    this.page.currentPage = response.page
                    this.page.pageSize = response.size
                    this.page.total = response.totalElement
                    this.tableData = response.data
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

        editServiceClick(){
            this.dialogVisible = true;
            this.dialogTitle = "编辑";

            this.addForm = this.editForm;
        },


        saveInfo(){
            if(this.saveFlag){
                return;
            }else{
                this.$refs["addForm"].validate((valid) => {
                    if (valid) {
                        this.saveFlag = true;
                        serviceApi.save(this.addForm).then(response => {
                            // debugger;
                            //适应两种分页格式
                            if(response.resultCode == "0000"){
                                this.saveFlag = false;
                                ElMessage({
                                    message: '保存成功。',
                                    type: 'success',
                                })
                                this.getPageList();
                                this.$refs["addForm"].resetFields();

                                this.dialogVisible = false;

                                this.editDrawer = false;
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

        editClick(row){
            this.editForm = row;

            //获取api列表
            this.apiSearchForm.serviceId = row.id;
            this.serviceId = row.id;
            this.onApiSearch();
            this.editDrawer = true;
        },

        authClick(row){
            this.authServiceDrawer = true;

            this.activeServiceId = row.id;
            this.getServiceAuthPageList();

        },

        getServiceAuthPageList(){
            serviceApi.getServiceAuthPageList(
                {
                    'page': this.authServicePage.currentPage,
                    'size': this.authServicePage.pageSize ? this.authServicePage.pageSize : 10,
                    'condition':{
                        id:this.activeServiceId
                    }
                }
            ).then(response => {
                if(response.resultCode == "0000"){
                    this.authServicePage.currentPage = response.page
                    this.authServicePage.pageSize = response.size
                    this.authServicePage.total = response.totalElement

                    this.authServiceData = response.data

                    this.authServiceData.forEach((item, i) => {
                        if(item.authId){
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
                // this.apiLoading = false;
            })
        },

        serviceSwitchChange(item){
            console.log(item)

            if(item.switch == '1'){
                //开启
                serviceApi.saveServiceAuth({
                    serviceId:item.id,
                    authServiceId:this.activeServiceId
                }).then(response => {
                    //适应两种分页格式
                    if(response.resultCode == "0000"){
                        this.saveFlag = false;
                        ElMessage({
                            message: '保存成功。',
                            type: 'success',
                        })
                        this.getServiceAuthPageList();
                    }else{
                        ElMessage.error('保存失败。');
                        this.getServiceAuthPageList();
                    }
                    this.saveFlag = false;
                }).catch(error => {
                    ElMessage.error('保存失败。')
                    console.log('page===========', error)
                    this.saveFlag = false;
                    this.getServiceAuthPageList();
                })
            }else if(item.switch == '0'){
                //开启
                serviceApi.deleteServiceAuth(item.authId).then(response => {
                    //适应两种分页格式
                    if(response.resultCode == "0000"){
                        this.saveFlag = false;
                        ElMessage({
                            message: '保存成功。',
                            type: 'success',
                        })
                        this.getServiceAuthPageList();
                    }else{
                        ElMessage.error('保存失败。');
                        this.getServiceAuthPageList();
                    }
                    this.saveFlag = false;
                }).catch(error => {
                    ElMessage.error('保存失败。')
                    console.log('page===========', error)
                    this.saveFlag = false;
                    this.getServiceAuthPageList();
                })
            }
        },

        onApiSearch(){


            this.apiLoading = true;
            serviceApi.getApiPageList(
                {
                    'page': this.apiPage.currentPage,
                    'size': this.apiPage.pageSize ? this.apiPage.pageSize : 10,
                    'condition':this.apiSearchForm
                }
            ).then(response => {
                if(response.resultCode == "0000"){
                    this.apiPage.currentPage = response.page
                    this.apiPage.pageSize = response.size
                    this.apiPage.total = response.totalElement
                    this.apiTableData = response.data
                }else{
                    ElMessage.error('加载失败。')
                }
                this.loading = false;
            }).catch(error => {
                console.log('page===========', error)
                ElMessage.error('加载失败。')
                this.apiLoading = false;
            })

        },

        handleApiSizeChange(val){

            this.apiPage.pageSize = val;
            this.onApiSearch();
        },

        handleApiCurrentChange(val){
            this.apiPage.currentPage = val;
            this.onApiSearch();
        },

        addApiDialogClose(){
            this.$refs["addApiForm"].resetFields();
            this.addApiForm.id = "";
            this.addApiForm.authStatus = "1";
            this.addApiForm.handler = "";
            this.addApiForm.permission = "";
            this.addApiForm.requestMethod = "GET";
            this.addApiForm.url = "";
        },


        editApiClick(row){
            // this.addApiForm = row;

            this.addApiForm.id = row.id;
            this.addApiForm.authStatus = row.authStatus;
            this.addApiForm.handler = row.handler;
            this.addApiForm.permission = row.permission;
            this.addApiForm.requestMethod = row.requestMethod;
            this.addApiForm.url = row.url;
            this.addApiForm.permissionType = row.permissionType;

            if(row.sourceType == "SYSTEM"){
                this.editApiDisabled = true;
            }else{
                this.editApiDisabled = false;
            }
            this.dialogApiVisible = true;
        },

        saveApi(){
            if(this.saveFlag){
                return;
            }else{
                this.$refs["addApiForm"].validate((valid) => {
                    if (valid) {
                        this.saveFlag = true;
                        this.addApiForm.serviceId = this.serviceId;
                        serviceApi.saveApi(this.addApiForm).then(response => {
                            // debugger;
                            //适应两种分页格式
                            if(response.resultCode == "0000"){
                                this.saveFlag = false;
                                this.dialogApiVisible = false;
                                ElMessage({
                                    message: '保存成功。',
                                    type: 'success',
                                })
                                this.getPageList();
                                this.$refs["addApiForm"].resetFields();
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

        tableRowClassName({row,rowIndex}){
            if (row.compareStatus == "0") {
                return 'warning-row'
            }
            return ''

        },

        addApiBtnClick(){
            this.editApiDisabled = false;
            this.dialogApiVisible = true;
        },


        deleteApiClick(row){
            ElMessageBox.confirm(
                '确认删除吗?',
                'Warning',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }
            ).then(() => {
                serviceApi.deleteApi(row.id).then(response => {
                    // debugger;
                    //适应两种分页格式
                    if(response.resultCode == "0000"){
                        ElMessage({
                            message: '删除成功。',
                            type: 'success',
                        })
                        this.getPageList();
                    }else{
                        ElMessage.error('删除失败。')
                    }
                }).catch(error => {
                    ElMessage.error('删除失败。')
                })
            })
        },


        getAuthServiceList(){

        },


        handleAuthServicePageChange(val){

            this.authServicePage.pageSize = val;
            this.getAuthServiceList();
        },
        handleAuthServiceCurrentChange(val){
            this.authServicePage.currentPage = val;
            this.getAuthServiceList();
        },
    }
}