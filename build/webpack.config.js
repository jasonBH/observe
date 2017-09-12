const webpack = require('webpack')
const path = require('path');
const glob = require('glob');

var PATH_root = path.resolve(__dirname, '../');
var PATH_src = path.resolve(PATH_root, './src');
var PATH_bindev = path.resolve(PATH_root, './bin_dev');
var PATH_bin = path.resolve(PATH_root, './bin');
var PATH_nodeMod = path.resolve(PATH_root, './node_modules');

console.log("PATH_src:"+PATH_src+"\n")

// production | development
var NODE_ENV = process.env.NODE_ENV;
var isDev = NODE_ENV=="development";
console.log("env:", NODE_ENV);
var minimist = require('minimist');
console.log("run parameter:", minimist(process.argv).dev);


/* 以 src 目录为基准 */
var pathmap = require('./pathmap.json');
console.log("pathmap:", pathmap)
var getPathToSrc = function(_path){
    return path.resolve(PATH_src, _path);
}


//输出目录
var out_bin = isDev ? PATH_bindev : PATH_bin;
//输出chunkhash
var out_chunkhash = isDev ? "" : ".[chunkhash]";
var out_hash = isDev ? "" : ".[hash]";

//entry
var entries = function(){
    var entryTSs = glob.sync(getPathToSrc(pathmap.pathTs));
    var entryJSs = glob.sync(getPathToSrc(pathmap.pathJs));
    var entryList = entryTSs.concat(entryJSs);
    var map = {};
    for(var i=0; i<entryList.length; i++){
        var filePath = entryList[i];
        // console.log(filePath)
        var fileName = filePath.substring(filePath.lastIndexOf('\/')+1, filePath.lastIndexOf('.'));
        map[fileName] = filePath;
    }
    return map;
}

//pulgins
const testPlugin = require('./custom_modules/FileInfoPlugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ServiceWorkerWebpackPlugin = require('serviceworker-webpack-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const WebpackPWAManifest = require('./custom_modules/webpack-pwa-manifest');
const WebpackSinglePlugin = require('./custom_modules/webpack-single-plugin');



var plugins = [];

var plugin_html = function(){
    var ehtmllist = glob.sync(getPathToSrc(pathmap.pathHtml));
    var plus = [];
    var entriesFiles = entries();
    for(var i=0; i<ehtmllist.length; i++){
        var filePath = ehtmllist[i];
        var fileName = filePath.substring(filePath.lastIndexOf('\/')+1, filePath.lastIndexOf('.'));
        var conf = {
            template:filePath,
            filename:fileName+'.html'
        }
        if(fileName in entriesFiles){
            conf.inject = 'body';
            conf.chunks = ["common", fileName];
        }
        conf.favicon = getPathToSrc(pathmap.favicon);
        plus.push(new HtmlWebpackPlugin(conf));
    }
    return plus;
}
plugins = plugins.concat(plugin_html());

//暴露的库
// plugins.push(
    // new webpack.ProvidePlugin({"$":"jquery", "jQuery":"jquery"}),
    // new webpack.ProvidePlugin({"_":"lodash"})
    // new webpack.ProvidePlugin({"Vue":"vue"})
// )
// const extractCSS = new ExtractTextPlugin("css/[name]"+out_chunkhash+".css");
// const extractSCSS = new ExtractTextPlugin("css/[name]"+out_chunkhash+".css");

plugins.push(
    //抽取公共库/代码，配合entry使用//页面上使用的时候最后一个会块最先加载,其它依次加载
    new webpack.optimize.CommonsChunkPlugin({
        "names": ["common"],
        "filename": "entry/[name]"+out_chunkhash+".js",
        minChunks: function (module, count) {
            // any required modules inside node_modules are extracted to common
            return (
              module.resource &&
              /\.js$/.test(module.resource) &&
              module.resource.indexOf(
                path.join(__dirname, '../node_modules')
              ) === 0
            )
        }
    }),
    //抽取css
    new ExtractTextWebpackPlugin("css/[name]"+out_chunkhash+".css"),
    //service worker
    new ServiceWorkerWebpackPlugin({
        entry: getPathToSrc(pathmap.pathServiceWorkers),
        filename: "sw.js",
        includes: ['**/*'],
        excludes: ['**/.*', '**/*.map'],
    }),
    //复制目录/文件
    new CopyWebpackPlugin([
        {
          from: getPathToSrc(pathmap.pathStatic),
          to: path.resolve(out_bin, pathmap.pathStatic),
          ignore: ['.*']
        }
    ])
);
if(isDev==false) plugins.push(new OptimizeCSSPlugin());

if(pathmap["WebpackPWAManifest"]){
    let _config = pathmap["WebpackPWAManifest"];
    _config.source = getPathToSrc(_config.source);
    _config.target = _config.target.replace(".json", out_chunkhash+".json");
    plugins.push(new WebpackPWAManifest(_config));
}
/*
"WebpackSinglePlugin":[
        {
            "template":"index.html",
            "source":"../node_modules/vue/dist/vue.min.js",
            "target":"static/vue.min.js"
        }
    ],
 */
if(pathmap["WebpackSinglePlugin"] && pathmap["WebpackSinglePlugin"].length>0){
    let _config = [];
    pathmap["WebpackSinglePlugin"].forEach((_obj)=>{
        let newobj = {};
        newobj.template = _obj.template;
        newobj.source = getPathToSrc(_obj.source);
        newobj.target = _obj.target;
        _config.push(newobj);
    });
    plugins.push(new WebpackSinglePlugin(_config));
}

//生产环境 清除/压缩
if(isDev==false){
    plugins.unshift(
        new CleanWebpackPlugin(PATH_bin, PATH_root),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true
        })
    );
}





var config = {
    entry:Object.assign(entries(), {

    }),
    output:{
        path:out_bin,
        filename:'entry/[name]'+out_chunkhash+'.js',
        chunkFilename:'modules/[name]'+out_chunkhash+'.js',
        publicPath:'/',
    },
    module:{
        // noParse:'/vue/',
        rules:[
            {
                test: /\.vue$/,
                loader:'vue-loader',
                options:{
                    // loaders: { js: 'vue-ts-loader' },
                    esModule: true
                }
            },
            {
                test:/\.ts$/,
                loader:'ts-loader',
                options:{
                    appendTsSuffixTo: [/\.vue$/]//<script lang="ts">
                }
            },
            {
                test:/\.js$/,
                exclude:[PATH_nodeMod],
                include: [PATH_src],
                loader:"babel-loader"
            },
            {
                test: /\.css$/,
                exclude:[PATH_nodeMod],
                use: ExtractTextWebpackPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                })
            },
            {
                test: /\.scss|.sass$/i,
                use: [
                    { loader: "style-loader" }, // 将 JS 字符串生成为 style 节点
                    { loader: "css-loader" }, // 将 CSS 转化成 CommonJS 模块
                    { loader: "sass-loader" } // 将 Sass 编译成 CSS
                ]
            },
            // {
            //     test: /\.scss$/,
            //     exclude:[PATH_nodeMod],
            //     use: ExtractTextWebpackPlugin.extract({
            //         fallback: 'style-loader',
            //         use: ['css-loader', 'sass-loader']
            //     })
            // },
            {
                test:/\.html$/,
                use:'html-loader'
            },
            {
                test:/\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
                loader:'file-loader',
                options:{
                    name:'images/[name]'+out_hash+'.[ext]',
                }
            }
        ]
    },
    devtool: isDev ? 'source-map': false,
    plugins:plugins,
    resolve: {
        modules: [PATH_root+"/node_modules/", PATH_src],
        extensions: ['.js', '.ts', '.vue', '.css', '.scss', '.sass', '.json'],
        alias: Object.assign(
            pathmap.lib,
            {
                "@":PATH_src,
            }
        )
    },
    externals:{

    },
}
// console.log("config:",JSON.stringify(config))
// module.exports = config;
const compiler = webpack(config);
if(isDev){
    const watching = compiler.watch({
        ignored: /node_modules/,
        // poll: 1000
    }, (err, stats) => {
        // 在这里打印 watch/build 结果...
        if (err) {
            console.error(err.stack || err);
            if (err.details) {
                console.error(err.details);
            }
            return;
        }
        const info = stats.toJson();
        if (stats.hasErrors()) {
            console.error(info.errors);
        }
        if (stats.hasWarnings()) {
            console.warn(info.warnings)
        }

        console.log(stats.toString({
            assets: true,// 增加资源信息
            chunks: false,  // 使构建过程更静默无输出
            colors: true,    // 在控制台展示颜色
            cached: false,// 增加缓存了的（但没构建）模块的信息
            cachedAssets: false,// Show cached assets (setting this to `false` only shows emitted files)
            entrypoints: true,// Display the entry points with the corresponding bundles
        }));
    });
}else{
    compiler.run((err, stats)=>{
        if (err) {
            console.error(err.stack || err);
            if (err.details) {
                console.error(err.details);
            }
            return;
        }
        const info = stats.toJson();
        if (stats.hasErrors()) {
            console.error(info.errors);
        }
        if (stats.hasWarnings()) {
            console.warn(info.warnings)
        }

        console.log(stats.toString({
            assets: true,// 增加资源信息
            chunks: false,  // 使构建过程更静默无输出
            colors: true,    // 在控制台展示颜色
            cached: false,// 增加缓存了的（但没构建）模块的信息
            cachedAssets: false,// Show cached assets (setting this to `false` only shows emitted files)
            entrypoints: true,// Display the entry points with the corresponding bundles
        }));
    })
}