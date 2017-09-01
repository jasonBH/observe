const path = require('path');
const fs = require('fs');

class WebpackManifest {
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

        compiler.plugin('compilation', (compilation) => {
            //after: html-webpack-plugin-after-html-processing
            compilation.plugin('html-webpack-plugin-before-html-processing', (htmlPluginData, callback)=>{
                if(htmlPluginData.outputName==this.options.templateTarget){
                    /* copy manifest.json */
                    this.manifestCopy(compilation, this.options.manifestSource, this.options.manifestTarget);

                    //<!--link rel="manifest" href="static/manifest.json"-->
                    let linkmanifest = '<link rel="manifest" href="'+this.options.manifestTarget+'">';
                    htmlPluginData.html = htmlPluginData.html.replace(
                        /(<\/head>)/i,
                        `${linkmanifest}</head>`
                    )
                }
                callback(null, htmlPluginData);
            })
        })
    }

    manifestCopy(compilation, source, target){
        let manifestContent = fs.readFileSync(source);

        compilation.assets[target] = {
            source: ()=>{
                return manifestContent;
            },
            size: ()=>{
                return manifestContent.length;
            }
        };
    }
}

module.exports = WebpackManifest