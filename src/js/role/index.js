import {roleApi, orgApi, clientApi} from '@/api';
import {ElMessage} from "element-plus";
import utils from "@/utils/common";

export default {
    name: "role",

    data() {
        return {
            searchForm:{
                name:"",
                orgId:""
            },
            tableData:[
            ],

            page:{
                currentPage:1,
                pageSize:10,
                total:0
            },

            dialogVisible:false,

            dialogTitle:"新增",

            addForm:{
                id:"",
                name:"",
                orgId:"",
                orgName:"",
                type:"CUSTOM",
                useScope:"1",
                dataScope:"",
                sort:"",
                state:1,
                description:""
            },

            rules:{
                name: [
                    { required: true, message: '请输入角色名称', trigger: 'blur' }
                ],
                orgName: [
                    { required: true, message: '请选择所属机构', trigger: 'change' }
                ],
                type: [
                    { required: true, message: '请选择角色类型', trigger: 'change' }
                ],
                useScope: [
                    { required: true, message: '请选择使用范围', trigger: 'change' }
                ],
                dataScope: [
                    { required: true, message: '请选择数据权限', trigger: 'change' }
                ]
            },

            stateList:[{
                label: "有效",
                value: "1"
            },{
                label: "禁用",
                value: "0"
            }],
            filterText:"",
            selectFilterText:"",

            orgTreeData:[],

            selectTreeData:[],

            defaultProps: {
                children: 'children',
                label: 'name',
                class:this.customNodeClass
            },

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

            loading:false,

            selectOrg:{

            }
        }
    },
    mounted() {

        this.onload();
    },
    methods: {

        onload(){
            this.getRoleList();
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
                    var menuTableData
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

        getRoleList(){
            roleApi.getPageList(
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
            this.getRoleList();
        },

        handleSizeChange(val){

            this.page.pageSize = val;
            this.getRoleList();
        },
        handleCurrentChange(val){
            this.page.currentPage = val;
            this.getRoleList();
        },

        addBtnClick(){
            this.addForm.orgId = this.selectOrg.id;
            this.addForm.orgName = this.selectOrg.name;
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
        },

        orgClick(data,node,self){
            this.searchForm.orgId = data.id;
            this.selectOrg = data;
            this.getRoleList();

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
                        roleApi.save(this.addForm).then(response => {
                            // debugger;
                            //适应两种分页格式
                            if(response.resultCode == "0000"){
                                this.saveFlag = false;
                                ElMessage({
                                    message: '保存成功。',
                                    type: 'success',
                                })
                                this.dialogVisible = false,
                                    this.getRoleList();
                            }else{
                                ElMessage.error('保存失败。')
                            }
                            this.saveFlag = false;
                        }).catch(error => {
                            ElMessage.error('保存失败。')
                            console.log('page===========', error)
                            this.saveFlag = false;
                        })
                    }
                })
            }
        },

        dialogClose(){
            this.$refs["addForm"].resetFields();
        },

        settingClick(row){
            this.$router.push({
                path:'/authority',
                query:{
                    roleId:row.id,
                }
            })
        },
        editClick(row){
            this.dialogTitle = "修改";

            this.addForm.id = row.id;
            this.addForm.name = row.name;
            this.addForm.orgId = row.orgId;
            this.addForm.orgName = row.orgName;
            this.addForm.sort = row.sort;
            this.addForm.type = row.type;
            this.addForm.useScope = row.useScope;
            this.addForm.dataScope = row.dataScope;
            this.addForm.state = row.state;
            this.addForm.description = row.description;
            this.dialogVisible = true;
        },
        deleteClick(row){

        },

        customNodeClass(data,node){

            if(this.searchForm.orgId == data.id){
                return "active";
            }
            return null;
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

        roleTypeChange(val){
            if(val == 'CUSTOM'){
                this.addForm.useScope = '1';
            }
        }
    }
}