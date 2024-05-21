class commonUtils {

    /**
     * 过滤对象空属性
     *
     * @param {*} variable
     * @return {*}
     * @memberof commonUtils
     */
    filterEmpty(obj) {
        let filterObj = {}
        for (let item in obj) {
            if (obj[item]) {
                filterObj[item] = obj[item]
            }
        }
        return filterObj
    }

    transformTreeData(nodeList,pid,pname){
        console.log("999999999999999")
        let tempArr = new Array();
        for( let i = 0;i< nodeList.length;i++){
            if(nodeList[i].pid == pid){
                nodeList[i].parentName=pname;
                nodeList[i].children =  this.transformTreeData(nodeList,nodeList[i].id,nodeList[i].name);

                if(nodeList[i].children.length>0){
                    nodeList[i].isParent = true;
                }else{
                    nodeList[i].isParent = false;
                }
                tempArr.push(nodeList[i]);
            }
        }
        return tempArr;
    }

    transformMenuTreeData1(nodeList,pid,pname,parentType){
        console.log("999999999999999")
        let tempArr = new Array();
        for( let i = 0;i< nodeList.length;i++){
            if(nodeList[i].pid == pid){
                nodeList[i].parentName=pname;
                nodeList[i].parentType=parentType;
                if(nodeList[i].menuType == "DIR" || nodeList[i].menuType == "MENU" || nodeList[i].menuType == "ROUTER"){
                    nodeList[i].children =  this.transformMenuTreeData1(nodeList,nodeList[i].id,nodeList[i].name,nodeList[i].menuType);
                }else{
                }
                tempArr.push(nodeList[i]);
            }
        }
        return tempArr;
    }

    transformMenuTreeData2(nodeList,pid,pname,parentType){
        console.log("55555555555555555")
        let tempArr = new Array();
        for( let i = 0;i< nodeList.length;i++){
            if(nodeList[i].pid == pid && nodeList[i].menuType != "FUNCTION"){
                nodeList[i].parentName=pname;
                nodeList[i].parentType=parentType;
                if(nodeList[i].menuType == "DIR" || nodeList[i].menuType == "MENU" || nodeList[i].menuType == "ROUTER"){
                    //目录
                    nodeList[i].children =  this.transformMenuTreeData2(nodeList,nodeList[i].id,nodeList[i].name,nodeList[i].menuType);
                }else{
                    //菜单
                }
                tempArr.push(nodeList[i]);
            }
        }
        return tempArr;
    }

    transformMenuTreeData(nodeList,pid,pname){
        console.log("999999999999999")
        let tempArr = new Array();
        for( let i = 0;i< nodeList.length;i++){
            if(nodeList[i].pid == pid){
                nodeList[i].parentName=pname;
                if(nodeList[i].menuType == "1"){
                    //目录
                    nodeList[i].children =  this.transformMenuTreeData(nodeList,nodeList[i].id,nodeList[i].name);
                }else{
                    //菜单
                }
                tempArr.push(nodeList[i]);
            }
        }
        return tempArr;
    }

    transformLeftMenuTreeData(nodeList,pid,pname,parentType){
        console.log("999999999999999")


        //如果是隐藏的，不显示
        let tempArr = new Array();
        for( let i = 0;i< nodeList.length;i++){
            if(nodeList[i].visiable == 1){
                if(nodeList[i].pid == pid){
                    nodeList[i].parentName=pname;
                    nodeList[i].parentType=parentType;
                    if(nodeList[i].menuType == "DIR"){
                        nodeList[i].children =  this.transformLeftMenuTreeData(nodeList,nodeList[i].id,nodeList[i].name,nodeList[i].menuType);
                    }else{
                    }
                    tempArr.push(nodeList[i]);
                }
            }
        }
        return tempArr;
    }

    copyText(text){
        var input = document.createElement("input"); // 创建input对象
        input.value = text; // 设置复制内容
        document.body.appendChild(input); // 添加临时实例
        input.select(); // 选择实例内容
        document.execCommand("Copy"); // 执行复制
        document.body.removeChild(input); // 删除临时实例
        this.$message({
            message: '复制成功',
            type: 'success'
        });
    }

}
let u = new commonUtils;
export default u;