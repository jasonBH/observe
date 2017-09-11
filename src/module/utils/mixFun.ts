import Vue from 'vue';

const mixFun = {
    methods:{
        //气泡提示
        mixBubble (msg,callback){
            this.$root.eventHub.$emit('showAlert',msg,callback);
        },

        //=========================================时间处理
        // 获取距今天dayCount天后的日期 "yy-mm-dd"
        getDateStr(dayCount:number):string{
            var dd = new Date();
            dd.setDate(dd.getDate() + dayCount);
            var y = dd.getFullYear();
            var m = dd.getMonth() + 1;
            var d = dd.getDate();
            return y + "-" + (m > 9 ? m : ('0' + m)) + "-" + (d > 9 ? d : ('0' + d));
        },
        // "yy-mm-dd"转日期
        getDateByStr(_str:string):Date{
            return new Date(Date.parse(_str.replace(/-/g, "/")));
        },
        /* 列表排序： */
        ArraySortKey(key,desc):any{
            desc = desc || false;
            return function(a,b){
                if(desc){
                    return a[key]>b[key] ? -1 : 1;
                }else{
                    return a[key]>b[key] ? 1 : -1;
                }
            }
        },
        //深度克隆
        deepClone(obj:object):any{
            var str, newobj = obj.constructor === Array ? [] : {};
            if(typeof obj !== 'object'){
                return null;
            } else if((window as any).JSON){
                str = JSON.stringify(obj), //系列化对象
                newobj = JSON.parse(str); //还原
            } else {
                for(var i in obj){
                    newobj[i] = typeof obj[i] === 'object' ?
                    this.deepClone(obj[i]) : obj[i];
                }
            }
            return newobj;
        },
        //obj判断类型：返回传递给他的任意对象的类
        isClass(o:any):any{
            if(o===null) return "Null";
            if(o===undefined) return "Undefined";
            return Object.prototype.toString.call(o).slice(8,-1);
        },
        /* obj同key写入 */
        objWriteValue(_source, _objvalue):void{
            for(var _key in _objvalue){
                if(_source.hasOwnProperty(_key)){
                    if(_key=='other'){
                        console.log("wv:",this.isClass(_objvalue[_key]))
                    }
                    if(this.isClass(_objvalue[_key])=="Object"){
                        if(_key=='not_disturb'){
                            console.log('not_disturb:',_source[_key], _objvalue[_key])
                        }
                        this.objWriteValue(_source[_key], _objvalue[_key]);
                    }else{
                        _source[_key] = _objvalue[_key];
                    }
                }
            }
        },
        /* obj判断是否为空{} */
        isEmptyObject(e:object):boolean{
            var t;
            for (t in e)
                return !1;
            return !0
        },
    }
}

Vue.mixin(mixFun);