import request from '@/utils/request'

export const save = (param) => {
    return request.post('/service/save', param)
};

/***
 * 获取api列表  返回PageResponseVO
 */
export const  getPageList = (param) =>{
    let requestData = param;
    if (param == null || param == "" || param == undefined){
        requestData = {}
    }
    return request.post('/service/getPageList',requestData);
}

/***
 * 获取所有列表  返回ResponseVO
 */
export const  getAllList = (param) =>{
    let requestData = param;
    if (param == null || param == "" || param == undefined){
        requestData = {}
    }
    return request.post('/service/getAllList',requestData);
}

/***
 * 获取api列表  返回PageResponseVO
 */
export const  getApiPageList = (param) =>{
    let requestData = param;
    if (param == null || param == "" || param == undefined){
        requestData = {}
    }
    return request.post('/serviceApi/getPageList',requestData);
}

export const saveApi = (param) => {
    return request.post('/serviceApi/save', param)
};

/**
 * 删除api信息
 */
export const deleteApi = (id) => {
    return request.delete('/serviceApi/delete/'+id)
};

/***
 * 分页查询服务的授权资源信息 返回PageResponseVO
 */
export const  getServiceAuthPageList = (param) =>{
    let requestData = param;
    if (param == null || param == "" || param == undefined){
        requestData = {}
    }
    return request.post('/service/getServiceAuthPageList',requestData);
}

/***
 * 授予服务资源权限  返回ResponseVO
 */
export const  saveServiceAuth = (param) =>{
    let requestData = param;
    if (param == null || param == "" || param == undefined){
        requestData = {}
    }
    return request.post('/service/saveServiceAuth',requestData);
}

/**
 * 删除服务资源权限
 * @param param
 * @returns ResponseVO
 */
export const deleteServiceAuth = (id) => {
    return request.delete('/service/deleteServiceAuth?id='+id)
};
