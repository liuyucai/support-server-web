import request from '@/utils/request'


/***
 * 分页获取字典组列表  返回PageResponseVO
 */
export const  getPageList = (param) =>{
    let requestData = param;
    if (param == null || param == "" || param == undefined){
        requestData = {}
    }
    return request.post('/dict/getPageList',requestData);
}
/**
 * 保存字典组信息
 * @param param
 * @returns
 */
export const saveDictGroup = (param) => {
    return request.post('/dict/saveDictGroup', param)
};

/**
 *删除字典组
 * @param id
 * @returns
 */
export const deleteDictGroup = (id) => {
    return request.delete('/dict/deleteDictGroup/'+id)
};

/***
 * 字典项分页查询  返回PageResponseVO
 */
export const  getDictItemPageList = (param) =>{
    let requestData = param;
    if (param == null || param == "" || param == undefined){
        requestData = {}
    }
    return request.post('/dict/getDictItemPageList',requestData);
};

/**
 * 保存字典项信息
 * @param param
 * @returns
 */
export const saveDictItem = (param) => {
    return request.post('/dict/saveDictItem', param)
};

/**
 *删除字典项
 * @param id
 * @returns
 */
export const deleteDictItem = (id) => {
    return request.delete('/dict/deleteDictItem/'+id)
};