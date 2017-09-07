export class Observer {
    constructor(obj, callback){
        console.log("observer:", obj)
        if(Object.prototype.toString.call(obj)!=='[object Object]'){
            console.error("The Parameter must be an object:"+obj);
            return;
        }
        this.callback = callback;
        this.inObserver(obj);
    }
    inObserver(obj){
        Object.keys(obj).forEach((key, index)=>{
            var value = obj[key];
            Object.defineProperty(obj, key, {
                get:function(){
                    return value;
                },
                set:(val)=>{
                    // console.log("set:", this)
                    value = val;
                    this.callback(value);
                }
            })
        })
    }

}