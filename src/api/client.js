import request from '@/utils/request'

export const save = (param) => {
    return request.post('/client/save', param)
};

/***
 * 获取客户端列表  返回PageResponseVO
 */
export const  getPageList = (param) =>{
    let requestData = param;
    if (param == null || param == "" || param == undefined){
        requestData = {}
    }
    return request.post('/client/getPageList',requestData);
}

/***
 * 全量获取列表  返回ResponseVO
 */
export const  getAllList = (param) =>{
    let requestData = param;
    if (param == null || param == "" || param == undefined){
        requestData = {}
    }
    return request.post('/client/getAllList',requestData);
}

/***
 * 全量获取列表  返回ResponseVO
 */
export const  getByClientSecret = (clientSecret) =>{
    return request.get('/client/getByClientSecret?clientSecret='+clientSecret);
}
