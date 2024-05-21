import { createRouter, createWebHistory } from 'vue-router'

import { mainStore } from '@/store/index'

import {clientRouterApi, loginApi,clientMenu1Api} from '@/api';
import {ElMessage} from "element-plus";

//路由数组
const routes = [

    {
        //基本格式
        path: "/home",
        name: "home",
        component: () =>
            import('@/views/home/index')
    },
    {
        //基本格式
        path: "/org",
        name: "org",
        component: () =>
            import('@/views/org/index')
        // children: []

    },{
        //基本格式
        path: "/client",
        name: "client",
        component: () =>
            import('@/views/client/index')
    },{
        //基本格式
        path: "/clientGroup",
        name: "clientGroup",
        component: () =>
            import('@/views/clientGroup/index')
    },{
        //基本格式
        path: "/service",
        name: "service",
        component: () =>
            import('@/views/service/index')
    },{
        //基本格式
        path: "/clientResource",
        name: "clientResource",
        component: () =>
            import('@/views/clientResource/index1')
    },{
        //基本格式
        path: "/role",
        name: "role",
        component: () =>
            import('@/views/role/index')
    },{
        //基本格式
        path: "/user",
        name: "user",
        component: () =>
            import('@/views/user/index')
    },{
        //基本格式
        path: "/account",
        name: "account",
        component: () =>
            import('@/views/account/index')
    },{
        //基本格式
        path: "/authority",
        name: "authority",
        meta: {
            title: "角色授权"
        },
        component: () =>
            import('@/views/authority/index1')
    },{
        //基本格式
        path: "/login",
        name: "login",
        component: () =>
            import('@/views/login/index')
    },{
        //基本格式
        path: "/log",
        name: "log",
        children: [
            {
                path: 'loginLog',
                name: 'loginLog',
                meta: {
                    title: "登录日志"
                },
                component: () => import('@/views/log/loginLog'),
            }
        ]
    },{
        //基本格式
        path: "/personCenter",
        name: "personCenter",
        meta: {
            title: "个人中心"
        },
        component: () =>
            import('@/views/personCenter/index')
    },{
        //基本格式
        path: "/dict",
        name: "dict",
        component: () =>
            import('@/views/dict/index')
    }

]

//路由对象
const router = createRouter({
    mode: 'history',
    history: createWebHistory(),
    routes
})

router.beforeEach(async (to, from) => {

    console.log(to);
    console.log(from);
    let mainStore1 = mainStore();

    if(localStorage.getItem("accessToken")){
        //先从store中获取用户信息，有:token正常，没有：异常
        mainStore1.accessToken = localStorage.getItem("accessToken");

        if(mainStore1.userInfo.id){
            //如果有用户信息，访问登录页面会直接跳到首页
            if(to.name == 'login'){
                return { name: 'home' }
            }
        }else{
            //获取用户信息
            await loginApi.getUserInfo().then(response => {
                if(response.resultCode == "0000"){
                    mainStore1.userInfo = response.data;
                    console.log("************获取用户信息成功********************8")
                }else if(response.resultCode == "6002"){
                    ElMessage.error('会话失效。');
                    localStorage.removeItem("accessToken");
                }else{
                    //会话已失效
                    console.log(response);
                    ElMessage.error('获取用户信息失败。');
                    // localStorage.removeItem("accessToken");
                }
            }).catch(error => {
                ElMessage.error('获取用户信息失败。');
                localStorage.removeItem("accessToken");
            })

            if(!mainStore1.userInfo.id){
                //先判断是否有ACCESS_TOKEN
                return { name: 'login' }
            }
            console.log("************往下执行********************")
        }

        //路由认证
        if(!mainStore1.routers){

            // 获取路由信息权限信息
            //判断是否有路由的权限，有：跳转，没有：跳转到无权限页面
            await clientMenu1Api.getByClientSecret({
                clientSecret: `${process.env.VUE_APP_CLIENT_ID}`,
                menuType:"MENU,ROUTER,FUNCTION"
            }).then(response => {
                if (response.resultCode == "0000") {
                    console.log("************获取菜单信息成功********************")
                    //获取路由信息
                    let routers = [];
                    response.data.forEach(item => {
                        if (item.menuType == "MENU" || item.menuType == "ROUTER") {
                            item.permissions = [];
                            routers.push(item);
                        }
                    })
                    routers.forEach(router => {
                        response.data.forEach(item => {
                            if (item.menuType == "FUNCTION" && item.pid == router.id) {
                                router.permissions.push(item.permission);
                            }
                        })
                    })
                    // let mainStore2 = mainStore();
                    mainStore1.routers = routers;
                } else {
                    console.log("获取路由权限信息失败");
                    mainStore1.routers = [];
                }
            }).catch(error => {
                console.log(error);
                mainStore1.routers = [];
            })
        }

        //判断是否获取用户信息成功  -- 一般用户信息都会成功，不然会返回到其他页面           //上面返回到错误页面，应该不用拦截
        let routers = mainStore1.routers;

        console.log("...............................")
        console.log(routers)

        if(to.path == "" || to.path == "/"){
            return { path: '/home' }
        }else{
            let flag = false;
            for(let i =0;i<routers.length;i++){
                if(routers[i].path == to.path){
                    if(routers[i].permission == "1"){
                        if(routers[i].roleResourceId){
                            flag = true;
                        }
                    }else{
                        flag = true;
                    }
                    break;
                }
            }
            if(flag){
                // console.log("*************路由认证成功**************");
            }else{
                // console.log("*************路由认证失败**************");
                //跳转到路由错误页面
                to.meta.error = "403";
            }
        }

        console.log(mainStore1.accessToken);
    }else{
        mainStore1.userInfo = {};
        mainStore1.accessToken = "";
        if(to.name !== 'login'){
            return { name: 'login' }
        }
    }
})

//导出路由对象，在main.js中引用
export default router