<template>
    <div>
        Home
        <p @click="onAlert()">alert</p>
    </div>
</template>
<script lang="ts">
import {Vue, Component} from "../components/baseVue";

@Component({

})
export default class Home extends Vue {
    //==================data
    title:string = "Home";

    //==================computed


    //==================lifecycle hook
    mounted(){
        console.log("Home mounted!");
        console.log((this as any).getDateStr(1));
    }


    //==================method
    onAlert(){
        (this as any).mixAlert({tips:'xxxxoooo'});
    }
}
</script>
