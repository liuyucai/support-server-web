// 导入axios实例
import httpRequest from '@/utils/request'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

import { UploadProps } from 'element-plus'

import {clientGroupApi} from '@/api';

export default {
    name: "clientGroup",

    data() {
        return {
            searchForm:{
                name:""
            },
            dialogVisible:false,
            tableData:[],
            page:{
                currentPage:1,
                pageSize:1,
                total:0
            },
            dialogTitle:"新增",
            addForm:{
                id:"",
                name:"",
                sort:1,
                icon:""
            },

            rules:{
                name: [
                    { required: true, message: '请输入客户端名称', trigger: 'blur' }
                ]
            },

            saveFlag:false,

            loading:false

        }
    },

    mounted(){
        this.onSearch();
    },

    methods:{

        onSearch(){
            this.getPageList();
        },

        addBtnClick(){
            console.log("................")
            this.dialogVisible = true;
        },

        handleSizeChange(){

        },
        handleCurrentChange(){

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

        editClick(row){
            console.log(row);

            this.addForm.id = row.id;
            this.addForm.name = row.name;
            this.addForm.icon = row.icon;
            this.addForm.sort = row.sort;

            this.dialogVisible = true;
        },

        deleteClick(id){

        },


        getPageList(){

            console.log("................");
            this.loading = true;
            clientGroupApi.getPageList(
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
                    clientGroupApi.save(this.addForm).then(response => {
                        // debugger;
                        //适应两种分页格式
                        if(response.resultCode == "0000"){
                            this.saveFlag = false;
                            ElMessage({
                                message: '保存成功。',
                                type: 'success',
                            })
                            this.getPageList();
                            this.$refs["addForm"].resetFields()
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
        }
    }
}