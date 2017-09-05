const path = require('path');
const fs = require('fs');

class WebpackSinglePlugin {
    constructor(options){
        
    }
    apply(compiler){
        compiler.plugin('emit', (compilation, callback) => {

            callback();
        });
    }
}
module.exports = WebpackSinglePlugin;