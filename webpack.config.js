"use strict"

let path = require('path');
let webpack = require('webpack');
const node_modules_dir = path.resolve(__dirname, "node_modules");
const devPort = 8080;

module.exports = {
    devPort: devPort,
    entry: {
        app: ['webpack/hot/dev-server', 'webpack-dev-server/client?http://localhost:8080',
            path.resolve(__dirname, "demo/index.js")
        ],
        vendors: ['react', 'react-dom']
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: 'http://localhost:${devPort}/dist/',
        filename: '[name].js'
    },
    devtool: 'source-map',
    module: {
        loaders: [{
                test: /\.js$/,
                exclude: [node_modules_dir],
                loader: 'babel'
            },
            {
                test: /\.jsx$/,
                exclude: [node_modules_dir],
                loaders: ['react-hot', 'babel']
            },
            {
                test: /\.css$/,
                loader: 'style!css'
            },
            {
                test: /\.less$/,
                loader: 'style!css!less'
            },
        ]
    },
    resolve: {
        extensions: ['', '.jsx', '.js', 'json'],
        root: path.join(__dirname, "src"),
        alias: {
            LoadReducers: "../LoadReducers",
            actions: "actions/index",
            reducers: "reducers/todos",
            Content: "components/index/Content",
            Manage: "components/manage/manage",
            CameraList: "containers/section/CameraList/CameraList",
            CameraAdd: "containers/section/CameraAdd/CameraAdd",
        }
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            name: ['vendors'],
            filename: 'vendors.js'
        })
    ]
}