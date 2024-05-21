<template>
  <div id="app-container">
    <!--frontboard 初始化时，会回调函数，获取配置的值-->
    <frontboard
            :config="config"
            v-if="mainStore1.userInfo.id && this.$route.path != '/login'"
            @init="initFrontBoard()"
            @logout="logout"
            @userDropdownCommand="userDropdownCommand">
      <template v-slot:topRight>
        <el-select v-model="selectOrgUserId" placeholder="请选择用户" @change="userChange">
          <el-option
                  v-for="item in userList"
                  :key="item.id"
                  :label="item.nickName"
                  :value="item.id">
          </el-option>
        </el-select>
      </template>
    </frontboard>
    <router-view v-if="!mainStore1.userInfo.id"></router-view>
  </div>
</template>

<script>

  import { mainStore } from '@/store/index'
  import {clientMenuApi, clientApi, clientRouterApi, clientMenu1Api, loginApi,userApi} from "@/api";
  import utils from "@/utils/common";
  import {ElMessage} from "element-plus";

  export default {
    name: 'App',
    components: {
    },
    setup() {
       const mainStore1 = mainStore();
       return {
          mainStore1
       }
    },
    data() {
      return {

        orgUserId:"",
        selectOrgUserId:"",
        userList:[],
        config:{
          name:"基础平台",//系统名称
          logo:require("@/assets/images/logo.png"),//系统图片
          rootPath:"/",
          menu:[],
          // menu:[
          //   {
          //     name:"客户端管理",
          //     id:6,
          //     children:[
          //       {
          //         name:"服务管理",
          //         id:9,
          //         path:"/service",
          //       }, {
          //         name:"客户端管理",
          //         id:7,
          //         path:"/client",
          //       },{
          //         name:"客户端组管理",
          //         id:8,
          //         isParent:false,
          //         path:"/clientGroup",
          //       },{
          //         name:"客户端资源管理",
          //         id:10,
          //         path:"/clientResource",
          //       }
          //     ]
          //   },{
          //     name:"权限管理",
          //     id:1,
          //     children:[
          //       {
          //         name:"账号管理",
          //         id:21,
          //         path:"/account",
          //       }, {
          //         name:"用户管理",
          //         id:4,
          //         path:"/user",
          //       },{
          //         name:"机构管理",
          //         id:2,
          //         path:"/org"
          //       },
          //       {
          //         name:"角色管理",
          //         id:3,
          //         path:"/role",
          //       }
          //     ]
          //   },
          //   {
          //     name:"系统设置",
          //     id:5,
          //     children:[
          //       {
          //         menuName:"菜单管理",
          //         id:14,
          //         path:"/menu",
          //       }
          //     ]
          //   },
          // ],
          routers:[],
          homePage:{
            name:"首页",//名称
            router:"/home", //首页路由
            defaultOpen:true,  //首页tab是否默认打开,默认false
            closableIfOnly:false,  //如果只有首页tab打开时，首页tab是否可关闭,默认：false
            cleanAllTabDefaultOpen:true,   //当关闭所有tab后是否默认打开首页tab,默认false，如果closableIfOnly为true时，不生效
          },
          user:{
            userId:"",
            userName:"刘宇才",
            icon:"",
            dropdown:[
              {
                name:"首页",
                value:"home"
              },{
                name:"个人中心",
                value:"personCenter"
              }
            ]
          },
          options:{
            // topNav:false
            themeColor:'#A040FF',
          },
          //permission
          auth:{
            enabled:true,
            routers:[]
          }
          //路由信息放在frontboard里面，并在里面进行判断

          //获取客户端信息

          //获取
        }
      }
    },

    // watch: {
    //   this.path = this.$route.path
    // },

    methods:{
      initFrontBoard(){
        console.log("00000011101000")

        let mainStore1 = mainStore();
        this.orgUserId = mainStore1.userInfo.orgUserId;
        this.selectOrgUserId = mainStore1.userInfo.orgUserId;

        //获取菜单
        this.getMenu();

        //获取客户端信息
        this.getClientInfo();

        //获取路由功能信息
        this.getRoutersInfo();

        //获取登录用户信息

        //获取用户列表
        this.getUserList();
      },

      getMenu(){
        // clientMenuApi.getMenu
        clientMenu1Api.getByClientSecret(
                {
                  clientSecret:`${process.env.VUE_APP_CLIENT_ID}`,
                  menuType:"DIR,MENU",
                  sort: [
                    {
                      "direction": "sort",
                      "property": "DESC"
                    }
                  ]
                }
        ).then(response => {
          if(response.resultCode == "0000"){
            var menuTableData = utils.transformLeftMenuTreeData(response.data, "0",);

            this.config.menu = menuTableData;
            console.log(this.config.menu);
          }else{
            ElMessage.error('加载失败。')
            this.config.menu = []
          }
        }).catch(error => {
          console.log('page===========', error)
          this.config.menu = []
        })
      },

      getClientInfo(){
        clientApi.getByClientSecret(`${process.env.VUE_APP_CLIENT_ID}`).then(response => {
          if(response.resultCode == "0000"){
            this.config.name = response.data.name;
            this.config.img = `${process.env.VUE_APP_FILE_SERVER}`+`${process.env.VUE_APP_FILE_ENDPOINT}`+'/'+response.data.icon;
          }else{

          }
        }).catch(error => {

        })
      },

      //判断路由是否鉴权，是：判断是否拥有该路由的权限
      getRoutersInfo(){

        let mainStore1 = mainStore();
        console.log("*************************8222222222222222222*****************");
        console.log(mainStore1.routers);
        this.config.auth.routers = mainStore1.routers;
      },

      userDropdownCommand(command){
        //路由跳转
        this.$router.push({
          path:'/personCenter'
        })
      },

      logout(){
        console.log("退出登录");
        loginApi.logout().then(response => {
          if(response.resultCode == "0000"){
            ElMessage.success('退出登录成功。');
            localStorage.removeItem("access-token");

            //
            // this.$router.push({
            //   path:'/login'
            // })
            //清除store里面的数据，刷新页面
            location.reload();
          }else{
            ElMessage.error('退出登录失败。');
          }
        }).catch(error => {
          ElMessage.error('退出登录失败。');
        })
      },

      getUserList(){

        //获取该账号拥有该客户端权限的用户， 账号id,客户端id,用户类型
        // clientMenuApi.getMenu
        let mainStore1 = mainStore();
        userApi.getClientAuthUserList({
          type:1,
          userId:mainStore1.userInfo.id,
          clientId:process.env.VUE_APP_CLIENT_ID
        }).then(response => {
          if(response.resultCode == "0000"){
            this.userList = response.data;
          }else{
            console.log(response);
            this.userList = [];
          }
        }).catch(error => {
          console.log(error)
        })
      },

      userChange(val){
        console.log(val);

        //个人中心，因为菜单隐藏，菜单信息没有传到frontboard,所以tab显示不了名称

        loginApi.changeUser({
          userId:val
        }).then(response => {
          if(response.resultCode == "0000"){
            ElMessage.success('切换用户成功。');
            location.reload();
          }else{
            ElMessage.error('切换用户失败。');
            this.selectOrgUserId = this.orgUserId;
          }
        }).catch(error => {
          ElMessage.error('切换用户失败。');
          this.selectOrgUserId = this.orgUserId;
        })
      }
    }
  }
</script>

<style>
  html{
      height: 100%;
  }
  body{
    padding: 0;
    margin: 0;
      height: 100%;
  }
  #app{
      height: 100%;
  }
  #app-container{
      height: 100%;
  }

  .main-container>.el-scrollbar__wrap>.el-scrollbar__view{
    height: 100%;
    box-sizing: border-box;
  }

  ::-webkit-scrollbar {/*滚动条整体样式*/
    /*width: 8px; !*高宽分别对应横竖滚动条的尺寸*!*/
    /*border-radius: 5px;*/
    width: 12px;
    height: 0px
  }

  ::-webkit-scrollbar-thumb {/*滚动条里面小方块*/

    border: 4px solid transparent;
    background-clip: padding-box;
    border-radius: 7px;
    background-color: #c2c2c2;

  }

  ::-webkit-scrollbar-track {/*滚动条里面轨道*/
    /*-webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);*/
    /*background: #acffef;*/
  }
</style>
