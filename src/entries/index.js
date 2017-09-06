/* css */
import '@/assets/style/index.scss';
import '@/assets/style/inline.css';
/* plugins */
// import 'babel-polyfill';

/* npm i libs */
// import 'expose-loader?jQuery!expose-loader?$!jquery';
// import "expose-loader?_!lodash";
// import Vue from 'vue';
import Router from 'vue-router';
import FastClick from 'fastclick'
FastClick.attach(document.body);


/* tools */
import utils from '@/lib_custom/Utils.js';
window.utils = utils;

/* service worker */
import swruntime from 'serviceworker-webpack-plugin/lib/runtime';

import {Observer} from '@/observer.js';
import {Formvalidation} from '@/lib_custom/VerifyPolicy.js';


// console.log()

document.documentElement.style.fontSize = document.documentElement.clientWidth / 7.5 + 'px';


console.log("-----------------> index start");
console.log("-----------------> vue:", Vue);
console.log("-----------------> vue-router:", Router)
// console.log("-----------------> _:", _.chunk(['a', 'b', 'c', 'd'], 2));
// console.log("-----------------> jquery:", $)
// $('body').append("<div>juquery test</div>")

//asyn
require(["@/vuetest.js"], (vuetest)=>{
    vuetest.default()
});

//双向绑定
var aaa = {
    v:0
};
// console.log(aaa)
function callbackA(v){
    // console.log("callbackA aaa:", aaa.v);
}
// new Observer(aaa, callbackA);

let btnadd = document.getElementById("add");
btnadd.onclick = function(){
    aaa.v++;
    // alert(aaa.v)
    // alert(wx)

    let img = new Image();
    img.src = 'https://www.huceo.com/zb_users/upload/2015/12/201512151450189288119520.jpg';
    document.body.appendChild(img)


};

//表单验证策略
/* let fd = new Formvalidation();
fd.add('', {method:'isNoEmpty'}, '值不能为空');
let fbs = fd.start((msg)=>{
    // console.log(msg)
}); */
// console.log('表单验证策略 isNoEmpty:',fbs)



//worker
let workerValueEl = document.getElementById("workerValue");
workerValueEl.innerHTML = "Time goes by: 0 s";
// let worker;
function workerOn(event){
    // console.log("worker:"+event.data);
    workerValueEl.innerHTML = "Time goes by: "+parseInt(event.data/1000)+" s";
}

let workstart = document.getElementById("workstart");
let workstop = document.getElementById("workstop");
/* workstart.onclick = function(){
    if(typeof(Worker)=="undefined"){
        alert("Sorry! No Web Worker support..");
        return
    };
    if(!worker){
        worker = new Worker('./static/Workers.js');
        worker.onmessage = workerOn;
    }
    // console.log("start click:", worker)
    worker.postMessage("start");
}
workstop.onclick = function(){
    // if(worker) worker.postMessage("stop");
    worker.terminate();
} */
// console.log("index complete")



// console.log(window.location.href)
// console.log("query:", utils.getQueryString(window.location.href, 'p1'));


// console.log("navigator:", navigator)
// console.log("caches:", caches)

let spinner = document.querySelector('.loader');
spinner.setAttribute('hidden', true);
// setTimeout(()=>{
//     spinner.removeAttribute('hidden');
//     console.log(spinner)
// }, 5000);


/* serviceWorker */
if('serviceWorker' in navigator){
    const registration = swruntime.register()
    .then((registration) => {
        console.log("index => Service Worker Registered:",registration);
        httpSend("/images/fog.png");
    }).catch((error)=>{
        console.log("index => Service Worker Register error:", error);
    });
    console.log("index => Service Worker runtime:", swruntime, registration)
  } else {
    console.log('index => serviceWorker not available')
  }

function httpSend(_url){
    let url = _url;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.onreadystatechange = function() {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
            console.log("xhr.status:", xhr.status)
            //var response = JSON.parse(request.response);
            let response = xhr.response;
            let objectURL = URL.createObjectURL(response);
            let myImage = new Image();
            myImage.src = objectURL;
            document.getElementById("cachediv").appendChild(myImage);
        }
      }
    };
    xhr.error = function(){
        console.log("xhr error:", request)
    }
    console.log("xhr send:", url)
    xhr.send();
}

/* setTimeout(()=>{
    httpSend("/images/fog.png");
}, 3000); */

document.getElementById('butRefresh').addEventListener('click', function() {
    httpSend("/images/rain.png");
});
