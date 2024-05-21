import request from '@/utils/request'


export const save = (param) => {
    return request.post('/clientMenu1/save', param)
};

/***
 * 获取全部菜单列表  返回PageResponseVO
 */
export const  getAllList = (param) =>{
    let requestData = param;
    if (param == null || param == "" || param == undefined){
        requestData = {}
    }
    return request.post('/clientMenu1/getAllList',requestData);
}

export const deleted = (id) => {
    return request.delete('/clientMenu/delete/'+id)
};

/***
 * 获取菜单列表  返回PageResponseVO
 */
export const  getMenu = (param) =>{
    let requestData = param;
    if (param == null || param == "" || param == undefined){
        requestData = {}
    }
    return request.post('/clientMenu/getMenu',requestData);
}

/***
 * 全量获取列表  返回ResponseVO
 */
export const  getByClientSecret = (param) =>{

    let requestData = param;
    if (param == null || param == "" || param == undefined){
        requestData = {}
    }
    return request.post('/clientMenu1/getByClientSecret',requestData);
}


/***
 * 获取菜单Api列表  返回PageResponseVO
 */
export const  getMenuApiList = (param) =>{
    let requestData = param;
    if (param == null || param == "" || param == undefined){
        requestData = {}
    }
    return request.post('/menuApi/getPageList',requestData);
}

/***
 * 获取Api列表  返回PageResponseVO
 */
export const  getApiList = (param) =>{
    let requestData = param;
    if (param == null || param == "" || param == undefined){
        requestData = {}
    }
    return request.post('/menuApi/getAllPageList',requestData);
}

/***
 * 授予功能权限  返回ResponseVO
 */
export const  openApiAuth = (param) =>{
    let requestData = param;
    if (param == null || param == "" || param == undefined){
        requestData = {}
    }
    return request.post('/menuApi/openApiAuth',requestData);
}

/**
 * 关闭功能权限
 * @param param
 * @returns ResponseVO
 */
export const closeApiAuth = (id) => {
    return request.delete('/menuApi/closeApiAuth?id='+id)
};
