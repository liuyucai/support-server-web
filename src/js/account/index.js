import {roleApi, orgApi, clientApi,userAccountApi} from '@/api';
import {ElMessage} from "element-plus";
import utils from "@/utils/common";

export default {
    name: "account",

    data() {
        return {
            searchForm:{
                userName:"",
                phoneNo:""
            },

            uploadUrl: `${process.env.VUE_APP_SERVER_URL}` + "file/upload",
            headers: {
                "Authorization": "123456"
            },

            fileServerUrl: `${process.env.VUE_APP_FILE_SERVER}`+`${process.env.VUE_APP_FILE_ENDPOINT}`+'/',
            tableData:[
            ],

            page:{
                currentPage:1,
                pageSize:10,
                total:0
            },

            dialogVisible:false,

            dialogTitle:"新增",

            addForm:{
                id:"",
                avatar:"",
                userName:"",
                realName:"",
                password:"",
                phoneNo:"",
                identityType:"",
                identityNo:"",
                gender:"",
                email:"",
                enabled:1,
                accountType:"COMMON",
                effectiveDeadline:""
            },
            rules:{
                userName: [
                    { required: true, message: '请输入用户名', trigger: 'blur' }
                ],
                realName: [
                    { required: true, message: '请输入姓名', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' }
                ],
                gender: [
                    { required: true, message: '请选择性别', trigger: 'change' }
                ],
                enabled: [
                    { required: true, message: '请选择状态', trigger: 'change' }
                ],
                accountType: [
                    { required: true, message: '请选择账号类型', trigger: 'change' }
                ],
                effectiveDeadline: [
                    { required: true, message: '请输入有效截止时间', trigger: 'change' }
                ]
            },

            identityTypeList:[{
                label: "居民身份证",
                value: "01"
            },{
                label: "港澳通行证",
                value: "02"
            }],
            genderList:[{
                label: "男",
                value: "M"
            },{
                label: "女",
                value: "F"
            },{
                label: "其他",
                value: "OTHER"
            }],
            enabledList:[{
                label: "有效",
                value: "1"
            },{
                label: "禁用",
                value: "0"
            }],
            accountTypeList:[{
                label: "普通账号",
                value: "COMMON"
            },{
                label: "临时账号",
                value: "TEMP"
            }],


            loading:false,

            saveFlag:false,

            publicKey:`${process.env.VUE_APP_PUBLIC_KEY}`,

            activeId:"",
            deleteDialogVisible:false,

            resetPwdDialogVisible:false
        }
    },
    mounted() {

        this.onload();
    },
    methods: {

        onload(){
            this.getUserList();
        },
        getUserList(){
            userAccountApi.getPageList(
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

        onSearch(){
            this.getUserList();
        },

        handleSizeChange(val){

            this.page.pageSize = val;
            this.getUserList();
        },
        handleCurrentChange(val){
            this.page.currentPage = val;
            this.getUserList();
        },

        addBtnClick(){
            this.dialogVisible = true;
            this.dialogTitle = "新增";
        },

        saveInfo(){
            if(this.saveFlag){
                return;
            }else{
                this.$refs["addForm"].validate((valid) => {
                    if (valid) {
                        this.saveFlag = true;

                        let saveForm = {
                                id:"",
                                avatar:"",
                                userName:"",
                                realName:"",
                                password:"",
                                phoneNo:"",
                                identityType:"",
                                identityNo:"",
                                gender:"",
                                email:"",
                                orgIds:[],
                                enabled:1,
                                accountType:"",
                                effectiveDeadline:""
                        };
                        Object.assign(saveForm,this.addForm);

                        const encryptor = new JSEncrypt()
                        encryptor.setPublicKey(this.publicKey) // 设置公钥
                        saveForm.password = encryptor.encrypt(this.addForm.password) // 对需要加密的数据进行加密

                        userAccountApi.save(this.saveForm).then(response => {
                            // debugger;
                            //适应两种分页格式
                            if(response.resultCode == "0000"){
                                this.saveFlag = false;
                                ElMessage({
                                    message: '保存成功。',
                                    type: 'success',
                                })
                                this.dialogVisible = false,
                                this.getUserList();
                            }else if(response.resultCode == "0001"){
                                ElMessage.error('保存失败。')
                            }else{
                                ElMessage.error(response.resultDesc)
                            }
                            this.saveFlag = false;
                        }).catch(error => {
                            ElMessage.error('保存失败。')
                            console.log('page===========', error)
                            this.saveFlag = false;
                        })
                    }else{}
                    console.log("11111111111")
                })
            }
        },

        dialogClose(){
            this.$refs["addForm"].resetFields();
        },

        addClick(row){
            this.roleSelectDrawer = true;
        },
        editClick(row){
            this.dialogTitle = "修改";
            this.addForm.id = row.id;
            this.addForm.avatar = row.avatar;
            this.addForm.userName = row.userName;
            this.addForm.realName = row.realName;
            this.addForm.phoneNo = row.phoneNo;
            this.addForm.identityType = row.identityType;
            this.addForm.identityNo = row.identityNo;
            this.addForm.gender = row.gender;
            this.addForm.email = row.email;
            this.addForm.enabled = row.enabled;
            this.addForm.accountType = row.accountType;
            this.dialogVisible = true;
        },
        deleteClick(row){
            this.activeId = row.id;
            this.deleteDialogVisible = true;
        },

        formatAccountType(accountType){
            let desc = "-";
            this.accountTypeList.forEach((item, i) => {
                if(item.value == accountType){
                    desc = item.label;
                    return item.label;
                }
            });
            return desc;
        },

        handleAvatarSuccess(response){
            if(response.resultCode =="0000"){
                this.addForm.avatar = response.data;
            }
        },

        beforeAvatarUpload(rawFile){

        },

        deleteConfirm(){
            this.deleteDialogVisible = false;
            userAccountApi.deleted(this.activeId ).then(response => {
                if(response.resultCode == "0000"){
                    ElMessage.success('删除成功。');
                    this.onSearch();
                }else{
                    ElMessage.error('删除失败。')
                }
            }).catch(error => {
                console.log(error)
                ElMessage.error('删除失败。')
            })
        },

        resetPwdClick(row){
            this.activeId = row.id;
            this.resetPwdDialogVisible = true;
        },

        resetPwdConfirm(){
            this.resetPwdDialogVisible = false;
            if(this.saveFlag){
                return;
            }else{
                this.saveFlag = true;
                userAccountApi.resetPassword(this.activeId).then(response => {
                    if(response.resultCode == "0000"){
                        ElMessage.success('重置密码成功。');
                    }else{
                        ElMessage.error('重置密码失败。')
                    }
                    this.saveFlag = false;
                }).catch(error => {
                    console.log(error)
                    ElMessage.error('重置密码失败。')
                    this.saveFlag = false;
                })
            }
        }
    }
}