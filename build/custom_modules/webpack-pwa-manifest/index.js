/*
@param  {
            source:'manifest.json',//源文件全名
            iconTarget:'',//生成的icon资源路径
            target:'manifest.json',//生成的manifest文件全名
            template:'index.html'//目标模板名称
        }
*/

const path = require('path');
const fs = require('fs');
const crypto = require("crypto");

class WebpackPWAManifest {
    constructor(options){
        let defaultOptions = {
            source:'manifest.json',
            iconTarget:'',
            target:'manifest.json',
            template:'index.html'
        }
        options.source = this.pathReplace(options.source);
        this.options = Object.assign(defaultOptions, options);
    }

    apply(compiler){
        let conf = compiler.options;
        compiler.plugin("make", (compilation, callback)=>{

            callback()
        });

        compiler.plugin('compilation', (compilation) => {
            compilation.plugin('html-webpack-plugin-before-html-processing', (htmlPluginData, callback)=>{
                if(htmlPluginData.outputName==this.options.template){
                    // copy manifest.json
                    let targetname = this.manifestCopy(compilation, this.options.source, this.options.target);
                    //<!--link rel="manifest" href="static/manifest.json"-->
                    let linkmanifest = '<link rel="manifest" href="'+targetname+'">';
                    htmlPluginData.html = htmlPluginData.html.replace(
                        /(<\/head>)/i,
                        `${linkmanifest}</head>`
                    )
                }
                callback(null, htmlPluginData);
            })
        })

        compiler.plugin("emit", (compilation, callback)=>{

            callback();
        })
    }

    manifestCopy(compilation, source, target){
        let content = fs.readFileSync(source, 'utf8');
        compilation.fileDependencies.push(source);

        content = this.manifestIconHandler(compilation, content);

        let outputName = target;
        if(outputName.indexOf("[chunkhash]")>-1){
            let hash = crypto.createHash('md5');
            hash.update(content);
            let r = hash.digest('hex');
            outputName = outputName.replace('[chunkhash]', r);
            // console.log("manifest chunkhash===========>", outputName)
        }
        compilation.assets[outputName] = {
            source: () => content,
            size: () => content.length
        };
        return outputName;
    }

    /*
    {
        "src": "../assets/images/icons/icon-128x128.png",
    }
     */
    manifestIconHandler(compilation, _content){
        let content = JSON.parse(_content);
        if(content.icons){
            for(let i=0; i<content.icons.length; i++){
                let icon = content.icons[i];
                if(!icon.src) continue;
                let basename = path.basename(icon.src);
                let sourceName = path.resolve(path.dirname(this.options.source), icon.src);
                let targetName = this.options.iconTarget+basename;
                icon.src = targetName;

                fs.readFile(sourceName, (error, data)=>{
                    compilation.assets[targetName] = {
                        source: () => data,
                        size: () => data.length
                    };
                })
            }
        }
        return JSON.stringify(content);
    }

    pathReplace(_path){
        return _path.replace(/\//g, '\\');
    }
}

module.exports = WebpackPWAManifest;