var webpack=require('webpack');
var HtmlWebpackPlugin=require('html-webpack-plugin');
var ExtractTextPlugin=require('extract-text-webpack-plugin');
var merge=require('webpack-merge');
var webpackBaseConfig=require('./webpack.config.js');
var VueLoaderPlugin = require('vue-loader/lib/plugin');
var TerserPlugin = require('terser-webpack-plugin');

// 清空基本配置的插件列表
webpackBaseConfig.plugins=[];

module.exports=merge(webpackBaseConfig,{
    output:{
        publicPath:'/dist/',
        // publicPath:'/dist/',
        // 将入口文件重命名为带有20 位hash 值的唯一文件
        filename:'[name].[hash].js',
        chunkFilename:'[name].chunk.js'
    },
    plugins:[
        new ExtractTextPlugin({
            // 提取css ， 并重命名为带有20 位hash 值的唯一文件
            filename:'[name].[hash].css',
            allChunks:true
        }),
        // 定义当前node 环境为生产环境
        new webpack.DefinePlugin({
            'process.env':{
                NODE_ENV:'"production"'
            }
        }),
        // 提取模板，并保存入口html 文件
        new HtmlWebpackPlugin({
            filename:'./index_prod.html',
            template:'./index.ejs',
            inject:false
        }),
        new VueLoaderPlugin()
    ],
    optimization:{
        // 压缩js
        minimizer: [
            new TerserPlugin({
                cache: true, // 开启缓存
                parallel: true, // 支持多进程
                sourceMap: true, 
            }),
        ]
    }
});