const path = require('path');
const fs = require('fs-extra');

function FileInfoPlugin(options) {}

FileInfoPlugin.prototype.apply = function(compiler) {
  compiler.plugin('emit', function(compilation, callback) {
    // 创建一个头部字符串：
    var fileInfo = 'In this build:\n\n';

    let path_work = path.resolve();
    fileInfo += "path_work:"+path_work+"\n";
    let path_html = path.resolve('./src/entries/')
    // let content = compilation.assets;
    // let filename = compilation.fileDependencies[path_html+'index.html']+"\n";
    let filename = path_html+'\\index.html';
    fileInfo += "filename:"+filename+"\n";
    /* for(let key in compilation.assets){
      fileInfo += "compilation.assets key:"+key+"\n";
    } */
    let htmlContent = fs.readFileSync(filename);
    fileInfo += "file content:"+htmlContent+"\n";

    let tag_manifest = '<link rel="manifest" href="static/manifest.json">';

    // 把它作为一个新的文件资源插入到 webpack 构建中：
    compilation.assets['fileInfo.md'] = {
      source: function() {
        return fileInfo;
      },
      size: function() {
        return fileInfo.length;
      }
    };

    callback();
  });
};

module.exports = FileInfoPlugin;