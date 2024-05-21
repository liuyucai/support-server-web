import request from "@/utils/request";

/***
 * 获取日志列表  返回PageResponseVO
 */
export const  getPageList = (param) =>{
    let requestData = param;
    if (param == null || param == "" || param == undefined){
        requestData = {}
    }
    return request.post('/logLogin/getPageList',requestData);
}