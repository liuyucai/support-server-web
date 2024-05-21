import request from '@/utils/request'

export const save = (param) => {
    return request.post('/user/save', param)
};


/***
 * 获取列表  返回PageResponseVO
 */
export const  getPageList = (param) =>{
    let requestData = param;
    if (param == null || param == "" || param == undefined){
        requestData = {}
    }
    return request.post('/user/getPageList',requestData);
}

/***
 * 全量获取列表  返回PageResponseVO
 */
export const  getAllList = (param) =>{
    let requestData = param;
    if (param == null || param == "" || param == undefined){
        requestData = {}
    }
    return request.post('/user/getAllList',requestData);
}

/***
 * 获取详情  返回ResponseVO
 */
export const getDetailById = (id) => {
    return request.get('/user/getDetailById/'+id)
};

/***
 * 获取列表  返回PageResponseVO
 */
export const  getRoleSettingPageList = (param) =>{
    let requestData = param;
    if (param == null || param == "" || param == undefined){
        requestData = {}
    }
    return request.post('/user/getRoleSettingPageList',requestData);
}


/***
 * 获取登录用户信息详情
 */
export const getLoginUserDetail = () => {
    return request.get('/user/getLoginUserDetail')
};

/**
 * 删除用户信息
 * @param param
 * @returns ResponseVO
 */
export const deleted = (id) => {
    return request.delete('/user/delete/'+id)
};

/***
 * 更新用户类型
 */
export const  updateUserType = (param) =>{
    let requestData = param;
    if (param == null || param == "" || param == undefined){
        requestData = {}
    }
    return request.patch('/user/updateUserType',requestData);
}

/***
 * 全量获取列表  返回PageResponseVO
 */
export const  getClientAuthUserList = (param) =>{
    let requestData = param;
    if (param == null || param == "" || param == undefined){
        requestData = {}
    }
    return request.post('/user/getClientAuthUserList',requestData);
}
