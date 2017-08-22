export default ((win,value)=>{
    var tid;
    function refreshRem (){
        value = value || 750;
        let width = document.documentElement.clientWidth;
        let height = document.documentElement.clientHeight;
        let devWidth = height > width ? width : height;
        if (devWidth > value) devWidth = value; //取短后是否会大于750
        document.documentElement.style.fontSize = devWidth / (value / 100) + 'px';
    }
    refreshRem();

    win.addEventListener('resize', function() {
        clearTimeout(tid);
        tid = setTimeout(refreshRem, 300);
    }, false);
    win.addEventListener('pageshow', function(e) {
        if (e.persisted) {
            clearTimeout(tid);
            tid = setTimeout(refreshRem, 300);
        }
    }, false);
})(window)