class orientationChange{
    private evt:string = "";
    constructor(){
        this.evt = "onorientationchangee" in window ? 'orientationchangee' : 'resize';
        window.addEventListener(this.evt, this.orientationHanlder, false);
        console.log("???????????")
    }
    orientationHanlder(event:any):void{
        if(this.evt=="orientationchangee"){
            if ( window.orientation == 180 || window.orientation==0 ) {
                alert("竖屏");
            }else if( window.orientation == 90 || window.orientation == -90 ){
                alert("横屏");
            }
        }else{
            const width:number = document.documentElement.clientWidth;
            const height:number = document.documentElement.clientHeight;
            if(width < height){
                console.log("竖屏");
            }else if(width > height){
                console.log("横屏");
            }
        }
    }
}

export default new orientationChange();