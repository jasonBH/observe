<template>
    <div id="content">
        <router-view></router-view>
        <alert></alert>
    </div>
</template>
<script lang="ts">
import {Vue, Component} from "./components/baseVue";

@Component({

})
export default class App extends Vue {
    //==================data
    testMsg:string = "App.vue";
    //==================computed


    //==================lifecycle hook
    mounted(){
        // console.log("App mounted!")

    }


    //==================method
}
</script>
