import request from '@/utils/request'

export const save = (param) => {
    return request.post('/clientGroup/save', param)
};

/***
 * 分页获取列表  返回PageResponseVO
 */
export const  getPageList = (param) =>{
    let requestData = param;
    if (param == null || param == "" || param == undefined){
        requestData = {}
    }
    return request.post('/clientGroup/getPageList',requestData);
}


/***
 * 全量获取列表  返回ResponseVO
 */
export const  getAllList = (param) =>{
    let requestData = param;
    if (param == null || param == "" || param == undefined){
        requestData = {}
    }
    return request.post('/clientGroup/getAllList',requestData);
}
