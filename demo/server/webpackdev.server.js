let webpack = require("webpack");
let WebpackDevServer = require("webpack-dev-server");
let url = require("url");
let path = require("path");
let proxy = require("proxy-middleware");
let config = require('../../webpack.config');
const contentPath = path.resolve(__dirname);

module.exports = function (app) {
    app.use('/dist', proxy(url.parse('http://localhost:${config.devPort}/dist')));

    let server = new WebpackDevServer(webpack(config), {
            contentBase: contentPath,
            hot: true,
            quiet: false,
            noInfo: false,
            publicPath: '/dist/',
            stats: {
                colors: true
            }
        })
        .listen(config.devPort, 'localhost', function () {
            console.log('webpack server listen ${config.devPort}');
        })
}