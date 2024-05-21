import request from '@/utils/request'

export const saveRouter = (param) => {
    return request.post('/clientRouter/saveRouter', param)
};

export const saveFunction = (param) => {
    return request.post('/clientRouter/saveFunction', param)
};


/***
 * 获取路由列表  返回PageResponseVO
 */
export const  getPageList = (param) =>{
    let requestData = param;
    if (param == null || param == "" || param == undefined){
        requestData = {}
    }
    return request.post('/clientRouter/getPageList',requestData);
}

/***
 * 获取功能列表
 */
export const  getFunctionList = (param) =>{
    let requestData = param;
    if (param == null || param == "" || param == undefined){
        requestData = {}
    }
    return request.post('/clientRouter/getFunctionList',requestData);
}

/**
 * 删除路由信息
 */
export const deleteRouter = (id) => {
    return request.delete('/clientRouter/deleteRouter/'+id)
};

/**
 * 删除功能信息
 */
export const deleteFuction = (id) => {
    return request.delete('/clientRouter/deleteFunction/'+id)
};


/***
 * 全量获取列表  返回ResponseVO
 */
export const  getByClientSecret = (param) =>{

    let requestData = param;
    if (param == null || param == "" || param == undefined){
        requestData = {}
    }
    return request.post('/clientRouter/getByClientSecret',requestData);
}

