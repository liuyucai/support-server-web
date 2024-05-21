// 导入axios实例
import httpRequest from '@/utils/request'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

import { UploadProps } from 'element-plus'

import {loginLogApi} from '@/api';

export default {
    name: "service",

    data() {
        return {
            searchForm:{
                name:""
            },
            dialogVisible:false,
            tableData:[],
            page:{
                currentPage:1,
                pageSize:10,
                total:0
            },
            dialogTitle:"详情",

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

        handleSizeChange(val){
            this.page.pageSize = val;
            this.getPageList();
        },
        handleCurrentChange(val){
            this.page.currentPage = val;
            this.getPageList();
        },

        getPageList(){

            this.loading = true;
            loginLogApi.getPageList(
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
    }
}