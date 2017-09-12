import Vue from 'vue';
declare var require:any;

/* async */
// let alert:any = resolve => require(['@/module/components/Alert.vue'], resolve);

/* sync */
import alert from '@/module/components/Alert.vue';

const components = {
    alert : alert,
}

for (let key in components){
    Vue.component(key, components[key]);
}
