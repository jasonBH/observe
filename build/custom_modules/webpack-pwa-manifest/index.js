const path = require('path');
const fs = require('fs');
const crypto = require("crypto");

class WebpackPWAManifest {
    constructor(options){
        let defaultOptions = {
            manifestSource:'manifest.json',
            manifestTarget:'manifest.json',
            templateTarget:'index.html'
        }
        for(let key in options){
            options[key] = options[key].replace(/\//g, '\\');
        }
        this.options = Object.assign(defaultOptions, options);
    }

    apply(compiler){
        let conf = compiler.options;
        compiler.plugin("make", (compilation, callback)=>{

            callback()
        });

        compiler.plugin('compilation', (compilation) => {
            compilation.plugin('html-webpack-plugin-before-html-processing', (htmlPluginData, callback)=>{
                if(htmlPluginData.outputName==this.options.templateTarget){
                    // copy manifest.json
                    let targetname = this.manifestCopy(compilation, this.options.manifestSource, this.options.manifestTarget);
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

        this.manifestIconHandler(compilation, content);

        let outputName = target;
        if(outputName.indexOf("[chunkhash]")>-1){
            let hash = crypto.createHash('md5');
            hash.update(content);
            let r = hash.digest('hex');
            outputName = outputName.replace('[chunkhash]', r);
            // console.log("manifest chunkhash===========>", outputName)
        }

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
    manifestIconHandler(compilation, _content){
        let content = JSON.parse(_content);
        if(content.icons){
            for(let i=0; i<content.icons.length; i++){
                let icon = content.icons[i];
                console.log("========icon:", path.resolve(__dirname, icon.src))
            }
        }
    }
}

module.exports = WebpackPWAManifest;