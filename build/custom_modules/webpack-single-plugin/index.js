const path = require('path');
const fs = require('fs');

class WebpackSinglePlugin {
    constructor(list){
        this.templatelist = [];
        list.forEach((obj)=>{
            obj.source = this.pathReplace(obj.source);
            obj.basename = path.basename(obj.source);
            this.templatelist.push(obj);
        });
    }

    apply(compiler){

        compiler.plugin('compilation', (compilation) => {
            compilation.plugin('html-webpack-plugin-before-html-processing', (htmlPluginData, callback)=>{
                let tagScript = "";
                for(let i=0; i<this.templatelist.length; i++){
                    let obj = this.templatelist[i];
                    if(obj.template==htmlPluginData.outputName){
                        tagScript += `<script type="text/javascript" src='${obj.target}'></script>`;
                    }
                }
                if(tagScript){
                    htmlPluginData.html = htmlPluginData.html.replace(
                        /(<\/head>)/i,
                        `${tagScript}</head>`
                    )
                }

                callback(null, htmlPluginData);
            })
        })

        compiler.plugin('emit', (compilation, callback) => {
            this.templatelist.forEach((obj)=>{
                this.fileCopy(compilation, obj.source, obj.target);
            })

            callback();
        });
    }

    fileCopy(compilation, source, target){
        let content = fs.readFileSync(source);
        compilation.fileDependencies.push(source);

        let outputName = target;
        compilation.assets[outputName] = {
            source: ()=>{
                return content;
            },
            size: ()=>{
                return content.length;
            }
        };
        return outputName;
    }

    pathReplace(_path){
        return _path.replace(/\//g, '\\');
    }
}
module.exports = WebpackSinglePlugin;