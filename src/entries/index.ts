import Vue from 'vue';
import router from "../router"


import App from '@/module/App.vue'


const evt = "onorientationchange" in window ? "orientationchange" : "resize";
window.addEventListener(evt, function () {

}, false);











let vm = (window as any).vm = new Vue({
    router:router,
    render: h => h(App)
})

vm.$mount('#app');