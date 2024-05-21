import { defineStore } from 'pinia'
import {serviceApi, clientApi, clientGroupApi,clientServiceApi,clientMenuApi,clientRouterApi} from '@/api';
import utils from "@/utils/common";
import {ElMessage} from "element-plus";

export const mainStore = defineStore('main', {

    //可以直接改变值
    state: () => {
        return {
            // 所有这些属性都将自动推断其类型
            counter: 0,
            accessToken:"",

            userInfo:{},
            orgUserId:"",
            menu:[],
            routers:null     //  []
        }
    },

    getters: {
        doubleCount: (state) => state.counter * 2,
    },

    //逻辑多的时候可以通过action改变state的值
    actions: {
        increment() {
            this.counter++
        },
        randomizeCounter() {
            this.counter = Math.round(100 * Math.random())
        },

        getMenu(){
            clientMenuApi.getAllList(
                {
                    clientSecret:`${process.env.VUE_APP_CLIENT_ID}`,
                    sort: [
                        {
                            "direction": "sort",
                            "property": "DESC"
                        }
                    ]
                }
            ).then(response => {
                if(response.resultCode == "0000"){

                    var menuTableData = utils.transformTreeData(response.data, "0",);

                    this.menu = menuTableData;
                    console.log(this.menu);
                }else{
                    ElMessage.error('加载失败。')
                    this.menu = []
                }
                this.loading = false;
            }).catch(error => {
                console.log('page===========', error)
                this.menu = []
            })
        }
    },
})