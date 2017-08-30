export default {
    isClick:true,
    callBack:null,
    bindlist:{},
    start:function(_callBack){
        this.callBack = _callBack;
        this.isClick = true;
        this.bindlist = {};
        this.bindlist.touchStart = this.touchStart.bind(this);
        this.bindlist.touchEnd = this.touchEnd.bind(this);
        this.bindlist.touchMove = this.touchMove.bind(this);
        document.body.addEventListener('touchstart', this.bindlist.touchStart);
    },
    touchStart:function(e){
        this.isClick = true;
        // console.log("touchStart:", this.isClick);
        document.body.addEventListener('touchend', this.bindlist.touchEnd);
        document.body.addEventListener('touchmove', this.bindlist.touchMove);
    },
    touchMove:function(e){
        // console.log("touchMove");
        this.isClick = false;
        this.touchEnd();
    },
    touchEnd:function(e){
        // console.log("touchEnd:", this.isClick);
        if(this.callBack){
            this.callBack(this.isClick);
        }
        setTimeout(()=>{
            document.body.removeEventListener('touchstart', this.bindlist.touchStart);
            document.body.removeEventListener('touchmove', this.bindlist.touchMove);
            document.body.removeEventListener('touchend', this.bindlist.touchEnd);
            this.isClick = false;
            this.callBack = null;
        },50);
    },
}