import { createApp } from 'vue'
import App from './App.vue'

import router from './router';


import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'dayjs/locale/zh-cn' //中文
// import locale from 'element-plus/lib/locale/lang/zh-cn.js' //中文

import './assets/iconfont/iconfont.css'

import frontboard from 'frontboard3'

import 'frontboard3/frontboard3.css'


import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import axios from 'axios'

import { createPinia } from 'pinia'

window.addEventListener('error', function onError(e) {
    // Ignore ResizeObserver error
    if (e.message === 'ResizeObserver loop limit exceeded') {
        console.log("123134314444444")
        e.stopPropagation();
        e.stopImmediatePropagation();

        e.preventDefault()

    }
});

// 解决 ElTable 自动宽度高度导致的「ResizeObserver loop limit exceeded」问题
const debounce = (fn, delay) => {
    let timer = null;
    return function () {
        let context = this;
        let args = arguments;
        clearTimeout(timer);
        timer = setTimeout(function () {
            fn.apply(context, args);
        }, delay);
    }
}

const _ResizeObserver = window.ResizeObserver;
window.ResizeObserver = class ResizeObserver extends _ResizeObserver{
    constructor(callback) {
        callback = debounce(callback, 16);
        super(callback);
    }
};


//https://pinia.web3doc.top/core-concepts/state.html#%E9%87%8D%E7%BD%AE%E7%8A%B6%E6%80%81

const app = createApp(App);

const pinia = createPinia()
app.use(pinia);
// app.use(ElementPlus,{ locale });
app.use(ElementPlus);
app.use(router);
app.config.globalProperties.$axios=axios;  //配置axios的全局引用
app.use(frontboard.install);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
};
app.mount('#app');

