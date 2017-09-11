<template>
    <div class="alert" v-if="isShow">
        <div class="">
            <main class="">
                <p>{{tips}}</p>
            </main>
            <footer class="">
                <button @click="cancel()">取消</button>
                <button @click="ok()">确定</button>
            </footer>
        </div>
    </div>
</template>
<script lang="ts">
import {Vue, Component} from "./baseVue";

@Component({

})
export default class Alert extends Vue {
    //=================data
    isShow:boolean = false
    tips:string = ''//提示新增
    okFun:Function = null
    cancelFun:Function = null

    //==================computed


    //==================lifecycle hook
    mounted(){
        (this.$root as any).eventHub.$on('showAlert',(obj) => {
            this.isShow = true;
            this.tips = obj.tips || '您好';
            this.okFun = obj.okFun;
            this.cancelFun = obj.cancelFun;
        })
    }


    //==================method
    ok () {
        this.isShow = false;
        if(typeof(this.okFun) === 'function'){
            this.okFun();
        }
    }
    cancel () {
        this.isShow = false;
        if(typeof(this.cancelFun) === 'function'){
            this.cancelFun();
        }
    }
}
</script>
<style scope>
.alert { width: 3rem; height: 2rem; border: 1px solid red; margin: 3rem auto;}

</style>
