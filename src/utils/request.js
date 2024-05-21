import axios from "axios"
import utils from '@/utils/common'

import { mainStore } from '@/store/index'



const service = axios.create({
    baseURL: process.env.VUE_APP_SERVER_URL,
    timeout: 30000,
})

// 添加请求拦截器
service.interceptors.request.use(

    function (config) {
        // config.headers.common["X-Requested-With"] = "XMLHttpRequest";
        // 在发送请求之前做些什么

        console.log("000000000000000000000000000000")
        let mainStore1 = mainStore();

        console.log(mainStore1.accessToken)

        if(mainStore1.accessToken){
            // config.headers.common['Authorization'] = 'bearer ' + mainStore1.accessToken;
            config.headers['access-token'] = mainStore1.accessToken;
        }

        config.headers['clientId'] = process.env.VUE_APP_CLIENT_ID;

        //处理post请求data对象空字段
        if (config.data && config.method === 'post') {
            let data = config.data
            //分页特殊处理
            if(data.page){
                let condition = utils.filterEmpty(data.condition)
                data.condition = condition
            }
        }


        return config
    },
    function (error) {
        // 对请求错误做些什么
        console.log(error)
        return Promise.reject(error)
    }
)

// 添加响应拦截器
service.interceptors.response.use(
    function (response) {
        console.log(response)
        // 2xx 范围内的状态码都会触发该函数。
        // 对响应数据做点什么
        // dataAxios 是 axios 返回数据中的 data
        const dataAxios = response.data
        // 这个状态码是和后端约定的
        const code = dataAxios.reset
        return dataAxios
    },
    function (error) {
        // 超出 2xx 范围的状态码都会触发该函数。
        // 对响应错误做点什么
        console.log(error)
        return Promise.reject(error)
    }
)
export default service