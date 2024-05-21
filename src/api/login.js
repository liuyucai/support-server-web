import request from '@/utils/request'

/**
 * 获取验证码
 * @param param
 * @returns ResponseVO
 */
export const getCaptcha = (param) => {
    return request({
        method:"get",
        baseURL:process.env.VUE_APP_AUTH_SERVER_URL,
        url:"/captcha/getCode",
        params: param
    })
};

/**
 * 账号密码登录
 * @param param
 * @returns ResponseVO
 */
export const accountLogin = (param) => {
    return request({
        method:"post",
        baseURL:process.env.VUE_APP_AUTH_SERVER_URL,
        url:"/login/accountLogin",
        // header:{
        //     Authorization:`bearer ${token}`
        // },
        data: param
    })
};


/**
 * 获取验证码
 * @param param
 * @returns ResponseVO
 */
export const getUserInfo = () => {
    return request({
        method:"get",
        baseURL:process.env.VUE_APP_ACCOUNT_SERVER_URL,
        url:"/userAccount/getUserInfo",
    })
};

/**
 * 账号密码登录
 * @param param
 * @returns ResponseVO
 */
export const logout = (param) => {

    let accessToken = localStorage.getItem("accessToken");
    return request({
        method:"get",
        baseURL:process.env.VUE_APP_AUTH_SERVER_URL,
        url:"/login/logout",
        header:{
            accessToken:accessToken
        },
    })
};

/**
 * 切换用户  clientId,userId
 * @param param
 * @returns ResponseVO
 */
export const changeUser = (param) => {
    let accessToken = localStorage.getItem("accessToken");
    let clientId = process.env.VUE_APP_CLIENT_ID;
    return request({
        method:"get",
        baseURL:process.env.VUE_APP_AUTH_SERVER_URL,
        url:"/login/changeUser",
        header:{
            accessToken:accessToken,
            clientId:clientId
        },
        params: param
    })
};


