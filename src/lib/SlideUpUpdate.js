/* 上拉加载 dom
    @param _id 传入要控制元素id
    @param _callback 下拉回弹完成后的刷新回调
*/
;
(()=>{
    SlideUpUpdate = function(id, _callback){
        this.callback = _callback;
        this.el = document.getElementById(id);

        this.tag_dom = null;
        this.pullUp_limit = -60;

        this.touchmoveY_start = 0;
        this.touchmoveY_move = 0;

        this.isup = false;
        this.isCall = false;
        this.isBottom = false;


        this.bindlist = {};
        this.bindlist.clear = this.clear.bind(this);
        this.bindlist.scrollPrevent = this.scrollPrevent.bind(this);
        this.bindlist.touchstart = this.touchstart.bind(this);
        this.bindlist.touchmove = this.touchmove.bind(this);
        this.bindlist.touchend = this.touchend.bind(this);

        this.el.addEventListener("touchstart", this.bindlist.touchstart);
        document.addEventListener("onunload", this.bindlist.clear);
        document.addEventListener("touchend", this.bindlist.touchend);

        this.init();
    }
    SlideUpUpdate.prototype = {
        constructor:SlideUpUpdate,

        default_tag:"<div id='updateUptip' style='width:100%; height:20px; font-size:0.24rem; background-color:#fefefe; color:#ccc; overflow:hidden; display: -webkit-box; -webkit-box-orient: horizontal; -webkit-box-pack: center; -webkit-box-align: center;'><span id='upwarn' style=''>上拉加载更多</span></div>",

        clear:function(){
            // alert("SlideUpUpdate clear")
            this.allowScroll();
            if(this.el){
                this.el.removeEventListener("touchstart", this.bindlist.touchstart);
                this.el.removeEventListener('touchmove', this.bindlist.touchmove);
            }
            document.removeEventListener("onunload", this.bindlist.clear);
            document.removeEventListener("touchend", this.bindlist.touchend);
            this.bindlist = {};
        },

        init:function(){
            this.tag = "";
            if(this.tag==""){
                this.tag = this.default_tag;
            }
            var newItem=document.createElement("div");
            newItem.innerHTML = this.tag;
            this.tag_dom = newItem.childNodes[0];
            this.el.appendChild(this.tag_dom);
            this.warn_dom = document.getElementById("upwarn");
            this.isBottom = false;
            this.disableScroll();
        },
        /* 刷新
           * 添加新数据后执行
        */
        update:function(){
            this.el.appendChild(this.tag_dom);
        },

        touchstart:function(e){
            if(this.judgeParentIsSelf(e.target)==false){
                // console.log("与我无关")
                return;
            }
            this.touchmoveY_move = 0;
            this.touchmoveY_start = e.changedTouches[0].clientY;
            if(this.elScrollBottom()){
                this.isBottom = true;
                this.isup = true;
            }else{
                this.isBottom = false;
            }
            this.isCall = false;

            this.el.removeEventListener('touchmove', this.bindlist.touchmove);
            this.el.addEventListener('touchmove', this.bindlist.touchmove);
        },
        touchmove:function(e){

            let _site = e.changedTouches[0].clientY;
            var _dis = _site - this.touchmoveY_start;


            this.touchmoveY_move += _dis;
            if(this.touchmoveY_move < this.pullUp_limit) this.touchmoveY_move = this.pullUp_limit;
            if(this.touchmoveY_move > -20) this.touchmoveY_move = -20;
            // console.log(this.touchmoveY_move, _site, _dis,this.touchmoveY_start)
            this.touchmoveY_start = _site;
            if(_dis>0){
                // console.log("_dis:"+_dis)
                this.isBottom = false;
                this.isup = false;
                this.updateSytle();
                return;
            }
            if(this.isBottom==false){
                // console.log("isBottom:", this.isBottom)
                return;
            }

            if(_dis<=0 && this.elScrollBottom()){
                // console.log("不能动了")
                this.isup = true;
                this.scrollPrevent(e);
                this.updateSytle();
                this.el.scrollTop = this.getScrollHeight();
            }else{
                // console.log("能动了")
                this.isup = false;
                this.touchmoveY_move = -20;
                this.updateSytle();
            }
        },
        touchend:function(e){
            this.scrollPrevent(e);
            this.el.removeEventListener('touchmove', this.bindlist.touchmove);
            // console.log("touchend isBottom:",this.isup, this.isBottom)
            if(this.isBottom==false){
                // alert("不")
                this.touchmoveY_move = -20;
                this.updateSytle();
                return;
            }else{
                if(this.isup && this.getNumberHeightPX(this.tag_dom) > Math.abs(this.pullUp_limit)*0.7){
                    this.isCall = true;
                }
                this.touchBack();
            }
            this.isup = false;
        },
        touchBack:function(){
            setTimeout(function(){
                // console.log(this.touchmoveY_move)
                let step = (0-this.touchmoveY_move)/4;
                step = step>0?Math.ceil(step):Math.floor(step);
                this.touchmoveY_move += step;
                this.updateSytle();
                if(Math.abs(this.touchmoveY_move)<=20){
                    this.touchmoveY_move = -20;
                    this.updateSytle();
                    if(this.isCall){
                        this.isCall = false;
                        if(this.callback) this.callback();
                    }
                }else{
                    this.touchBack();
                }
            }.bind(this),20);
        },


        noScroll:function(){
            if(this.getClientHeight()>this.getScrollHeight()){
                return true;
            }
            return false;
        },
        elScrollBottom:function(){
            // console.log(this.getScrollTop(), this.getClientHeight(),this.getScrollHeight())
            if(this.getScrollTop() + this.getClientHeight() >= this.getScrollHeight()){
                return true;
            }
            return false;
        },
        //当前滚动位置
        getScrollTop:function(){
            return this.el.scrollTop;
        },
        //可视高度
        getClientHeight:function(){
            return this.el.clientHeight;
        },
        //文档高度
        getScrollHeight:function(){
            return this.el.scrollHeight;
        },
        getNumberHeightPX:function(dom){
            return parseFloat(dom.style.height.slice(0,-2))
        },


        /**
         * 禁止页面滚动
         */
        disableScroll:function() {
            this.allowScroll();
            window.addEventListener("touchmove", this.bindlist.scrollPrevent);
        },
        /**
         * 允许页面滚动
         */
        allowScroll:function() {
            window.removeEventListener("touchmove", this.bindlist.scrollPrevent);
        },
        scrollPrevent:function(e){
            if(this.judgeParentIsSelf(e.target)==true && this.isup==true){
                e.stopPropagation();
                if (e.cancelable) {
                    // console.log("cancelable")
                    // 判断默认行为是否已经被禁用
                    if (!e.defaultPrevented) {
                        e.preventDefault();
                    }
                }
            }
        },

        judgeParentIsSelf:function(dom){
            if(dom==this.el){
                return true;
            }else{
                if(dom.parentNode){
                    if(dom.parentNode==document.body){
                        // console.log("找到body啦");
                        return false;
                    }else{
                        return this.judgeParentIsSelf(dom.parentNode);
                    }
                }else{
                    return false;
                }
            }
        },



        updateSytle:function(){
            this.tag_dom.style.height = Math.abs(this.touchmoveY_move)+'px';
            this.updateWarnDom();
        },
        updateWarnDom:function(){
            // console.log(this.getNumberHeightPX(this.tag_dom), Math.abs(this.pullUp_limit)*0.7)
            if(this.warn_dom){
                if(this.getNumberHeightPX(this.tag_dom) > Math.abs(this.pullUp_limit)*0.7){
                    this.warn_dom.innerHTML = "松开加载"
                }else{
                    this.warn_dom.innerHTML = "上拉加载更多"
                }
            }
        },
    }

})();