<template>
    <div class="login-page">
        <div class="login-container">
            <div class="login-container-main">
                <div class="login-title">基础平台</div>
                <div class="login-main">
                    <el-tabs v-model="activeTabName" class="demo-tabs" @tab-change="tabChange">
                        <el-tab-pane label="用户名登录" name="account">
                            <div class="account-container login-nav">
                                <el-form :model="accountLoginForm" size="large" ref="accountLoginForm" :rules="accountRules">
                                    <el-form-item prop="userName">
                                        <el-input v-model="accountLoginForm.userName" placeholder="请输入用户名" :prefix-icon="User"/>
                                    </el-form-item>
                                    <el-form-item prop="password">
                                        <el-input v-model="accountLoginForm.password" placeholder="请输入密码" :prefix-icon="Lock" class="password-ipt">
                                            <template #append>
                                                <el-icon style="cursor: pointer"><View /></el-icon>
                                            </template>
                                        </el-input>
                                    </el-form-item>

                                    <el-form-item prop="captcha">
                                        <div>
                                            <el-input v-model="accountLoginForm.code" placeholder="请输入验证码" :prefix-icon="Key"/>
                                        </div>
                                        <div class="login-code" @click="refreshCaptcha" v-loading="captchaLoading">
                                            <img :src="captcha" class="login-code-img" @click="refreshCaptcha">
                                        </div>
                                    </el-form-item>
                                    <el-form-item>
                                        <el-button type="primary" @click="accountSubmit" class="submit-btn">登录</el-button>
                                    </el-form-item>

                                </el-form>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane label="手机号登录" name="phone">

                        </el-tab-pane>
                        <el-tab-pane label="社交登录" name="other">

                        </el-tab-pane>
                        <el-tab-pane label="注册账号" name="register">

                        </el-tab-pane>
                    </el-tabs>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { User,Lock,View,Key} from '@element-plus/icons-vue'
    import {clientMenuApi, clientServiceApi, loginApi} from '@/api';
    import utils from "@/utils/common";
    import {ElMessage} from "element-plus";

    import JSEncrypt from 'jsencrypt/bin/jsencrypt'
    import { mainStore } from '@/store/index'


    export default {
        name: "login",

        setup() {
            const mainStore1 = mainStore();
            return {
                User,
                Lock,
                View,
                Key,
                mainStore1
            }
        },
        data() {
            return {
                activeTabName:"account",

                accountLoginForm:{
                    userName:"",
                    password:"",
                    code:"",
                    uuid:""
                },
                captcha:"",

                captchaLoading:false,

                accountRules:{
                    userName: [
                        { required: true, message: '请输入账号', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ],
                    code: [
                        { required: true, message: '请输入验证码', trigger: 'blur' }
                    ],
                },

                saveFlag:false,

                publicKey:`${process.env.VUE_APP_PUBLIC_KEY}`,

                clientSecret:`${process.env.VUE_APP_CLIENT_ID}`,
            }
        },

        mounted() {

            //清掉sessionStorage
            sessionStorage.clear();
            this.getCaptcha();
        },

        methods:{
            tabChange(){

            },

            getCaptcha(){
                if(this.captchaLoading){
                    return;
                }
                this.captchaLoading = true;
                this.captcha = "";
                loginApi.getCaptcha({
                    captchaType:"MATH",
                    width:130,
                    height:40
                }).then(response => {
                    this.captchaLoading = false;
                    if(response.resultCode == "0000"){
                        this.captcha = "data:image/png;base64,"+response.data.base64;
                        this.accountLoginForm.uuid = response.data.uuid;
                    }else{
                        ElMessage.error('获取验证码失败。');
                    }
                }).catch(error => {
                    ElMessage.error('获取验证码失败。');
                    this.captchaLoading = false;
                })
            },

            refreshCaptcha(){
                this.getCaptcha();
            },

            accountSubmit(){

                if(this.saveFlag){
                    return;
                }else{
                    this.$refs["accountLoginForm"].validate((valid) => {
                        if (valid) {
                            this.saveFlag = true;

                            let loginForm ={
                                userName:"",
                                password:"",
                                code:"",
                                uuid:"",
                                clientSecret:""
                            }
                            Object.assign(loginForm,this.accountLoginForm);
                            loginForm.clientSecret = this.clientSecret;

                            const encryptor = new JSEncrypt()
                            encryptor.setPublicKey(this.publicKey) // 设置公钥
                            loginForm.password = encryptor.encrypt(this.accountLoginForm.password) // 对需要加密的数据进行加密

                            loginApi.accountLogin(loginForm).then(response => {
                                //适应两种分页格式
                                if(response.resultCode == "0000"){
                                    this.saveFlag = false;
                                    ElMessage({
                                        message: '登录成功。',
                                        type: 'success',
                                    })
                                    this.mainStore1.accessToken = response.data.accessToken;
                                    localStorage.setItem("accessToken",response.data.accessToken);

                                    //路由跳转
                                    this.$router.push({
                                        path:'/'
                                    })
                                }else{
                                    ElMessage.error(response.resultDesc);
                                    this.getCaptcha();
                                }
                                this.saveFlag = false;
                            }).catch(error => {
                                ElMessage.error('登录失败。')
                                console.log(error)
                                this.saveFlag = false;
                                this.getCaptcha();
                            })
                        }
                    })
                }

            }
        }
    }
</script>

<style scoped lang="scss">

    ::v-deep .el-input-group__append{
        position: absolute;
        background: #fff;
        right: 0;
        box-shadow: none;
        top: 50%;
        right: 10px;
        min-height: 0;
        padding: 0;
        transform: translate(-50%,-50%) translate3d(0,0,0);
    }
    .submit-btn{
        width: 100%;
    }
    ::v-deep .password-ipt .el-input__wrapper{
        padding-right: 40px;
    }

    ::v-deep .el-input-group--append>.el-input__wrapper{
        border-radius: 4px;
    }

    .login-page{
        width: 100%;
        height: 100%;
        background: url("../../assets/images/login_bg.png");
        background-size: 100% 100%;

        .login-container{
            width: 420px;
            padding: 20px;
            position: absolute;
            top: 50%;
            left: 80%;
            transform: translate(-50%,-50%) translate3d(0,0,0);
            background-color: rgb(255,255,255,99);
            border-radius: 10px;
            overflow-y: hidden;

            .login-container-main{
                .login-title{
                    text-align: center;
                    font-size: 25px;
                    padding-bottom: 10px;
                }
                .login-nav{
                    padding-top: 10px;
                }

                .login-code{
                    width: 150px;
                    height: 40px;
                    padding-left: 20px;
                }
                .login-code-img{
                    cursor: pointer;
                    width: 130px;
                    height: 100%;
                }
            }
        }
    }
</style>