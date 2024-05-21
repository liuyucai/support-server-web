import request from '@/utils/request'

export const save = (param) => {
    return request.post('/org/save', param)
};


/***
 * 全量获取列表  返回ResponseVO
 */
export const  getAllList = (param) =>{
    let requestData = param;
    if (param == null || param == "" || param == undefined){
        requestData = {}
    }
    return request.post('/org/getAllList',requestData);
}

