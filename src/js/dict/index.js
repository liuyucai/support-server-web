// 导入axios实例
import httpRequest from '@/utils/request'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

import { UploadProps } from 'element-plus'

import {clientGroupApi,dictApi,serviceApi} from '@/api';

export default {
    name: "dict",

    data() {
        return {
            searchForm:{
                name:"",
                code:""
            },
            dialogVisible:false,
            dialogDictItemVisible:false,
            dialogAddDictItemVisible:false,
            tableData:[],
            dictItemTableData:[],
            page:{
                currentPage:1,
                pageSize:1,
                total:0
            },
            dictItemPage:{
                currentPage:1,
                pageSize:1,
                total:0
            },
            dialogTitle:"新增",

            dialogAddDictItemTitle:"新增",
            addForm:{
                id:"",
                name:"",
                code:"",
                serviceId:"",
                serviceName:"",
                type:"SYSTEM",
                description:"",
            },

            addDictItemForm:{
                id:"",
                code:"",
                name:"",
                groupId:"",
                sort:1,
            },
            rules:{
                name: [
                    { required: true, message: '请输入名称', trigger: 'blur' }
                ],
                code: [
                    { required: true, message: '请输入编码', trigger: 'blur' }
                ]
            },

            dictItemRules:{
                name: [
                    { required: true, message: '请输入名称', trigger: 'blur' }
                ],
                code: [
                    { required: true, message: '请输入编码', trigger: 'blur' }
                ]
            },

            saveFlag:false,

            loading:false,

            serviceList:[],

            activeDictGroupId:"",

            typeList:[{
                label:"系统类型",
                value:"SYSTEM"
            },{
                label:"业务类型",
                value:"BUSINESS"
            }]

        }
    },

    mounted(){
        this.onSearch();

        this.getServiceList();
    },

    methods:{

        onSearch(){
            this.getPageList();
        },

        getServiceList(){
            serviceApi.getAllList().then(response => {
                if(response.resultCode == "0000"){
                    this.serviceList = response.data
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

        addBtnClick(){
            console.log("................")
            this.dialogVisible = true;
        },

        handleSizeChange(){
            this.page.pageSize = val;
            this.onSearch();
        },
        handleCurrentChange(){
            this.page.pageSize = val;
            this.onSearch();
        },

        handleDictItemSizeChange(){
            this.dictItemPage.pageSize = val;
            this.getDictItem();
        },
        handleDictItemCurrentChange(){
            this.dictItemPage.pageSize = val;
            this.getDictItem();
        },

        selectIcon(icon){
            this.addForm.icon = icon;
        },

        beforeSelectIcon(){
            this.$refs.iconSelectDialog.openSelectDialog();
        },

        dialogClose(){
            this.$refs["addForm"].resetFields()
        },

        dialogAddDictItemClose(){
            this.$refs["addDictItemForm"].resetFields()
        },
        dictClick(row){
            this.dialogDictItemVisible = true;
            
            this.activeDictGroupId = row.id;
            this.getDictItem();
        },

        getDictItem(){
            dictApi.getDictItemPageList(
                {
                    'page': this.dictItemPage.currentPage,
                    'size': this.dictItemPage.pageSize ? this.dictItemPage.pageSize : 10,
                    'condition':{
                        groupId:this.activeDictGroupId
                    }
                }
            ).then(response => {
                if(response.resultCode == "0000"){
                    this.dictItemPage.currentPage = response.page
                    this.dictItemPage.pageSize = response.size
                    this.dictItemPage.total = response.totalElement
                    this.dictItemTableData = response.data
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
            console.log(row);

            this.addForm.id = row.id;
            this.addForm.name = row.name;
            this.addForm.code = row.code;
            this.addForm.type = row.type;
            this.addForm.serviceName = row.serviceName;

            this.addForm.serviceId = row.serviceId;

            this.addForm.description = row.description;

            this.dialogVisible = true;
        },

        deleteClick(id){
            dictApi.deleteDictGroup(id).then(response => {
                if(response.resultCode == "0000"){
                    ElMessage.success('删除成功。')
                    this.onSearch();
                }else{
                    ElMessage.error('删除失败。');
                }
            }).catch(error => {
                console.log('page===========', error)
                ElMessage.error('删除失败。')

            })
        },

        editDictItemClick(row){
            console.log(row);

            this.dialogAddDictItemTitle = "编辑";
            this.addDictItemForm.id = row.id;
            this.addDictItemForm.name = row.name;
            this.addDictItemForm.code = row.code;
            this.addDictItemForm.sort = row.sort;
            this.addDictItemForm.groupId = row.groupId;


            this.dialogAddDictItemVisible = true;
        },


        getPageList(){

            console.log("................");
            this.loading = true;
            dictApi.getPageList(
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


        saveInfo(){
            if(this.saveFlag){
                return;
            }else{
                this.$refs["addForm"].validate((valid) => {
                    this.saveFlag = true;
                    dictApi.saveDictGroup(this.addForm).then(response => {
                        // debugger;
                        //适应两种分页格式
                        if(response.resultCode == "0000"){
                            this.saveFlag = false;
                            ElMessage({
                                message: '保存成功。',
                                type: 'success',
                            })
                            this.getPageList();
                            this.$refs["addForm"].resetFields();
                            this.dialogVisible = false;
                        }else{
                            ElMessage.error('保存失败。')
                        }
                        this.saveFlag = false;
                    }).catch(error => {
                        ElMessage.error('保存失败。')
                        console.log('page===========', error)
                        this.saveFlag = false;
                    })
                })
            }
        },

        saveDictItem(){
            if(this.saveFlag){
                return;
            }else{
                this.$refs["addDictItemForm"].validate((valid) => {
                    this.saveFlag = true;
                    dictApi.saveDictItem(this.addDictItemForm).then(response => {
                        // debugger;
                        //适应两种分页格式
                        if(response.resultCode == "0000"){
                            this.saveFlag = false;
                            ElMessage({
                                message: '保存成功。',
                                type: 'success',
                            })
                            this.getDictItem();
                            this.$refs["addDictItemForm"].resetFields();
                            this.dialogAddDictItemVisible = false;
                        }else{
                            ElMessage.error('保存失败。');
                            this.$refs["addDictItemForm"].resetFields();
                        }
                        this.saveFlag = false;
                    }).catch(error => {
                        ElMessage.error('保存失败。')
                        console.log('page===========', error)
                        this.$refs["addDictItemForm"].resetFields()
                        this.saveFlag = false;
                    })
                })
            }
        },


        addDictItemClick(){
            this.dialogAddDictItemVisible = true;

            this.addDictItemForm.groupId = this.activeDictGroupId;
        },

        serviceSelectChange(val){
            console.log(val);

            this.addForm.serviceId = val;
        },

        dialogDictItemClose(){

        }
    }
}