import request from '@/utils/request'

export const save = (param) => {
    return request.post('/role/save', param)
};


/***
 * 获取分页列表  返回PageResponseVO
 */
export const  getPageList = (param) =>{
    let requestData = param;
    if (param == null || param == "" || param == undefined){
        requestData = {}
    }
    return request.post('/role/getPageList',requestData);
}

/***
 * 获取全量列表  返回ResponseVO
 */
export const  getAllList = (param) =>{
    let requestData = param;
    if (param == null || param == "" || param == undefined){
        requestData = {}
    }
    return request.post('/role/getAllList',requestData);
}
