/*自定义事件*/
export default {
    listenterList:[],
    events:{
        test:"test",
        loading:"Event_loading",
        bubble:"Event_bubble",
        alert:"Event_alert",
    },


    addEvent: function(type, fn) {
        if (typeof this.listenterList[type] === "undefined") {
            this.listenterList[type] = [];
        }
        if (typeof fn === "function") {
            this.listenterList[type].push(fn);
        }
        return this;
    },
    triggerEvent: function(type, _arg) {
        var arrayEvent = this.listenterList[type];
        if (arrayEvent instanceof Array) {
            for (var i = 0; i < arrayEvent.length; i++) {
                if (typeof arrayEvent[i] === "function") {
                    arrayEvent[i].apply(this, [_arg]);
                }
            }
        }
    },
    removeEvent: function(type, fn) {
        var arrayEvent = this.listenterList[type];
        if (typeof type == "string" && arrayEvent instanceof Array) {
            if (typeof fn === "function") {
                for (var i = arrayEvent.length - 1; i >= 0; i--) {
                    if (arrayEvent[i] === fn) {
                        this.listenterList[type].splice(i, 1);
                        // console.log("removeEvent success:", arrayEvent, fn)
                        break;
                    }
                }
            } else {
                delete this.listenterList[type];
            }
        }
        return this;
    },
    removeEvents: function() {
        for (var type in this.listenterList) {
            this.removeEvent(type);
        }
    },




    //============tools
    /*bubble
      @params str   //(显示信息) || "close"(关闭)
    */
    bubble:function(_param){
        this.triggerEvent(busEvent.events.bubble, _param);
    },
    /*alert
      @params  {
                    title:"",           //弹窗标题
                    info:"",            //显示信息
                    fun_ok:null,        //ok按钮回调
                    fun_cancel:null     //cancel按钮回调
                }
    */
    alert:function(_param){
        // lg.to(_param)
        this.triggerEvent(busEvent.events.alert, _param);
    },
    /*loading
      @params str   //"close"（关闭） || 不传参数（显示）
    */
    loading:function(_param){
        this.triggerEvent(busEvent.events.loading, _param);
    },
    /*loading_upload
      @params {
          show:"per"/"speed",
          loaded:0,
          total:0,
          speed:"",
      }
      @param str    //"close"或不传参数 关闭
    */
    loading_upload:function(_param){
        this.triggerEvent(busEvent.events.loading_upload, _param);
    },



}