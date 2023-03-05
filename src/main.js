import { createApp } from 'vue'
import App from './App.vue'

import router from './router';


import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'dayjs/locale/zh-cn' //中文
import locale from 'element-plus/lib/locale/lang/zh-cn' //中文

import frontboard from 'frontboard3'

import 'frontboard3/frontboard3.css'


import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import axios from 'axios'


const app = createApp(App);
app.use(ElementPlus,{ locale });
app.use(router);
app.config.globalProperties.$axios=axios;  //配置axios的全局引用
app.use(frontboard.install);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.mount('#app');
