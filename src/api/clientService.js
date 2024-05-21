import request from '@/utils/request'

export const save = (param) => {
    return request.post('/clientService/save', param)
};

/***
 * 获取设备列表  返回PageResponseVO
 */
export const  getPageList = (param) =>{
    let requestData = param;
    if (param == null || param == "" || param == undefined){
        requestData = {}
    }
    return request.post('/clientService/getPageList',requestData);
}

export const deleted = (id) => {
    return request.delete('/clientService/delete/'+id)
};

