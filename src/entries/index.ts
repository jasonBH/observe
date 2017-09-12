/* css */
import '@/assets/style/index.scss';

/* lib */
import Vue from 'vue';
import router from "../router"
import FastClick from 'fastclick';

/* 自动执行脚本 */
import '../module/utils/rem';
import '../module/utils/orientationchange';
import '../module/utils/Components';
import '../module/utils/mixFun';

/* 组件 */
import App from '@/module/App.vue';




FastClick.attach(document.body);

let vm = (window as any).vm = new Vue({
    router:router,
    render: h => h(App),
    data : {
        eventHub : new Vue(),
    }
})

vm.$mount('#app');

