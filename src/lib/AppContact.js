//App
export default ((win)=>{
    win.appCallback = null;
    win.appAPI = {
        pickContact:'com.michong.h5.web.pickContact',//打开通讯录选取联系人
    }
    win.toApp = function (paramup, callback){
        win.appCallback = callback;
        var param = toAppCreateParam(paramup);
        // alert("to App param:"+JSON.stringify(param));
        if (win.hc) {//ios 7
            win.hc.call(JSON.stringify(param));
        } else if (win.webkit) {//ios8/android
            win.webkit.messageHandlers.call.postMessage(JSON.stringify(param));
        } else {//
            // console.log("电脑端移动测试 api:"+paramup.api)
            if(paramup.api==appAPI.getCId){
                return toWeb("{\"errno\":0,\"data\":{\"cId\":\"测试CId_ff5d789af6303065b942df11\"}}");
            }
            if(paramup.api==appAPI.getToken){
                return toWeb("{\"errno\":0,\"data\":{\"token\":\"\"}}");
            }
            return false;
        }
    }
    win.toWeb = function(response){
        // alert("toWeb:"+response);
        // alert("toWeb json:"+JSON.stringify(response));
        if(win.appCallback){
            win.appCallback(response);
        }
    }


    win.toAppCreateParam = function (paramup){
        var param = {};
        param.callback = 'toWeb';
        for(var key in paramup){
            param[key] = paramup[key];
        }
        return param;
    }









    //======================================检查平台
    win.agent = {
        agent:"",
        device_type:"android",//ios/android
        //检查是否为安卓
        checkAndroid:function() {
            return this.agent.indexOf("android") > 0;
        },
        //检查是否为ios
        checkIos:function() {
            return this.agent.match(/iphone os/i) == 'iphone os' || this.agent.match(/ipad/i) == 'ipad';
        },
        isMobile:function(){
            return this.agent.match(/Mobile/i);
        },
    };
    (()=>{
        win.agent.agent = navigator.userAgent.toLowerCase();
        console.log(win.agent.agent)
        if(win.agent.checkAndroid()==true){
            win.agent.device_type = 'android';
        }else if(win.agent.checkIos()==true){
            win.agent.device_type = 'ios';
        }else if(win.agent.isMobile()==true){
            win.agent.device_type = 'mobile';
        }else{
            win.agent.device_type = 'pc';
        }
    })()

})(window)