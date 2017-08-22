/*工具类*/
export default {
    //==============================reg验证
    reg_url:/^(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/,//url
    reg_email:/\w+[@]{1}\w+[.]\w+/,//email
    reg_ip:/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/,//ip
    regMatches:function(_reg, _str){
        if(_reg.test(_str)){
            return true;
        }else{
            return false;
        }
    },


    //==================================================tools
    /* 分页计算 */
    paging:function(_currpage, _totalPage, _amount){
        var _min = _currpage-parseInt(_amount/2);
        if(_min<1) _min = 1;
        var _max = _min+_amount-1;
        if(_max>_totalPage) _max = _totalPage;

        var _pageNumberlist = [];
        for(var i=_min; i<=_max; i++){
            _pageNumberlist.push(i);
        }

        var _obj = {}
        _obj.page = _currpage;//当前页
        _obj.pages = _totalPage;//总页数
        _obj.pageMin = _min;//最小显示页
        _obj.pageMax = _max;//最大显示页
        _obj.numberlist = _pageNumberlist;//显示页码列表
        return _obj;
    },

    //=====================================================obj
    //深度克隆
    deepClone:function(obj){
        var str, newobj = obj.constructor === Array ? [] : {};
        if(typeof obj !== 'object'){
            return;
        } else if(window.JSON){
            str = JSON.stringify(obj), //系列化对象
            newobj = JSON.parse(str); //还原
        } else {
            for(var i in obj){
                newobj[i] = typeof obj[i] === 'object' ?
                deepClone(obj[i]) : obj[i];
            }
        }
        return newobj;
    },
    //obj判断类型：返回传递给他的任意对象的类
    isClass:function(o){
        if(o===null) return "Null";
        if(o===undefined) return "Undefined";
        return Object.prototype.toString.call(o).slice(8,-1);
    },
    /* obj同key写入 */
    objWriteValue:function(_source, _objvalue){
        for(var _key in _objvalue){
            if(_source.hasOwnProperty(_key)){
                if(this.isClass(_objvalue[_key])=="Object"){
                    this.objWriteValue(_source[_key], _objvalue[_key]);
                }else{
                    _source[_key] = _objvalue[_key];
                }
            }
        }
    },



    //=================================================Array 数组
    /* 列表排序： */
    ArraySortKey:function(key,desc) {
        desc = desc || false;
        return function(a,b){
            if(desc){
                return a[key]>b[key] ? -1 : 1;
            }else{
                return a[key]>b[key] ? 1 : -1;
            }
        }
    },






    //==================================================日期

    // 获取距今天dayCount天后的日期 "yy-mm-dd"
    getDateStr: function(dayCount) {
        var dd = new Date();
        dd.setDate(dd.getDate() + dayCount);
        var y = dd.getFullYear();
        var m = dd.getMonth() + 1;
        var d = dd.getDate();
        return y + "-" + m + "-" + d;
    },
    // "yy-mm-dd"转日期
    getDate_byStr: function(_str) {
        return new Date(Date.parse(_str.replace(/-/g, "/")));
    },





    /**
       * 禁止页面滚动
       */
    disableScroll:function() {
        window.addEventListener("touchmove", this.preventDefault);
    },
    /**
     * 允许页面滚动
     */
    allowScroll:function() {
        window.removeEventListener("touchmove", this.preventDefault);
    },
    preventDefault:function(e){
        e.stopPropagation();
        if (e.cancelable) {
            // 判断默认行为是否已经被禁用
            if (!e.defaultPrevented) {
                e.preventDefault();
            }
        }
    },


    /* 获取url参数
        //url.match(new RegExp("[^\?&]*=+[^&]*", 'g'));
    */
    getQueryString:function(url, key) {
        // url = "http://192.168.2.151:8009/?p1=xxxccc&p2=1122%33&p3=22ss22";
        let qulist = url.match(new RegExp("[^\?&]*"+key+"=+[^&]*"));
        return qulist ? qulist[0].split('=')[1] : null;
    },





}