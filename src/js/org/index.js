import {clientMenuApi, orgApi} from '@/api';
import {ElMessage} from "element-plus";
import utils from "@/utils/common";

export default {
    name: "org",

    data() {
        return {
            searchForm:{
                name:""
            },
            tableData:[
            ],

            page:{
                currentPage:1,
                pageSize:1,
                total:0
            },

            dialogVisible:false,

            dialogTitle:"新增",

            addForm:{
                parentName:"",
                pid:"",
                id:"",
                name:"",
                sort:"",
                state:1
            },

            rules: {
                name: [
                    {required: true, message: '请输入机构名称', trigger: 'blur'}
                ],
                parentName: [
                    {required: true, message: '请选择上级机构', trigger: 'change'}
                ]
            },

            stateList:[{
                label: "有效",
                value: "1"
            },{
                label: "禁用",
                value: "0"
            }],
            selectFilterText:"",

            selectTreeData:[],

            defaultProps: {
                children: 'children',
                label: 'name'
            },

            loading:false,
        }
    },
    mounted() {

        this.onload();
    },
    methods: {

        onload(){
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

                    var tableData = utils.transformTreeData(response.data, "0","根机构");

                    this.tableData = tableData;
                    this.selectTreeData = [{
                        id:"0",
                        name:"根机构",
                        children:tableData
                    }];

                    console.log("aaaaaaaaaaaaaaa");
                    console.log(tableData);
                    console.log(this.selectTreeData);
                }else{
                    ElMessage.error('加载失败。')
                    this.selectTreeData = [{
                        id:"0",
                        name:"根机构",
                        children:[]
                    }]
                }
                this.loading = false;
            }).catch(error => {
                console.log('page===========', error)
                ElMessage.error('加载失败。')
                this.loading = false;
                this.selectTreeData = [{
                    id:"0",
                    name:"根机构",
                    children:[]
                }]
            })
        },

        onSearch(){
            this.getOrgList();
        },

        handleSizeChange(){

        },
        handleCurrentChange(){

        },

        addBtnClick(){
            this.dialogTitle = "新增";
            this.dialogVisible = true;
        },

        stopBubbing(){
        },
        filterSearchNode(value, data) {
            if (!value) return true;
            return data.name.indexOf(value) !== -1;
        },

        treeNodeClick(data,node,self){
            this.addForm.pid = data.id;
            this.addForm.parentName = data.name;
            this.$refs.treeSelect.blur();
        },

        saveInfo(){
            if(this.saveFlag){
                return;
            }else{
                this.$refs["addForm"].validate((valid) => {
                    if (valid) {
                        this.saveFlag = true;
                        orgApi.save(this.addForm).then(response => {
                            // debugger;
                            //适应两种分页格式
                            if(response.resultCode == "0000"){
                                this.saveFlag = false;
                                ElMessage({
                                    message: '保存成功。',
                                    type: 'success',
                                })
                                this.dialogVisible = false;
                                this.getOrgList();
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

        addClick(row){
            this.addForm.parentName = row.name;
            this.addForm.pid = row.id;
            this.dialogTitle = "新增";
            this.dialogVisible = true;


        },
        editClick(row){
            this.addForm.parentName = row.parentName;
            this.addForm.pid = row.pid;
            this.addForm.id = row.id;
            this.addForm.name = row.name;
            this.addForm.sort = row.sort;
            this.dialogTitle = "修改";
            this.dialogVisible = true;
        },
        deleteClick(row){

        },
    }
}