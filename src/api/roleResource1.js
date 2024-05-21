import request from "@/utils/request";

/***
 * 获取客户端列表  返回ResponseVO
 */
export const  getClientList = (param) =>{
    let requestData = param;
    if (param == null || param == "" || param == undefined){
        requestData = {}
    }
    return request.post('/roleResource1/getClientList',requestData);
}

/***
 * 获取菜单列表  返回ResponseVO
 */
export const  getMenuList = (param) =>{
    let requestData = param;
    if (param == null || param == "" || param == undefined){
        requestData = {}
    }
    return request.post('/roleResource1/getMenuList',requestData);
}

/***
 * 获取路由列表  返回ResponseVO
 */
export const  getRouterList = (param) =>{
    let requestData = param;
    if (param == null || param == "" || param == undefined){
        requestData = {}
    }
    return request.post('/roleResource1/getRouterList',requestData);
}

/***
 * 获取功能列表  返回ResponseVO
 */
export const  getFunctionList = (param) =>{
    let requestData = param;
    if (param == null || param == "" || param == undefined){
        requestData = {}
    }
    return request.post('/roleResource1/getFunctionList',requestData);
}

/***
 * 授予客户端权限  返回ResponseVO
 */
export const  openClientAuth = (param) =>{
    let requestData = param;
    if (param == null || param == "" || param == undefined){
        requestData = {}
    }
    return request.post('/roleResource1/openClientAuth',requestData);
}

/**
 * 关闭客户端权限
 * @param param
 * @returns ResponseVO
 */
export const closeClientAuth = (id) => {
    return request.delete('/roleResource1/closeClientAuth?id='+id)
};

/***
 * 授予菜单权限  返回ResponseVO
 */
export const  openMenuAuth = (param) =>{
    let requestData = param;
    if (param == null || param == "" || param == undefined){
        requestData = {}
    }
    return request.post('/roleResource1/openMenuAuth',requestData);
}

/**
 * 关闭菜单权限
 * @param param
 * @returns ResponseVO
 */
export const closeMenuAuth = (id) => {
    return request.delete('/roleResource1/closeMenuAuth?id='+id)
};

/***
 * 授予路由权限  返回ResponseVO
 */
export const  openRouterAuth = (param) =>{
    let requestData = param;
    if (param == null || param == "" || param == undefined){
        requestData = {}
    }
    return request.post('/roleResource1/openRouterAuth',requestData);
}

/**
 * 关闭路由权限
 * @param param
 * @returns ResponseVO
 */
export const closeRouterAuth = (id) => {
    return request.delete('/roleResource1/closeRouterAuth?id='+id)
};

/***
 * 授予功能权限  返回ResponseVO
 */
export const  openFunctionAuth = (param) =>{
    let requestData = param;
    if (param == null || param == "" || param == undefined){
        requestData = {}
    }
    return request.post('/roleResource1/openFunctionAuth',requestData);
}

/**
 * 关闭功能权限
 * @param param
 * @returns ResponseVO
 */
export const closeFunctionAuth = (id) => {
    return request.delete('/roleResource1/closeFunctionAuth?id='+id)
};


/***
 * 保存菜单授权  返回ResponseVO
 */
export const  saveMenuAuth = (param) =>{
    let requestData = param;
    if (param == null || param == "" || param == undefined){
        requestData = {}
    }
    return request.post('/roleResource1/saveMenuAuth',requestData);
}