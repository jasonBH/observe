const path = require('path');
const fs = require('fs');

class WebpackManifest {
    constructor(options){
        let defaultOptions = {
            filename:'manifest.json',
            templatename:'index.html'
        }
        this.options = Object.assign(defaultOptions, options);

        console.log("WabpackManifest:\n",JSON.stringify(this.options),'\n\n');
    }

    apply(compiler){
        compiler.plugin('emit', (compilation, callback)=>{
            let htmlContent = fs.readFileSync(this.options.templatename);
            console.log(htmlContent)


            // 把它作为一个新的文件资源插入到 webpack 构建中：
            compilation.assets['fileInfo.md'] = {
                source: function() {
                return htmlContent;
                },
                size: function() {
                return htmlContent.length;
                }
            };



            callback();
        });
    }
}

module.exports = WebpackManifest