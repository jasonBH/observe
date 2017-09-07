/* 下拉刷新 全屏
    @param _id 传入要控制元素id
    @param _callback 下拉回弹完成后的刷新回调
*/
;
(() => {
    SlideDownUpdate = function(_id, _callback, _includeScroll){
        this.userAgent = "pc";
        var _ua = navigator.userAgent.match(/(iPhone|iPod|iPad|Android|ios|SymbianOS)/i);
        if (_ua != null) {
            this.userAgent = "moblie";
        }

        this.touchmoveY_start = 0;
        this.touchmoveY_move = 0;

        this.pullDown_limit = 80;
        this.isup = false;
        this.isUpdate = false;
        this.updating = false;

        this.includeScroll = _includeScroll || false;//如果子元素包含滚动，false屏蔽, true不屏蔽

        this.callback = _callback;


        this.bindlist = {};
        this.bindlist.touchstart = this.touchstart.bind(this);
        this.bindlist.touchmove = this.touchmove.bind(this);
        this.bindlist.touchend = this.touchend.bind(this);
        this.bindlist.clear = this.clear.bind(this);
        this.bindlist.scrollPrevent = this.scrollPrevent.bind(this);


        this.el = document.getElementById(_id);
        this.tag_dom = null;
        this.warn_dom = null,
        // this.el.style.marginTop = "0px";
        this.tag = "";

        document.addEventListener("touchstart", this.bindlist.touchstart);
        document.addEventListener("onunload", this.bindlist.clear);

        this.init();
    }
    SlideDownUpdate.prototype = {
        constructor:SlideDownUpdate,

        default_tag:"<div id='updateDowntip' style='width:100%; height:0px; font-size:0.24rem; background-color:#fefefe; color:#ccc; overflow:hidden; display: -webkit-box; -webkit-box-orient: horizontal; -webkit-box-pack: center; -webkit-box-align: center;'><span id='warn' style=''>下拉刷新</span></div>",

        init:function(){
            // console.log("SlideDownUpdate init!");
            if(this.tag==""){
                this.tag = this.default_tag;
            }
            var newItem=document.createElement("div");
            newItem.innerHTML = this.tag;
            this.tag_dom = newItem.childNodes[0];
            // this.el.insertBefore(this.tag_dom, this.el.childNodes[0]);
            if(document.body.childNodes.length>0){
                document.body.insertBefore(this.tag_dom, document.body.childNodes[0]);
            }else{
                document.body.appendChild(this.tag_dom);
            }

            this.warn_dom = document.getElementById("warn");
            // console.log(this.warn_dom)

        },
        restore:function(){

        },
        clear:function(){
            document.removeEventListener("touchstart", this.bindlist.touchstart);
            document.removeEventListener("onunload", this.bindlist.clear);
            this.clearTouch();
            this.bindlist = {};
        },
        clearTouch:function(){
            document.removeEventListener("touchmove", this.bindlist.touchmove);
            document.removeEventListener("touchend", this.bindlist.touchend);
            // console.log("clearTouch")
            this.allowScroll();
        },

        touchstart:function(e){
            // if(this.updating==true) return;
            if(this.includeScroll==false){
                if(this.judgeDomIsScroll(e.target)==true){
                    // console.log("有内部滚动");
                    return;
                };
            }
            this.touchmoveY_move = 0;
            this.isUpdate = false;
            this.isup = false;
            // console.log("sdu:",e, this.el)
            if (this.userAgent == "pc") {
                this.touchmoveY_start = e.clientY;
            } else {
                this.touchmoveY_start = e.changedTouches[0].clientY;
            }
            // alert(scrollTop)
            if(this.getScrollTop()==0){
                document.addEventListener("touchmove", this.bindlist.touchmove);
                document.addEventListener("touchend", this.bindlist.touchend);
                this.disableScroll();
            }else{
                this.clearTouch();
                return;
            }
        },
        touchmove:function(e){
            var _site = 0;
            if (this.userAgent == "pc") {
                _site = e.clientY;
            } else {
                _site = e.changedTouches[0].clientY;
            }
            var _dis = _site - this.touchmoveY_start;

            this.touchmoveY_move += _dis;


            if(this.touchmoveY_move > this.pullDown_limit) this.touchmoveY_move = this.pullDown_limit;
            if(this.touchmoveY_move <= 0) this.touchmoveY_move = 0;
            this.tag_dom.style.height = this.touchmoveY_move+'px';
            this.updateWarnDom();


            if(this.touchmoveY_move > this.pullDown_limit*0.7){
                this.isUpdate = true;
            }else{
                this.isUpdate = false;
            }


            // console.log("b:",this.touchmoveY_move, this.touchmoveY_start, _site, this.isUpdate, this.getNumberHeightPX(this.tag_dom))

            this.touchmoveY_start = _site;

            // if(this.touchmoveY_move > this.pullDown_limit) this.touchmoveY_move = this.pullDown_limit;
            // if(this.touchmoveY_move <= 0) this.touchmoveY_move = 0;
            // this.tag_dom.style.height = this.touchmoveY_move+'px';

            if(this.isup){
                if(this.touchmoveY_move<=0){
                    this.isup = false;
                    this.clearTouch();
                    this.touchmoveY_move = 0;
                    this.tag_dom.style.height = this.touchmoveY_move+'px';
                }else{
                    this.setScrollTop(0);
                }
                return;
            }

            if(_dis>0 && this.getScrollTop()==0){
                this.updateSytle();
                this.isup = true;
                e.stopPropagation();
                if (e.cancelable) {
                    // 判断默认行为是否已经被禁用
                    if (!e.defaultPrevented) {
                        e.preventDefault();
                    }
                }
            }else{
                // console.log("xxxxxxxxxxxxxxxxxx")
                this.allowScroll();
            }

        },
        touchend:function(e){
            // console.log("xxxxxxxxxxxxxxxxxxxxxxxxxx:", this.touchmoveY_move)
            // this.updating = true;
            // console.log("touchend:", this.updating)
            e.stopPropagation();
            if (e.cancelable) {
                // 判断默认行为是否已经被禁用
                if (!e.defaultPrevented) {
                    e.preventDefault();
                }
            }

            if(this.isup ==false){
                this.clearTouch();
                this.touchmoveY_move = 0;
                this.tag_dom.style.height = this.touchmoveY_move+'px';
                return;
            }

            this.touchmoveY_start = 0;
            if(this.isup){
                this.isup = false;
                this.touchBack();
            }

            this.allowScroll();
        },
        touchBack:function(){
            // console.log("touchBack:")
            setTimeout(function(){
                var step = (0-this.touchmoveY_move)/4;
                // step = 1;
                step = step>0?Math.ceil(step):Math.floor(step);
                this.touchmoveY_move += step;
                this.updateSytle();
                if(Math.abs(this.touchmoveY_move)<1){
                    this.touchmoveY_move = 0;
                    this.updateSytle();
                    this.clearTouch();
                    if(this.isUpdate){
                        // this.updating = false;
                        // console.log("touchBack:", this.updating)
                        if(this.callback) this.callback();
                    }
                }else{
                    this.touchBack();
                }

            }.bind(this), 20)
        },
        updateSytle:function(){
            // console.log(this.pullDown_limit)
            if(this.touchmoveY_move > this.pullDown_limit) this.touchmoveY_move = this.pullDown_limit;
            if(this.touchmoveY_move <= 0) this.touchmoveY_move = 0;
            this.updateWarnDom();
            this.tag_dom.style.height = this.touchmoveY_move+'px';
            // console.log("updateSytle:", this.touchmoveY_move, this.getScrollTop())
            this.setScrollTop(0);
        },
        updateWarnDom:function(){
            if(this.warn_dom){
                // console.log(this.getNumberHeightPX(this.tag_dom), this.pullDown_limit*0.7)
                if(this.getNumberHeightPX(this.tag_dom) > this.pullDown_limit*0.7){
                    this.warn_dom.innerHTML = "松开刷新"
                }else{
                    this.warn_dom.innerHTML = "下拉刷新"
                }
            }
        },


        getScrollTop:function(){
            var _scrollTop = window.pageYOffset|| document.documentElement.scrollTop || document.body.scrollTop;
            return _scrollTop;
        },
        setScrollTop:function(value){
            if(document.body.scrollTop){
                document.body.scrollTop = value;
            }else if(document.documentElement.scrollTop){
                document.documentElement.scrollTop = value;
            }
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
            e.stopPropagation();
            if (e.cancelable) {
                // console.log("cancelable")
                // 判断默认行为是否已经被禁用
                if (!e.defaultPrevented) {
                    e.preventDefault();
                }
            }
        },

        judgeDomIsScroll:function(dom){
            // console.log(dom, dom.clientHeight, dom.scrollHeight);
            if(dom.clientHeight<dom.scrollHeight){
                 if(dom.scrollTop==0){
                    return false;
                }
                return true;
            }else{
                if(dom.parentNode){
                    if(dom.parentNode==document.body){
                        // console.log("找到body啦");
                        return false;
                    }else{
                        return this.judgeDomIsScroll(dom.parentNode);
                    }
                }else{
                    return false;
                }
            }
        },

    }

})();