import request from '@/utils/request'

export const save = (param) => {
    return request.post('/userAccount/save', param)
};


/***
 * 获取列表  返回PageResponseVO
 */
export const  getPageList = (param) =>{
    let requestData = param;
    if (param == null || param == "" || param == undefined){
        requestData = {}
    }
    return request.post('/userAccount/getPageList',requestData);
}


/***
 * 获取详情  返回ResponseVO
 */
export const getDetailById = (id) => {
    return request.get('/userAccount/getDetailById/'+id)
};

/***
 * 修改密码  返回ResponseVO
 */
export const updatePassword = (param) => {
    return request.patch('/userAccount/updatePassword', param)
};

/**
 * 删除账号信息
 * @param param
 * @returns ResponseVO
 */
export const deleted = (id) => {
    return request.delete('/userAccount/delete?id='+id)
};

/**
 * 删除账号信息
 * @param param
 * @returns ResponseVO
 */
export const resetPassword = (id) => {
    return request.patch('/userAccount/resetPassword?id='+id)
};

/***
 * 绑定手机  返回ResponseVO
 */
export const bindPhone = (param) => {
    return request.patch('/userAccount/bindPhone', param)
};
/**
 * 解绑手机
 * @param param
 * @returns ResponseVO
 */
export const unbindPhone = (id) => {
    return request.patch('/userAccount/unbindPhone?id='+id)
};

/***
 * 绑定邮箱  返回ResponseVO
 */
export const bindEmail = (param) => {
    return request.patch('/userAccount/bindEmail', param)
};

/**
 * 解绑邮箱
 * @param param
 * @returns ResponseVO
 */
export const unbindEmail = (id) => {
    return request.patch('/userAccount/unbindEmail?id='+id)
};