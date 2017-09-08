import '@/assets/style/index.scss';

import Vue from 'vue';
import router from "../router"

import '../module/utils/rem';
import '../module/utils/orientationchange';
// import mixFun from '../module/utils/mixFun';
import FastClick from 'fastclick';

// Vue.mixin(mixFun);
FastClick.attach(document.body);

import '../module/utils/mixFun'
console.log(Vue)

import App from '@/module/App.vue'






let vm = (window as any).vm = new Vue({
    router:router,
    render: h => h(App)
})

vm.$mount('#app');