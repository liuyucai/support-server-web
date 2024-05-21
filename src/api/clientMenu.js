import request from '@/utils/request'

export const save = (param) => {
    return request.post('/clientMenu/save', param)
};

/***
 * 获取全部菜单列表  返回PageResponseVO
 */
export const  getAllList = (param) =>{
    let requestData = param;
    if (param == null || param == "" || param == undefined){
        requestData = {}
    }
    return request.post('/clientMenu/getAllList',requestData);
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


