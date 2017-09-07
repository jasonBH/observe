export class VerifyPolicy{

    isNoEmpty(value, rule, errMsg){
        if(!value){
            return errMsg;
        }
    }

}
export class Formvalidation{
    constructor(_policy){
        // if(new.target!==Formvalidation){
        //     throw new Error("must to be \"new\" !")
        // }

        this.policy = _policy || new VerifyPolicy();
        this.validationList = [];
        // console.log("FD:", this.policy['isNoEmpty'])

    };
    /*
        @ val   要判断的值
        @ rule 规则 {method:'xxx', orther:''}
        @ errorMsg 返回的信息
    */
    add(val, rule, errorMsg){
        this.validationList.push(()=>{
            return this.policy[rule.method](val, rule, errorMsg);
        })
    }
    start(_callback){
        for(let i=0; i<this.validationList.length; i++){
            let msg = this.validationList[i]();
            if(msg){
                if(_callback) _callback(msg);
                this.clear();
                return false;
            }
        }
        if(_callback) _callback('success');
        this.clear();
        return true;
    }
    clear(){
        this.validationList = [];
    }
}