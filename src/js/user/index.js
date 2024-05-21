import {roleApi, orgApi, roleUserApi,userApi,userAccountApi} from '@/api';
import {ElMessage} from "element-plus";
import utils from "@/utils/common";

export default {
    name: "user",

    data() {
        return {
            searchForm:{
                name:"",
                orgId:"",
                queryRang:"2"
            },

            uploadUrl: `${process.env.VUE_APP_SERVER_URL}` + "file/upload",
            headers: {
                "Authorization": "123456"
            },

            fileServerUrl: `${process.env.VUE_APP_FILE_SERVER}`+`${process.env.VUE_APP_FILE_ENDPOINT}`+'/',
            tableData:[
            ],

            page:{
                currentPage:1,
                pageSize:10,
                total:0
            },
            accountTableData:[],
            userAccountPage:{
                currentPage:1,
                pageSize:10,
                total:0
            },

            rolePage:{
                currentPage:1,
                pageSize:10,
                total:0
            },

            dialogVisible:false,

            dialogTitle:"新增",

            addForm:{
                id:"",
                userId:"",
                userName:"",
                nickName:"",
                orgId:"",
                orgName:"",
                roleIds:[],
                enabled:1,
                description:""
            },
            selectOrgNameList:[],
            selectOrgList:[],

            rules:{
                userName: [
                    { required: true, message: '请选择用户账号', trigger: 'change' }
                ],
                nickName: [
                    { required: true, message: '请输入用户昵称', trigger: 'blur' }
                ],
                orgName: [
                    { required: true, message: '请选择所属机构', trigger: 'change' }
                ],
                enabled: [
                    { required: true, message: '请选择状态', trigger: 'change' }
                ],
            },
            filterText:"",
            selectFilterText:"",

            orgTreeData:[],

            selectTreeData:[],

            defaultProps: {
                children: 'children',
                label: 'name',
                class:this.customNodeClass
            },

            identityTypeList:[{
                label: "居民身份证",
                value: "01"
            },{
                label: "港澳通行证",
                value: "02"
            }],
            genderList:[{
                label: "男",
                value: "M"
            },{
                label: "女",
                value: "F"
            },{
                label: "其他",
                value: "OTHER"
            }],
            enabledList:[{
                label: "有效",
                value: "1"
            },{
                label: "禁用",
                value: "0"
            }],
            accountTypeList:[{
                label: "普通账号",
                value: "COMMON"
            },{
                label: "临时账号",
                value: "TEMP"
            }],


            loading:false,

            saveFlag:false,

            accountSelectDrawer:false,

            accountSearchForm:{
                userName:"",
                phoneNo:""
            },
            roleSearchForm:{
                userId:"",
                name:""
            },

            roleInfoDrawer:false,

            roleList:[],

            roleTableData:[],

            useScopeList:[{
                label: "本级",
                value: "1"
            },{
                label: "本级及子级",
                value: "2"
            }],
            roleTypeList:[{
                label: "默认角色",
                value: "DEFAULT"
            },{
                label: "自定义角色",
                value: "CUSTOM"
            }],
            dataScopeList:[{
                label: "全部",
                value: "1"
            },{
                label: "自定义",
                value: "2"
            },{
                label: "本级及子级",
                value: "3"
            },{
                label: "本级",
                value: "4"
            },{
                label: "本人",
                value: "5"
            }],

            deleteTipVisible:false
        }
    },
    mounted() {

        this.onload();
    },
    methods: {

        onload(){
            this.getUserList();
            this.getOrgList();
        },

        getOrgList(){
            orgApi.getAllList(
                {
                    sort: [
                        {
                            "direction": "sort",
                            "property": "DESC"
                        }
                    ]
                }
            ).then(response => {
                if(response.resultCode == "0000"){
                    var menuTableData = utils.transformTreeData(response.data, "0","上级菜单");

                    this.orgTreeData = menuTableData;
                    this.selectTreeData = menuTableData;

                }else{
                    ElMessage.error('加载失败。')
                    this.orgTreeData = [];
                    this.selectTreeData =[];
                }
                this.loading = false;
            }).catch(error => {
                console.log('page===========', error)
                ElMessage.error('加载失败。')
                this.loading = false;
                this.orgTreeData = [];
                this.selectTreeData =[];
            })
        },

        getUserList(){
            userApi.getPageList(
                {
                    'page': this.page.currentPage,
                    'size': this.page.pageSize ? this.page.pageSize : 10,
                    'condition':this.searchForm
                }
            ).then(response => {
                if(response.resultCode == "0000"){
                    this.page.currentPage = response.page
                    this.page.pageSize = response.size
                    this.page.total = response.totalElement
                    this.tableData = response.data
                }else{
                    ElMessage.error('加载失败。')
                }
                this.loading = false;
            }).catch(error => {
                console.log('page===========', error)
                ElMessage.error('加载失败。')
                this.loading = false;
            })
        },

        onSearch(){
            this.getUserList();
        },

        handleSizeChange(val){

            this.page.pageSize = val;
            this.getUserList();
        },
        handleCurrentChange(val){
            this.page.currentPage = val;
            this.getUserList();
        },

        handleUserAccountSizeChange(val){

            this.userAccountPage.pageSize = val;
            this.getUserList();
        },
        handleUserAccountCurrentChange(val){
            this.userAccountPage.currentPage = val;
            this.getUserList();
        },

        handleRoleSizeChange(val){

            this.rolePage.pageSize = val;
            this.getUserList();
        },
        handleRoleCurrentChange(val){
            this.rolePage.currentPage = val;
            this.getUserList();
        },

        addBtnClick(){
            this.dialogVisible = true;
        },

        stopBubbing(){
        },
        filterSearchNode(value, data) {
            if (!value) return true;
            return data.name.indexOf(value) !== -1;
        },

        treeNodeClick(data,node,self){
            this.addForm.orgId = data.id;
            this.addForm.orgName = data.name;
            this.$refs.treeSelect.blur();
            this.orgSelectChange();
            // this.$refs.addForm.validateField('orgId', ErrorMsg => {})
        },
        orgSelectChange(val){

            console.log("........................")
            //获取机构角色信息
            this.getRoleList();
        },

        getRoleList(){
            roleApi.getAllList({
                orgId:this.addForm.orgId
            }).then(response => {
                if(response.resultCode == "0000"){
                    this.roleList = response.data
                }else{
                    ElMessage.error('获取角色信息失败。')
                }
            }).catch(error => {
                console.log(error)
                ElMessage.error('获取角色信息失败。')
            })
        },

        orgClick(data,node,self){
            this.searchForm.orgId = data.id;
            this.getUserList();
        },

        filterNode(data,node,self){
            if (!value) return true;
            return data.name.indexOf(value) !== -1;
        },

        saveInfo(){
            if(this.saveFlag){
                return;
            }else{
                this.$refs["addForm"].validate((valid) => {
                    if (valid) {
                        this.saveFlag = true;
                        userApi.save(this.addForm).then(response => {
                            // debugger;
                            //适应两种分页格式
                            if(response.resultCode == "0000"){
                                this.saveFlag = false;
                                ElMessage({
                                    message: '保存成功。',
                                    type: 'success',
                                })
                                this.dialogVisible = false,
                                this.getUserList();
                            }else{
                                ElMessage.error('保存失败。')
                            }
                            this.saveFlag = false;
                        }).catch(error => {
                            ElMessage.error('保存失败。')
                            console.log('page===========', error)
                            this.saveFlag = false;
                        })
                    }else{}
                    console.log("11111111111")
                })
            }
        },

        dialogClose(){
            this.$refs["addForm"].resetFields();
            this.addForm.roleIds = [];
        },

        addClick(row){
            // this.accountSelectDrawer = true;

            this.roleSearchForm.userId = row.id;
            this.roleInfoDrawer = true;
            this.getRoleSettingList();
        },

        getRoleSettingList(){

            userApi.getRoleSettingPageList(
                {
                    'page': this.rolePage.currentPage,
                    'size': this.rolePage.pageSize ? this.rolePage.pageSize : 10,
                    'condition':this.roleSearchForm
                }
            ).then(response => {
                if(response.resultCode == "0000"){
                    this.rolePage.currentPage = response.page;
                    this.rolePage.pageSize = response.size;
                    this.rolePage.total = response.totalElement;
                    response.data.forEach(item=>{
                        if(item.disabledId){
                            console.log("0000000000000")
                            item.switch = false;
                        }else{
                            console.log("111111111111111")
                            item.switch = true;
                        }
                    })
                    this.roleTableData = response.data

                    console.log(this.roleTableData);



                }else{
                    ElMessage.error('加载失败。')
                }
                this.loading = false;
            }).catch(error => {
                console.log('page===========', error)
                ElMessage.error('加载失败。')
                this.loading = false;
            })
        },
        editClick(row){

            //获取详情
            userApi.getDetailById(row.id).then(response => {
                // debugger;
                //适应两种分页格式
                if(response.resultCode == "0000"){

                    this.addForm.id=response.data.id;
                    this.addForm.userId=response.data.userId;
                    this.addForm.userName=response.data.userName;
                    this.addForm.nickName=response.data.nickName;
                    this.addForm.orgId=response.data.orgId;
                    this.addForm.orgName=response.data.orgName;
                    this.addForm.enabled=response.data.enabled;
                    this.addForm.description=response.data.description;

                    this.addForm.roleIds = [];

                    response.data.roleList.forEach(item =>{
                        this.addForm.roleIds.push(item.id);
                    })

                    //获取该机构的角色信息
                    this.getRoleList();

                    this.dialogVisible = true;
                }else{
                    ElMessage.error('获取信息失败。')
                }
                this.saveFlag = false;
            }).catch(error => {
                ElMessage.error('获取信息失败。')
                console.log(error)
            })
        },

        cancelDelete(row){
            // console.log(this.$refs[row.id+'delete'])
            this.$refs[row.id+'delete'].hide();
        },
        deleteClick(row){

            this.$refs[row.id+'delete'].hide();
            //获取详情
            userApi.deleted(row.id).then(response => {
                //适应两种分页格式
                if(response.resultCode == "0000"){
                    ElMessage.success('删除成功。')
                    //获取该机构的角色信息
                    this.onSearch();
                }else{
                    ElMessage.error('删除失败。')
                }
            }).catch(error => {
                ElMessage.error('删除失败。')
                console.log(error)
            })
        },

        cancelChange(row){
            // console.log(this.$refs[row.id+'delete'])
            this.$refs[row.id+'type'].hide();
        },

        changeUserTypeClick(row){
            this.$refs[row.id+'type'].hide();
            //获取详情
            userApi.updateUserType({
                id:row.id,
                type:1
            }).then(response => {
                //适应两种分页格式
                if(response.resultCode == "0000"){
                    ElMessage.success('修改成功。')
                    //获取该机构的角色信息
                    this.onSearch();
                }else{
                    ElMessage.error('修改失败。')
                }
            }).catch(error => {
                ElMessage.error('修改失败。')
                console.log(error)
            })
        },

        customNodeClass(data,node){

            if(this.searchForm.orgId == data.id){
                return "active";
            }
            return null;
        },

        formatAccountType(accountType){
            let desc = "-";
            this.accountTypeList.forEach((item, i) => {
                if(item.value == accountType){
                    desc = item.label;
                    return item.label;
                }
            });
            return desc;
        },

        handleAvatarSuccess(response){
            if(response.resultCode =="0000"){
                this.addForm.avatar = response.data;
            }
        },

        beforeAvatarUpload(rawFile){

        },

        onRoleSearch(){
            this.getRoleSettingList();
        },
        filterUserOrgSearchNode(value, data) {
            if (!value) return true;
            return data.name.indexOf(value) !== -1;
        },
        userOrgTreeNodeClick(data,node,self){
            this.accountSearchForm.orgId = data.id;
        },

        beforeSelectAccount(e){
            //设置失去焦点
            e.target.blur();
            //获取账号信息
            this.getUserAccountList();
            this.accountSelectDrawer = true;
        },

        getUserAccountList(){
            userAccountApi.getPageList(
                {
                    'page': this.userAccountPage.currentPage,
                    'size': this.userAccountPage.pageSize ? this.userAccountPage.pageSize : 10,
                    'condition':this.accountSearchForm
                }
            ).then(response => {
                if(response.resultCode == "0000"){
                    this.userAccountPage.currentPage = response.page
                    this.userAccountPage.pageSize = response.size
                    this.userAccountPage.total = response.totalElement
                    this.accountTableData = response.data
                }else{
                    ElMessage.error('加载失败。')
                }
                this.loading = false;
            }).catch(error => {
                console.log('page===========', error)
                ElMessage.error('加载失败。')
                this.loading = false;
            })
        },

        selectClick(row){
            this.addForm.userName = row.userName;
            this.addForm.userId = row.id;
            this.accountSelectDrawer = false;
        },

        formatRoleType(type){
            let desc = "-";
            this.roleTypeList.forEach((item, i) => {
                if(item.value == type){
                    desc = item.label;
                    return item.label;
                }
            });
            return desc;
        },

        formatUseScope(useScope){
            let desc = "-";
            this.useScopeList.forEach((item, i) => {
                if(item.value == useScope){
                    desc = item.label;
                    return item.label;
                }
            });
            return desc;
        },

        roleItemChange(row){
            console.log(row)

            //判断是默认角色还是自定义角色

            //如果是默认角色，就屏蔽

            if(row.type == 'DEFAULT'){
                //判断是开启还是删除

                if(row.switch){
                    //打开权限 roleId,orgUserId

                    roleUserApi.openDefaultRole(row.disabledId).then(response => {
                        if(response.resultCode == "0000"){
                            this.onRoleSearch();
                        }else{
                            this.onRoleSearch();
                            ElMessage.error('操作失败。')
                        }
                        this.loading = false;
                    }).catch(error => {
                        console.log(error)
                        ElMessage.error('操作失败。')
                        this.onRoleSearch();
                    })

                }else{
                    //关闭权限  roleDisabledId
                    roleUserApi.closeDefaultRole({
                        'roleId': row.id,
                        'orgUserId': row.orgUserId
                    }).then(response => {
                        if(response.resultCode == "0000"){
                            this.onRoleSearch();
                        }else{
                            this.onRoleSearch();
                            ElMessage.error('操作失败。')
                        }
                        this.loading = false;
                    }).catch(error => {
                        console.log(error)
                        ElMessage.error('操作失败。')
                        this.onRoleSearch();
                    })
                }
            }else{
                //自定义角色，就删除
                if(!row.switch){
                    //roleUserId
                    //关闭权限  roleDisabledId
                    roleUserApi.deleted(row.roleUserId).then(response => {
                        if(response.resultCode == "0000"){
                            this.onRoleSearch();
                        }else{
                            this.onRoleSearch();
                            ElMessage.error('操作失败。')
                        }
                        this.loading = false;
                    }).catch(error => {
                        console.log(error)
                        ElMessage.error('操作失败。')
                        this.onRoleSearch();
                    })
                }
            }
        }
    }
}