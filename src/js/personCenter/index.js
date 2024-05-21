import {clientApi, userApi,userAccountApi} from '@/api';
import {ElMessage} from "element-plus";
import {mainStore} from "@/store";
import JSEncrypt from 'jsencrypt/bin/jsencrypt'
export default {
    name: "personCenter",

    data() {

        const validateConfirmPassword = (rule, value, callback) => {
            if(value != this.editPasswordForm.newPassword){
                callback(new Error('两次输入的密码不一致'))
            }
            callback()
        };

        return {
            user:{
                img:""
            },
            activeTabName:"baseInfo",

            fileServerUrl: `${process.env.VUE_APP_FILE_SERVER}`+`${process.env.VUE_APP_FILE_ENDPOINT}`+'/',

            addForm:{

            },
            roleList:[],
            userTableData:[],

            orgUserInfo:{

            },

            page:{
                currentPage:1,
                pageSize:10,
                total:0
            },

            editPasswordDialogVisible:false,

            editPasswordForm:{
                id:"",
                oldPassword:"",
                newPassword:"",
                confirmPassword:""
            },

            editPasswordRules: {
                oldPassword: [
                    {required: true, message: '请输入旧密码', trigger: 'blur'},
                ],
                newPassword: [
                    {required: true, message: '请输入新密码', trigger: 'blur'},
                    { min: 6, max: 20, message: '密码长度在6到20个字符', trigger: 'blur' },
                ],
                confirmPassword: [
                    {required: true, message: '请输入确认密码', trigger: 'blur'},
                    { min: 6, max: 20, message: '密码长度在6到20个字符', trigger: 'blur' },
                    { validator: validateConfirmPassword, trigger: 'blur' }
                ],
            },

            saveFlag:false,

            publicKey:`${process.env.VUE_APP_PUBLIC_KEY}`,

            resetPwdDialogVisible:false,


            unbindPhoneDialogVisible:false,

            bindPhoneDialogVisible:false,

            bindPhoneForm:{
                id:"",
                phoneNo:""
            },
            bindPhoneRules: {
                phoneNo: [
                    {required: true, message: '请输入手机号', trigger: 'blur'},
                    { min: 11, max: 11, message: '请输入正确手机号', trigger: 'blur' },
                ]
            },

            bindEmailDialogVisible:false,

            bindEmailForm:{
                id:"",
                email:""
            },
            bindEmailRules: {
                email: [
                    {required: true, message: '请输入邮箱', trigger: 'blur'}]
            },

            unbindEmailDialogVisible:false
        }
    },

    mounted(){
        this.getUserInfo();

        this.tabChange(this.activeTabName);
    },

    methods:{
        tabChange(val){

            console.log(val);

            let mainStore1 = mainStore();

            console.log(mainStore1.userInfo);

            if(val == "baseInfo"){
                //判断机构用户信息是否获取了，没有的划，就获取

                if(!this.orgUserInfo.id){
                    this.getOrgUserInfo();
                }
            }else if(val == "orgUserInfo"){
                //获取用户信息

                this.getUserList();
            }

            // this.onloadTabList();

            // 获取 tab的列表信息
        },

        getOrgUserInfo(){
            console.log("1111111111");

            let mainStore1 = mainStore();
            userApi.getDetailById(mainStore1.userInfo.orgUserId).then(response => {
                if(response.resultCode == "0000"){
                    this.orgUserInfo = response.data;
                    if(this.orgUserInfo.roleList){
                        let roleIds = [];
                        this.orgUserInfo.roleList.forEach(item =>{
                            roleIds.push(item.id);
                        })
                        this.orgUserInfo.roleIds = roleIds;
                    }
                    console.log(response)
                }else{
                    ElMessage.error('获取用户信息失败。')
                }
            }).catch(error => {
                console.log('page===========', error),
                    ElMessage.error('获取用户信息失败。')
            })
        },

        getUserInfo(){

            console.log("111111111112asd");

            let mainStore1 = mainStore();
            console.log(mainStore1.userInfo.id);
            userAccountApi.getDetailById(mainStore1.userInfo.id).then(response => {
                if(response.resultCode == "0000"){
                    this.user = response.data;
                    console.log(response)
                }else{
                    ElMessage.error('获取用户信息失败。')
                }
            }).catch(error => {
                console.log('page===========', error),
                ElMessage.error('获取用户信息失败。')
            })
        },

        getUserList(){
            let mainStore1 = mainStore();
            console.log(mainStore1.userInfo.id);
            userApi.getPageList({
                'page': this.page.currentPage,
                'size': this.page.pageSize ? this.page.pageSize : 10,
                'condition':{
                    userId:mainStore1.userInfo.id
                }
            }).then(response => {
                if(response.resultCode == "0000"){
                    this.userTableData = response.data;
                    console.log(response)
                }else{
                    ElMessage.error('获取用户信息失败。')
                }
            }).catch(error => {
                console.log('page===========', error),
                    ElMessage.error('获取用户信息失败。')
            })
        },

        handleSizeChange(val){

            this.page.pageSize = val;
            this.getUserList();
        },
        handleCurrentChange(val){
            this.page.currentPage = val;
            this.getUserList();
        },

        editUserClick(row){

        },
        deleteUserClick(row){

        },

        updatePasswordClick(){
            this.editPasswordDialogVisible = true;
        },

        editPasswordDialogClose(){

        },

        updatePassword(){
            if(this.saveFlag){
                return;
            }else{
                let mainStore1 = mainStore();
                this.editPasswordForm.id = mainStore1.userInfo.id

                this.$refs["editPasswordForm"].validate((valid) => {
                    if (valid) {

                        //先对密码进行加密
                        let pwdForm ={
                                id:"",
                                oldPassword:"",
                                newPassword:"",
                                confirmPassword:""
                        };
                        Object.assign(pwdForm,this.editPasswordForm);

                        const encryptor = new JSEncrypt()
                        encryptor.setPublicKey(this.publicKey) // 设置公钥
                        pwdForm.oldPassword = encryptor.encrypt(this.editPasswordForm.oldPassword) // 对旧密码进行加密
                        pwdForm.newPassword = encryptor.encrypt(this.editPasswordForm.newPassword) // 对新密码进行加密
                        pwdForm.confirmPassword = encryptor.encrypt(this.editPasswordForm.confirmPassword) // 对确认密码进行加密

                        this.saveFlag = true;
                        userAccountApi.updatePassword(pwdForm).then(response => {
                            // debugger;
                            //适应两种分页格式
                            if(response.resultCode == "0000"){
                                this.saveFlag = false;
                                ElMessage({
                                    message: '修改成功。',
                                    type: 'success',
                                })
                                this.editPasswordDialogVisible = false;
                            }else{
                                ElMessage.error('修改失败。')
                            }
                            this.saveFlag = false;
                        }).catch(error => {
                            ElMessage.error('修改失败。')
                            console.log(error)
                            this.saveFlag = false;
                        })
                    }else{}
                })
            }
        },

        resetPwdConfirm(){
            this.resetPwdDialogVisible = false;
            if(this.saveFlag){
                return;
            }else{
                this.saveFlag = true;
                let mainStore1 = mainStore();
                userAccountApi.resetPassword(mainStore1.userInfo.id).then(response => {
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
        },

        unbindPhoneConfirm(){
            this.unbindPhoneDialogVisible = false;
            if(this.saveFlag){
                return;
            }else{
                this.saveFlag = true;
                let mainStore1 = mainStore();
                userAccountApi.unbindPhone(mainStore1.userInfo.id).then(response => {
                    if(response.resultCode == "0000"){
                        ElMessage.success('解绑成功。');

                        //重新获取用户信息
                    }else{
                        ElMessage.error('解绑失败。')
                    }
                    this.saveFlag = false;
                }).catch(error => {
                    console.log(error)
                    ElMessage.error('解绑失败。')
                    this.saveFlag = false;
                })
            }
        },

        bindPhoneClose(){

        },

        bindPhoneConfirm(){
            if(this.saveFlag){
                return;
            }else{
                let mainStore1 = mainStore();
                this.bindPhoneForm.id = mainStore1.userInfo.id

                this.$refs["bindPhoneForm"].validate((valid) => {
                    if (valid) {
                        this.saveFlag = true;
                        userAccountApi.bindPhone(this.bindPhoneForm).then(response => {
                            // debugger;
                            //适应两种分页格式
                            if(response.resultCode == "0000"){
                                this.saveFlag = false;
                                ElMessage({message: '绑定成功。', type: 'success',})
                            }else{
                                ElMessage.error('绑定失败。')
                            }
                            this.bindPhoneDialogVisible = false;
                            this.saveFlag = false;
                        }).catch(error => {
                            ElMessage.error('绑定失败。')
                            console.log(error)
                            this.bindPhoneDialogVisible = false;
                            this.saveFlag = false;
                        })
                    }else{}
                })
            }
        },

        bindEmailClose(){

        },

        bindEmailConfirm(){
            if(this.saveFlag){
                return;
            }else{
                let mainStore1 = mainStore();
                this.bindEmailForm.id = mainStore1.userInfo.id

                this.$refs["bindEmailForm"].validate((valid) => {
                    if (valid) {
                        this.saveFlag = true;
                        userAccountApi.bindEmail(this.bindPhoneForm).then(response => {
                            // debugger;
                            //适应两种分页格式
                            if(response.resultCode == "0000"){
                                this.saveFlag = false;
                                ElMessage({message: '绑定成功。', type: 'success',})
                            }else{
                                ElMessage.error('绑定失败。')
                            }
                            this.bindEmailDialogVisible = false;
                            this.saveFlag = false;
                        }).catch(error => {
                            ElMessage.error('绑定失败。')
                            console.log(error)
                            this.bindEmailDialogVisible = false;
                            this.saveFlag = false;
                        })
                    }else{}
                })
            }
        },

        unbindEmailConfirm(){
            this.unbindEmailDialogVisible = false;
            if(this.saveFlag){
                return;
            }else{
                this.saveFlag = true;
                let mainStore1 = mainStore();
                userAccountApi.unbindEmail(mainStore1.userInfo.id).then(response => {
                    if(response.resultCode == "0000"){
                        ElMessage.success('解绑成功。');
                        //重新获取用户信息
                    }else{
                        ElMessage.error('解绑失败。')
                    }
                    this.saveFlag = false;
                }).catch(error => {
                    console.log(error)
                    ElMessage.error('解绑失败。')
                    this.saveFlag = false;
                })
            }
        },
    }
}