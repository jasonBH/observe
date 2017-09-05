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
            //after: html-webpack-plugin-after-html-processing
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
        let content = fs.readFileSync(source);
        compilation.fileDependencies.push(source);

        /* var outputName = compilation.mainTemplate.applyPluginsWaterfall('asset-path', target, {
            hash: compilation.hash,
            chunk:{
                id:compilation.hash,
                name:target,
                hash:compilation.hash,
                hashWithLength:content.length
            },
            filename:target,
            basename:source
        }); */

        let hash = crypto.createHash('md5');
        hash.update(content);
        let r = hash.digest('hex');
        let outputName = target.replace('[chunkhash]', r);
        console.log("manifest chunkhash===========>", outputName)

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
}

module.exports = WebpackPWAManifest;