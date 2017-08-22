// postMessage("I\'m working before postMessage(\'ali\').");

let ts=0;
let te=0;
function tcount(){
    te = new Date().getTime();
    postMessage(te-ts);
    setTimeout(tcount, 1000);
}

function start(){
    ts = new Date().getTime();
    tcount();
}
function stop(){
    // console.log(this)
}

onmessage = function (event) {
    console.log("worker.js onmessage:", event.data)
    if(event.data=="start"){
        start();
    }else if(event.data=="stop"){
        stop();
    }
}

console.log("Workers self:", self)