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



var libmap = require(PATH_root+'/libmap.json');
console.log("libmap:", libmap)

//输出目录
var out_bin = isDev ? PATH_bindev : PATH_bin;
//输出chunkhash
var out_chunkhash = isDev ? "" : ".[chunkhash]";
var out_hash = isDev ? "" : ".[hash]";

//entry
var entries = function(){
    var entryTSs = glob.sync(PATH_src+libmap.pathTs);
    var entryJSs = glob.sync(PATH_src+libmap.pathJs);
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
var sws = function(){
    var eSWlist = glob.sync(PATH_src+libmap.pathServiceWorkers);
    var map = {};
    for(var i=0; i<eSWlist.length; i++){
        var filePath = eSWlist[i];
        // console.log(filePath)
        var fileName = filePath.substring(filePath.lastIndexOf('\/')+1, filePath.lastIndexOf('.'));
        map[fileName] = filePath;
    }
    return map;
}

//pulgins
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ServiceWorkerWebpackPlugin = require('serviceworker-webpack-plugin');
const testPlugin = require('./FileInfoPlugin');
const WebpackManifest = require('./custom_modules/webpack-manifest');

var plugins = [];

var plugin_html = function(){
    var ehtmllist = glob.sync(PATH_src+libmap.pathHtml);
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
            conf.chunks = ["vendor", "common", fileName];
        }
        conf.favicon = PATH_src+libmap.favicon;
        plus.push(new HtmlWebpackPlugin(conf));
    }
    return plus;
}
plugins = plugins.concat(plugin_html());


plugins.push(
    //抽取公共库/代码，配合entry使用//页面上使用的时候最后一个会块最先加载,其它依次加载
    new webpack.optimize.CommonsChunkPlugin({
        "names": ["common", "vendor"],
        "filename": "[name]"+out_chunkhash+".js",
        minChunks:libmap.minChunks
    }),
    //抽取css
    new ExtractTextWebpackPlugin("css/[name]"+out_chunkhash+".css"),
    //复制
    new CopyWebpackPlugin([
      {
        from: PATH_src+libmap.pathStatic,
        to: out_bin+libmap.pathStatic,
        ignore: ['.*']
      }
    ]),
    //service worker
    new ServiceWorkerWebpackPlugin({
        entry: PATH_src+libmap.pathServiceWorkers,
        filename: "sw.js",
        includes: ['**/*'],
        excludes: ['**/.*', '**/*.map'],
    }),
    // new testPlugin()
    new WebpackManifest({
        filename:path.resolve(PATH_root, './src/serviceworkers/manifest.json'),
        templatename:path.resolve(PATH_root, './src/entries/index.html')
    })
);
//生产环境 清除/压缩
if(isDev==false){
    plugins.unshift(
        new CleanWebpackPlugin(PATH_bin, PATH_root),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true
        })
    );
}
//打包的库
/* plugins.push(
    new webpack.ProvidePlugin({"$":"jquery", "jQuery":"jquery"}),
    new webpack.ProvidePlugin({"_":"lodash"})
    new webpack.ProvidePlugin({"Vue":"vue"})
) */



// console.log(entries())
var config = {
    entry:Object.assign(entries(), {
        vendor:libmap.vendor
    }),
    output:{
        path:out_bin,
        filename:'[name]'+out_chunkhash+'.js',
        chunkFilename:'modules/[name]'+out_chunkhash+'.js',
        publicPath:'/',
    },
    module:{
        // noParse:'//',
        rules:[
            {
                test: /\.vue$/,
                loader:'vue-loader',
                options:{
                    // loaders: { js: 'vue-ts-loader' },
                    // esModule: true
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
                loader:"babel-loader",
                options:{
                    presets:"es2015"
                }
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
                test: /\.scss$/,
                exclude:[PATH_nodeMod],
                use: ExtractTextWebpackPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'sass-loader']
                })
            },
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
        extensions: ['.js', '.ts', '.vue', '.css', '.scss', '.png', '.jpg', '.gif'],
        alias: Object.assign(
            libmap.lib,
            {
                "@":PATH_src,
            }
        )
    },
    externals:{

    },
}
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