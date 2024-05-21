import request from '@/utils/request'

/**
 * 关闭默认权限
 * @param param
 * @returns ResponseVO
 */
export const closeDefaultRole = (param) => {
    return request.post('/roleUser/closeDefaultRole', param)
};

/**
 * 打开默认权限
 * @param param
 * @returns ResponseVO
 */
export const openDefaultRole = (disabledId) => {
    return request.delete('/roleUser/openDefaultRole?disabledId='+disabledId)
};

/**
 * 删除权限
 * @param param
 * @returns ResponseVO
 */
export const deleted = (id) => {
    return request.delete('/roleUser/delete?id='+id)
};


