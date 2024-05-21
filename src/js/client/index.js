// 导入axios实例
import httpRequest from '@/utils/request'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

import { UploadProps } from 'element-plus'

import {clientApi, clientGroupApi} from '@/api';
import {mainStore} from "@/store";

export default {
    name: "client",

    setup() {
        const mainStore1 = mainStore();
        return {
            mainStore1
        }
    },

    data() {
        return {
            searchForm:{

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
                groupId:"",
                name:"",
                anonymous:1,
                appScene:"PC",
                appSource:"AUTONOMY",
                state:1,
                grantType:"",
                accessTokenValidity:"",
                sort:1,
                redirectUri:"",
                description:""
            },
            grantTypeCheckList:[],

            uploadUrl: `${process.env.VUE_APP_SERVER_URL}` + "file/upload",
            headers: {
                "access-token": ""
            },

            fileServerUrl: `${process.env.VUE_APP_FILE_SERVER}`+`${process.env.VUE_APP_FILE_ENDPOINT}`+'/',

            anonymousList:[{
                label: "是",
                value: "1"
            },{
                label: "否",
                value: "0"
            }],
            stateList:[{
                label: "是",
                value: "1"
            },{
                label: "否",
                value: "0"
            }],
            appSceneList:[{
                label: "电脑端",
                value: "PC"
            },{
                label: "移动端",
                value: "MOBILE"
            }],
            grantTypeList:[{
                label: "密码模式",
                value: "PASSWORD"
            },{
                label: "授权码模式",
                value: "AUTHORIZATION_CODE"
            },{
                label: "基于App密钥的授权模式",
                value: "CLIENT_CREDENTIALS"
            },{
                label: "刷新模式",
                value: "REFRESH_TOKEN"
            }],

            appSourceList:[{
                label: "自有",
                value: "AUTONOMY"
            },{
                label: "第三方",
                value: "SUPPLIER"
            }],

            clientGroupList:[],

            rules:{
                name: [
                    { required: true, message: '请输入客户端名称', trigger: 'blur' }
                ],
                grantType: [
                    { required: true, message: '请选择授权模式', trigger: 'change' }
                ],
                redirectUri: [
                    { required: true, message: '请输入回调地址', trigger: 'blur' }
                ],
            },

            saveFlag:false,

            loading:false

        }
    },

    mounted(){
        this.getClientGroupList();
        this.onSearch();

        this.headers["access-token"] = this.mainStore1.accessToken;

    },

    methods:{
        onSearch(){
            this.getPageList();
        },

        getClientGroupList(){
            clientGroupApi.getAllList(
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
                    this.clientGroupList = response.data
                }
            }).catch(error => {
                console.log('page===========', error)
            })
        },

        addBtnClick(){
            console.log("................")
            this.dialogVisible = true;
        },

        editClick(row){

            //

            this.addForm = {},

            Object.assign(this.addForm,row);

            this.grantTypeCheckList = this.addForm.grantType.split(",");
            this.dialogVisible = true;
        },

        handleSizeChange(){

        },
        handleCurrentChange(){

        },

        handleAvatarSuccess(response){
            if(response.resultCode =="0000"){
                this.addForm.icon = response.data;
            }
        },
        beforeAvatarUpload(rawFile){

        },

        grantTypeChange(val){

            for(let i=0;i<this.grantTypeCheckList.length;i++){
                if(i==0){
                    this.addForm.grantType = ""+this.grantTypeCheckList[i];
                }else{
                    this.addForm.grantType = this.addForm.grantType+","+this.grantTypeCheckList[i];
                }
            }
        },

        saveInfo(){
            if(this.saveFlag){
                return;
            }else{
                this.$refs["addForm"].validate((valid) => {
                    if (valid) {
                        this.saveFlag = true;
                        clientApi.save(this.addForm).then(response => {
                            // debugger;
                            //适应两种分页格式
                            if(response.resultCode == "0000"){
                                ElMessage({
                                    message: '保存成功。',
                                    type: 'success',
                                })
                                this.saveFlag = false;
                            }else{
                                ElMessage.error('保存失败。')
                            }

                        }).catch(error => {
                            ElMessage.error('保存失败。')
                            console.log('page===========', error)
                            this.saveFlag = false;
                        })
                    }
                })
            }
        },

        getPageList(){

            this.loading = true;
            clientApi.getPageList(
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


        formatState(state){
            let desc = "-";
            this.stateList.forEach((item, i) => {
                if(item.value == state){
                    desc = item.label;
                    return item.label;
                }
            });
            return desc;
        },

        formatAppSource(appSource){
            let desc = "-";
            this.appSourceList.forEach((item, i) => {
                if(item.value == appSource){
                    desc = item.label;
                    return item.label;
                }
            });
            return desc;
        },
        formatAppScene(appScene){
            let desc = "-";
            this.appSceneList.forEach((item, i) => {
                if(item.value == appScene){
                    desc = item.label;
                    return item.label;
                }
            });
            return desc;
        },

        formatGrantType(grantType){
            let grantTypeArr = grantType.split(",");
            let i = 0;
            let descArr = [];
            grantTypeArr.forEach((item, i) => {

                this.grantTypeList.forEach((item1, j) => {
                    if(item == item1.value){
                        if(i==0){
                            // desc = ""+item1.label;
                            descArr.push(item1.label)
                        }else{
                            // desc = desc+""+item1.label;
                            descArr.push(item1.label)
                        }
                        i++;
                    }
                });
            });
            return descArr;
        }
    }
}